import { Tags } from './tags';

export interface SubBlock {
    uid: string;
    title?: string;
    tags: Tags;
    template: string;
}
