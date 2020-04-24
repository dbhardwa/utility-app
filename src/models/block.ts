export interface Block {
    timestamp: string;
    uid: string;

    contents: SubBlock[];
}

export interface SubBlock {
    uid: string;

    title?: string;
    tags: Tag[];
    template: string;
}

export interface FilterInputs {
    query: string;
    tags: Tag[];
    date: Date | null;
}

export type Tag = string;