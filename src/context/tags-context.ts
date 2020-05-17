import React from "react";
import { Tags } from "../models/tags";

let defaultTagsContext: ITagsContext = {
    allTags: {},
    addTag: () => { }
}

export const TagsContext = React.createContext(defaultTagsContext);

export interface ITagsContext {
    allTags: Tags;
    addTag: Function;
}