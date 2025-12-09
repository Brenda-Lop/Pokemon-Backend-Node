export class ExternalApiNotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'ExternalApiNotFoundError';
  }
}
export class ExternalApiRequestFailedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'ExternalApiRequestFailedError';
  }
}
