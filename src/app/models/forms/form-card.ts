export interface IFormCard {
    id_card?: number,
    id_deck?: number,
    question?: string,
    answer?: string,
    desc_answer?: string,
    created_at?: string,
    updated_at?: string
}

export class FormCard implements IFormCard {
    constructor(
        public id_card?: number,
        public id_deck?: number,
        public question?: string,
        public answer?: string,
        public desc_answer?: string,
        public created_at?: string,
        public updated_at?: string
    ) { }
}