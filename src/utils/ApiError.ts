class ApiError extends Error {
  constructor(
    private readonly statusCode: number,
    message: string = 'Something went wrong',
    private readonly data = null,
    private readonly success: boolean = false,
    stack: string = ''
  ) {
    super(message);
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
