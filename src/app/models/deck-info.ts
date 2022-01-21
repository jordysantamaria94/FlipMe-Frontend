import { Decks } from "./decks";
import { PreviewDeck } from "./preview-deck";

export interface IDeckInfo {
    deck?: Decks,
    cards?: PreviewDeck[],
}

export class DeckInfo implements IDeckInfo {
    constructor(
        public deck?: any,
        public cards?: PreviewDeck[],
    ) {}
}