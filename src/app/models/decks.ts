export interface IDecks {
    id?: number,
    name?: string,
    description?: string,
    // image?: string,
    timer?: number,
    is_private?: number,
    created_by?: string,
    created_at?: string,
}

export class Decks implements IDecks {
    constructor(
        public id?: number,
        public name?: string, 
        public description?: string, 
        // public image?: string,
        public timer?: number,
        public is_private?: number,
        public created_by?: string,
        public created_at?: string,
    ) {}
}