import React, { useState, ChangeEvent } from 'react';
import { Tag, Tags } from '../models/tags';
import './SearchAddSelect.css';

function SearchAddSelect(props: SearchAddSelectProps) {
    const [inFocus, setInFocus] = useState<boolean>(false);
    const [query, setQuery] = useState<string>('');
    const [add, setAdd] = useState<string>('');
    const [filteredTags, setFilteredTags] = useState<Tag[] | null>(null);

    function handleQuery(event: ChangeEvent<HTMLInputElement>) {
        let query = event.target.value;
        setQuery(query);

        if (query !== '') {
            query = query.replace(/^#/g, '');
            const filteredTags = Object.keys(props.allTags).filter((tag: Tag) => tag.includes(query));
            setFilteredTags(filteredTags);
        } else {
            setFilteredTags(null);
        }
    }

    function handleAddTag(event: React.KeyboardEvent<HTMLInputElement>) {
        // TODO: Set any newly added tag to selected as well.
        if (event.which === 13) {
            event.preventDefault();
            props.addToAllTags(add.replace(/^#/g, ''));
            setAdd('');
        }
    }

    return (
        <div className="search-add-select-container">
            <div
                className="select"
                onClick={() => setInFocus(!inFocus)}
            >
                {(props.selectedTags.length > 0) ?
                    props.selectedTags.map((tag: Tag) => (
                        <span key={tag}>
                            {tag}
                            <button
                                onClick={(event) => {
                                    event.stopPropagation();
                                    props.removeSelectedTag(tag);
                                }}
                            >✕</button>
                        </span>
                    ))
                    : <span>Select Tags</span>
                }
            </div>
            <div className={inFocus ? 'dropdown' : 'dropdown-none'}>
                <div className="search">
                    <input
                        placeholder="Filter by query..."
                        value={query}
                        onChange={handleQuery}
                    />
                </div>
                <div className="add">
                    <input
                        placeholder="Add new tag..."
                        value={add}
                        onKeyDown={handleAddTag}
                        onChange={(event) => setAdd(event.target.value)}
                    />
                </div>
                {(filteredTags || Object.keys(props.allTags)).map((tag: Tag) => (
                    <div key={tag} onClick={() => props.selectTag(tag)}>
                        <span className="tag">#{tag}</span>
                        {/* TODO: Delete functionality still needed (needs to check if the tag is in use). */}
                        <button>✕</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface SearchAddSelectProps {
    allTags: Tags;
    addToAllTags: Function;

    selectedTags: Tag[];
    selectTag: Function;
    removeSelectedTag: Function;
}

export default SearchAddSelect;