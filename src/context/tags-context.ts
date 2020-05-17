import React from "react";
import { Tags, Tag } from "../models/tags";

export const defaultTagsContext: ITagsContext = {
    allTags: {},
    addTag: () => { },
    getFilteredAllTags: (allTags: Tags, selectedTags: Tag[]): Tags => {
        const filteredAllTags = Object.assign({}, allTags);

        selectedTags.forEach((tag: Tag) => {
            if (allTags[tag]) delete filteredAllTags[tag];
        });

        return filteredAllTags;
    }
}

export const TagsContext = React.createContext(defaultTagsContext);

export interface ITagsContext {
    allTags: Tags;
    addTag: Function;
    getFilteredAllTags: Function;
}