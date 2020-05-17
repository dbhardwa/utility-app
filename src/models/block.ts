import { SubBlock } from './sub-block';

export interface Block {
    timestamp: string;
    uid: string;

    contents: SubBlock[];
}
