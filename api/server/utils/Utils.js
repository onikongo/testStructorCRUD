export default class Util {
  constructor() {
    this.statusCode = null;
    this.type = null;
    this.data = null;
    this.message = null;
    this.total = null;
  }

  setSuccess(statusCode, message, data ,total) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.type = 'success';
    this.total = total;
  }

  setError(statusCode, message) {
    this.statusCode = statusCode;
    this.message = message;
    this.type = 'error';
  }

  send(res) {
    const result = {
      status: this.statusCode,
      message: this.message,
      total: this.total,
      data: this.data,
    };

    if (this.type === 'success') {
      return res.status(this.statusCode).json(result);
    }
    return res.status(this.statusCode).json({
      status: this.type,
      message: this.message,
    });
  }
}
