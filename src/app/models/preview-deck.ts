export interface IPreviewDeck {
    id?: number,
    deck?: string,
    description?: string,
    // image?: string,
    timer?: number,
    is_private?: number,
    createdby?: string,
    question?: string,
}

export class PreviewDeck implements IPreviewDeck {
    constructor(
        public id?: number,
        public deck?: string, 
        public description?: string, 
        // public image?: string,
        public timer?: number,
        public is_private?: number,
        public createdby?: string,
        public question?: string,
    ) {}
}