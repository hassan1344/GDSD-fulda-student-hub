import pkg from "joi";
const { ValidationError } = pkg;
import CustomError from "./custom-error.js";
import CustomSuccess from "./custom-success.js";

export const ResHandler = (err, req, res, next) => {
  let StatusCode = 500;
  let Data = {
    message: err.message,
    status: false,
  };
  if (err instanceof ValidationError) {
    StatusCode = 400;
    Data = {
      message: err.message,
      status: false,
    };
  }
  if (err instanceof CustomError) {
    StatusCode = err.status;
    Data = {
      message: err.message,
      status: false,
    };
  }

  // err instanceof CustomSuccess
  if (err instanceof CustomSuccess) {
    StatusCode = err.status;
    Data = {
      message: err.message,
      data: err.Data,
      status: true,
    };
  }

  return res.status(StatusCode).json(Data);
};
