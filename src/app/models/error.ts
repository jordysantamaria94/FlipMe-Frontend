export interface IError {
    error?: {
        errors?: {
            email?: string[],
        },
        message?: string
    }
}

export class Error implements IError {
    constructor(
        public error?: {
            errors?: {
                email?: string[]
            },
            message?: string
        },
    ) { }
}