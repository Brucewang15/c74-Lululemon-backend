export enum HttpCode {
  E200 = 200,
  E201 = 201,
  E400 = 400, // input error
  E404 = 404, // not found
}

export class ResponseClass {
  msg: string;
  statusCode: HttpCode;
  data: any;

  constructor(statusCode: HttpCode, msg: string = null, data = null) {
    this.statusCode = statusCode;
    this.msg = msg;
    this.data = data;
  }
}
