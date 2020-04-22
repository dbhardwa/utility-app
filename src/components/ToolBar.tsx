import React, { useState, ChangeEvent, FormEvent } from 'react'
import { Tag } from '../models/block';
import * as mockTags from '../mocks/tags.json';

function ToolBar(props: ToolBarProps) {
    const [query, setQuery] = useState<string>('');
    // @ts-ignore
    const [tags, setTags] = useState<Tag[]>(mockTags['default']);

    function handleQuery(inputQuery: string) {
        // TODO: Might want to process the data before passing to props.
        setQuery(inputQuery);
        props.queryEntries(inputQuery);
    }

    function handleTagMultiSelect(event: ChangeEvent) {
        let target = event.nativeEvent.target as HTMLSelectElement,
            selectedTagElements = target.selectedOptions,
            selectedTags: Tag[] = [];

        for (const tag of selectedTagElements) {
            selectedTags.push(tag.value);
        }

        console.log(selectedTags);
        props.filterTags(selectedTags);
    }

    return (
        <div className="tool-bar">
            <button onClick={() => props.createNewEntry()}>
                ADD ENTRY
            </button>
            <input type="text" value={query} onChange={(event) => handleQuery(event.target.value)} />
            <select multiple onChange={handleTagMultiSelect}>
                {tags.map(tag => (
                    <option value={tag}>#{tag}</option>
                ))}
            </select>
        </div>
    );
}

interface ToolBarProps {
    createNewEntry: Function;
    queryEntries: Function;
    filterTags: Function;
}

export default ToolBar;
