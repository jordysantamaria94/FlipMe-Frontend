import { Decks } from "./decks";

export interface IAllDecks {
    favs?: Decks[],
    originals?: Decks[],
    recentlys?: Decks[],
}

export class AllDecks implements IAllDecks {
    constructor(
        public favs?: Decks[],
        public originals?: Decks[],
        public recentlys?: Decks[],
    ) {}
}