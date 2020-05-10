import React, { ChangeEvent } from 'react'
import { Tag, FilterInputs } from '../models/block';
import * as mockTags from '../mocks/tags.json';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../App.css';

function ToolBar(props: ToolBarProps) {
    // @ts-ignore
    const allTags = mockTags['default'];
    const { query, tag, date } = props.filterInputs;

    function handleTagMultiSelect(event: ChangeEvent) {
        let target = event.nativeEvent.target as HTMLSelectElement,
            selectedTagElements = target.selectedOptions,
            selectedTags: Tag[] = [];

        for (const tag of selectedTagElements) {
            selectedTags.push(tag.value);
        }

        props.setFilterInputs({ ...props.filterInputs, tags: selectedTags });
    }

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

            <select
                onChange={(event) => props.setFilterInputs({ ...props.filterInputs, tag: event.target.value })}
                value={props.filterInputs.tag}
            >
                <option disabled selected> -- select an option -- </option>
                {allTags.map((tag: Tag) => (
                    <option value={tag}>#{tag}</option>
                ))}
            </select>
            <button onClick={() => props.createNewEntry()}>
                ADD ENTRY
            </button>
            {(query || tag || date) && (
                <button onClick={() => props.setFilterInputs({ query: '', tags: [], date: null })}>Clear Filters</button>
            )}
        </div>

        /* NOTE: This is not a controlled component, but this element is tentative anyways. */
    );
}

interface ToolBarProps {
    filterInputs: FilterInputs;
    setFilterInputs: Function;
    blockDates: Date[];
    createNewEntry: Function;
}

export default ToolBar;
