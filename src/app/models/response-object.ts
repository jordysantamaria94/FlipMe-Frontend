export interface IResponseObject {
    success?: boolean,
    response?: any
}

export class ResponseObject implements IResponseObject {
    constructor(
        public success?: boolean,
        public response?: any
    ) {}
}