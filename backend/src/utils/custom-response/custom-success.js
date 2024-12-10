class CustomSuccess {
  constructor(Data, message, status) {
    this.Data = Data;
    this.message = message;
    this.status = status;
  }
  static createSuccess(Data, message, status) {
    return new CustomSuccess(Data, message, status);
  }
  static ok(Data = "OK") {
    return new CustomSuccess(Data, 200);
  }
  static created(Data, message = "Created") {
    return new CustomSuccess(Data, message, 201);
  }
  static accepted(Data) {
    return new CustomSuccess(Data, 202);
  }
  static noContent(Data) {
    return new CustomSuccess(Data, 204);
  }
}

export default CustomSuccess;
