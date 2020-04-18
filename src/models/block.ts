export interface Block {
    timestamp: Date;
    uid: string;

    contents: SubBlock[];
}

export interface SubBlock {
    timestamp: Date;
    uid: string;

    tags: Tag[];
    template: string;
}

export type Tag = string;