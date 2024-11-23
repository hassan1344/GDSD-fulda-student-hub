class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.message = message;
  }
  static createError(message, status) {
    return new CustomError(message, status);
  }
  static notFound(message = "Not Found") {
    return new CustomError(message, 404);
  }
  static badRequest(message = "Bad Request") {
    return new CustomError(message, 400);
  }
  static unauthorized(message = "Unauthorized") {
    return new CustomError(message, 401);
  }
  static forbidden(message = "Forbidden") {
    return new CustomError(message, 403);
  }
  static internal(message = "Internal Server Error") {
    return new CustomError(message, 500);
  }
  static DataWithErrors(data, message, status) {
    return {
      user: data,
      message: message,
      status: status,
    };
  }
}

export default CustomError;
