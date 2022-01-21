export interface IGtagEvent {
    name_event?: string,
    params?: {
        event_category?: string,
        action?: string,
        event_label?: string
    }
}

export class GtagEvent implements IGtagEvent {
    constructor(
        public name_event?: string,
        public params?: {
            event_category?: string,
            action?: string,
            event_label?: string
        }
    ) { }
}