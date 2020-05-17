import ApiContainer from "../api-container";
import { Tags, Tag, MetaTag } from "../../models/block";

// Operations needed for native application.
const electron = window.require('electron');
const fs = electron.remote.require('fs');

// TODO: Needs proper error handling.
export default class TagsApi {
    public readTags(): Tags {
        // TODO: This assumes this file exists, the app needs to create a new folder & file to start storing tags if this is not the case.
        const data = fs.readFileSync(ApiContainer.paths.tagsFile());
        const tags: Tags = JSON.parse(data.toString());
        return tags;
    }

    public addTag(allTags: Tags, tag: Tag): Tags {
        if (!allTags[tag]) {
            const metaTag: MetaTag = { occurances: 0, color: '' };
            const updatedAllTags: Tags = Object.assign(allTags, { [tag]: metaTag });

            fs.writeFile(ApiContainer.paths.tagsFile(), JSON.stringify(updatedAllTags), (error: Error) => {
                if (error) throw error;
            });

            return updatedAllTags;
        } else {
            throw new Error('Tag name already exists.');
        }
    }
}