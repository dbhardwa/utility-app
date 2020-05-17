import { Tags } from './tags';

export interface FilterInputs {
    query: string;
    tags: Tags;
    date: Date | null;
}
