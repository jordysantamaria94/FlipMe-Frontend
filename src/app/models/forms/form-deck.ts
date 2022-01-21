export interface IFormDeck {
    id?: number,
    id_user?: number,
    title?: string,
    description?: string,
    timer?: number,
    is_private?: number,
    created_at?: string,
    updated_at?: string
}

export class FormDeck implements IFormDeck {
    constructor(
        public id?: number,
        public id_user?: number,
        public title?: string,
        public description?: string,
        public timer?: number,
        public is_private?: number,
        public created_at?: string,
        public updated_at?: string
    ) { }
}