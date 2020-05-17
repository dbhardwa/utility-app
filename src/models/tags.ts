export type Tag = string;

export interface Tags {
    [tag: string]: MetaTag;
}

export interface MetaTag {
    occurances: number;
    color: string;
}