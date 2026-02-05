/**
 * Retry utility with exponential backoff for API calls
 */

export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
};

/**
 * Error types that should trigger a retry
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    // Rate limit errors
    if (message.includes('rate limit') || message.includes('429')) {
      return true;
    }
    // Timeout errors
    if (message.includes('timeout') || message.includes('timed out')) {
      return true;
    }
    // Server errors (5xx)
    if (message.includes('500') || message.includes('502') ||
        message.includes('503') || message.includes('504')) {
      return true;
    }
    // Network errors
    if (message.includes('network') || message.includes('fetch failed') ||
        message.includes('econnreset') || message.includes('socket')) {
      return true;
    }
  }
  return false;
}

/**
 * Calculate delay with exponential backoff and jitter
 */
function calculateDelay(attempt: number, config: RetryConfig): number {
  const exponentialDelay = config.baseDelayMs * Math.pow(2, attempt);
  const jitter = Math.random() * 0.3 * exponentialDelay; // 0-30% jitter
  const delay = Math.min(exponentialDelay + jitter, config.maxDelayMs);
  return Math.round(delay);
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Execute a function with retry logic
 *
 * @param fn - Async function to execute
 * @param config - Retry configuration
 * @returns Result of the function
 * @throws Last error if all retries fail
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      const result = await fn();

      // Check for empty response (specific to OpenAI)
      if (result === null || result === undefined || result === '') {
        throw new Error('Empty response received');
      }

      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on last attempt
      if (attempt === config.maxRetries) {
        break;
      }

      // Only retry on retryable errors
      if (!isRetryableError(error)) {
        throw lastError;
      }

      const delay = calculateDelay(attempt, config);
      console.log(`Retry attempt ${attempt + 1}/${config.maxRetries} after ${delay}ms - ${lastError.message}`);
      await sleep(delay);
    }
  }

  throw lastError || new Error('Retry failed with unknown error');
}
