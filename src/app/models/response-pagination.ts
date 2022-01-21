export interface IResponsePagination {
    current_page?: number,
    data?: any[],
    first_page_url?: string,
    from?: string,
    last_page?: number,
    last_page_url?: string,
    links?: any[],
    next_page_url?: string,
    path?: string,
    per_page?: number,
    prev_page_url?: string,
    to?: string,
    total?: number
}

export class ResponsePagination implements IResponsePagination {
    constructor(
        public current_page?: number,
        public data?: any[],
        public first_page_url?: string,
        public from?: string,
        public last_page?: number,
        public last_page_url?: string,
        public links?: any[],
        public next_page_url?: string,
        public path?: string,
        public per_page?: number,
        public prev_page_url?: string,
        public to?: string,
        public total?: number
    ) { }
}