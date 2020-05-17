import { Tag } from './tags';

export interface FilterInputs {
    query: string;
    tags: Tag[];
    date: Date | null;
}
