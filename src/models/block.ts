export interface Block {
    timestamp: string;
    uid: string;

    contents: SubBlock[];
}

export interface SubBlock {
    uid: string;

    tags: Tag[];
    template: string;
}

export type Tag = string;