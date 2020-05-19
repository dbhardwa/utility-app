import React, { ChangeEvent, useContext } from 'react'
import { Tag, Tags } from '../models/tags';
import { FilterInputs } from "../models/filter-inputs";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../App.css';
import SearchAddSelect from '../recyclables/SearchAddSelect';
import { ITagsContext, TagsContext } from '../context/tags-context';

function ToolBar(props: ToolBarProps) {
    const { query, tags, date } = props.filterInputs;
    const tagsContext = useContext<ITagsContext>(TagsContext);

    return (
        <div className="tool-bar">
            <div className="date-picker">
                <DatePicker
                    selected={date}
                    onChange={(date: Date | null) => props.setFilterInputs({ ...props.filterInputs, date })}
                    showPopperArrow={false}
                    dateFormat="E MMMM dd yyyy"
                    highlightDates={[{
                        'highlight-date': props.blockDates
                    }]}
                    placeholderText="Filter by date"
                    maxDate={new Date()}
                />
            </div>
            <input
                type="text"
                value={query}
                onChange={(event) => props.setFilterInputs({ ...props.filterInputs, query: event.target.value })}
            />
            <SearchAddSelect
                disableAdd={true}
                allTags={tagsContext.getFilteredAllTags(tagsContext.allTags, tags)}

                selectedTags={tags}
                selectTag={(tag: Tag) => props.setFilterInputs({ ...props.filterInputs, tags: [...tags, tag] })}
                removeSelectedTag={(tag: Tag) => props.setFilterInputs({
                    ...props.filterInputs,
                    tags: tags.filter((iterTag: Tag) => iterTag !== tag)
                })}
            />
            <button onClick={() => props.createNewEntry()}>
                ADD ENTRY
            </button>
            {(query || tags.length > 0 || date) && (
                <button onClick={() => props.setFilterInputs({ query: '', tags: [], date: null })}>Clear Filters</button>
            )}
        </div>
    );
}

interface ToolBarProps {
    filterInputs: FilterInputs;
    setFilterInputs: Function;
    blockDates: Date[];
    createNewEntry: Function;
}

export default ToolBar;
