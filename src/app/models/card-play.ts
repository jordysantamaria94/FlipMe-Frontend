export interface ICardPlay {
    id?: number,
    id_deck?: number,
    question?: string,
    answer?: string,
    desc_answer?: string,
    created_at?: string,
    updated_at?: string,
    deleted_at?: string
}

export class CardPlay implements ICardPlay {
    constructor(
        public id?: number,
        public id_deck?: number,
        public question?: string, 
        public answer?: string, 
        public desc_answer?: string,
        public created_at?: string,
        public updated_at?: string,
        public deleted_at?: string
    ) {}
}