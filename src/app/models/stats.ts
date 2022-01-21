export interface IStats {
    id?: number,
    id_deck?: number,
    id_user?: number,
    time?: number,
    score?: number,
    created_at?: string,
    updated_at?: string,
    deleted_at?: string
}

export class Stats implements IStats {
    constructor(
        public id?: number,
        public id_deck?: number,
        public id_user?: number,
        public time?: number,
        public score?: number,
        public created_at?: string,
        public updated_at?: string,
        public deleted_at?: string
    ) { }
}