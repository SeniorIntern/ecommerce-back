class ApiResponse {
  constructor(
    private readonly statusCode: number,
    private readonly data: Record<string, any>,
    private readonly message: string = 'Success',
    private readonly success = statusCode >= 400 ? false : true
  ) { }
}

export { ApiResponse };
