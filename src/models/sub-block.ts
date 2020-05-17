import { Tag } from './tags';

export interface SubBlock {
    uid: string;
    title?: string;
    tags: Tag[];
    template: string;
}
