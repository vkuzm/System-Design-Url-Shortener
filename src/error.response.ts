export default class ErrorResponse {
  constructor(private readonly code: number, private readonly message: string) { };

  static build(code: number, message: string) {
    return new ErrorResponse(code, message);
  }
}