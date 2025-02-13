export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class SupabaseError extends AppError {
  constructor(
    message: string,
    public code?: string,
    details?: Record<string, unknown>
  ) {
    super(400, message, details);
    this.name = 'SupabaseError';
  }
}

export function isSupabaseError(error: unknown): error is SupabaseError {
  return error instanceof Error && error.name === 'SupabaseError';
} 