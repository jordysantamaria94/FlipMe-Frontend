export interface IResponseArray {
    success?: boolean,
    response?: any[]
}

export class ResponseArray implements IResponseArray {
    constructor(
        public success?: boolean,
        public response?: any[]
    ) {}
}