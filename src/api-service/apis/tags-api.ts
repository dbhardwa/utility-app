import ApiContainer from "../api-container";
import { Tags, MetaTag, Tag } from "../../models/tags";

// Operations needed for native application.
const electron = window.require('electron');
const fs = electron.remote.require('fs');

export default class TagsApi {
    public readTags(): Tags {
        const tagsFilePath = ApiContainer.paths.tagsFile();

        // Check if the file and directory exists (if not, make it).
        if (!fs.existsSync(tagsFilePath)) {
            if (!fs.existsSync(path.dirname(tagsFilePath))) {
                fs.mkdirSync(path.dirname(tagsFilePath));
            }

            fs.writeFileSync(tagsFilePath, JSON.stringify({}));
            return {};
        }

        const data = fs.readFileSync(tagsFilePath);
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