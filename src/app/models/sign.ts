export interface ISign {
    id?: number,
    id_role?: number,
    name?: string,
    email?: string,
    password?: string,
    is_social?: number,
    social?: string,
    created_at?: string,
    updated_at?: string,
    deleted_at?: string,
}

export class Sign implements ISign {
    constructor(
        public id?: number,
        public id_role?: number,
        public name?: string,
        public email?: string,
        public password?: string,
        public is_social?: number,
        public social?: string,
        public created_at?: string,
        public updated_at?: string,
        public deleted_at?: string,
    ) { }
}