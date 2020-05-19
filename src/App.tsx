import React, { useState, useEffect } from 'react';
import './App.css';
import { Block } from './models/block';
import { Tags, Tag } from "./models/tags";
import { FilterInputs } from "./models/filter-inputs";
import Utilities from './utilities/utilities';
import BlockUnit from './components/BlockUnit';
import ToolBar from './components/ToolBar';
import { TagsContext, ITagsContext, defaultTagsContext } from './context/tags-context';
import ApiContainer from './api-service/api-container';
import FilterOperations from './utilities/filter-operations';

// TODO: Right now the 'uid's are not truly unique. To do that we'll need a helper function.
function App() {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [currentBlock, setCurrentBlock] = useState<Block | null>(null);
    const [filteredBlocks, setFilteredBlocks] = useState<Block[] | undefined>(undefined);

    const [filterInputs, setFilterInputs] = useState<FilterInputs>({ query: '', tags: [], date: null });
    const [tagsContext, setTagsContext] = useState<ITagsContext>({ ...defaultTagsContext, addTag });

    useEffect(() => {
        // Initially read in blocks and tags.
        readBlocks();

        const allTags = ApiContainer.tagsApi.readTags();
        setTagsContext({ ...tagsContext, allTags });

        // NOTE: Needs validation that this is working properly.
        let timestamp = new Date().toDateString();
        const currentBlock = blocks.find(block => block.timestamp === timestamp);
        currentBlock ? setCurrentBlock(currentBlock) : setCurrentBlock(null);
    }, []);

    useEffect(runFilters, [filterInputs, blocks, currentBlock]);

    function readBlocks() {
        const blocks: Block[] = ApiContainer.blocksApi.readBlocks();
        setBlocks(blocks);
    }

    function addTag(allTags: Tags, tag: Tag) {
        const updatedAllTags: Tags = ApiContainer.tagsApi.addTag(allTags, tag);
        setTagsContext({ ...tagsContext, allTags: updatedAllTags });
    }

    function createNewEntry() {
        // 1. Generate 'timestamp' and 'UID'.
        let date = new Date(),
            uid = Utilities.generateUID(date),
            timestamp = date.toDateString();

        // 2. Check if a block for the current day has been made.
        // const currentBlock = blocks.find(block => block.timestamp === timestamp);

        // 3. If block for current day does not exist, generate a block (and subsequeny sub-block).
        if (!currentBlock) {
            // TODO: This should ideally create an instance (i.e. new Block(date)).
            const newBlock: Block = { timestamp, uid, contents: [{ uid, tags: [], template: '' }] };
            setCurrentBlock(newBlock);
            setBlocks([...blocks, newBlock]);
        } else { // 4. Else generate a new sub-block in existing block (in a immutable fashion).
            const updatedBlocks = blocks.map((block: Block) => {
                if (block.timestamp === timestamp) {
                    const newBlock = {
                        ...block,
                        contents: [...block.contents, { uid, tags: [], template: '' }]
                    };
                    setCurrentBlock(newBlock);
                    return newBlock;
                } else return block;
            });

            setBlocks(updatedBlocks);
        }
    }

    function runFilters() {
        const { query, tags, date } = filterInputs;

        if (!query && !tags.length && !date) {
            setFilteredBlocks(undefined);
        } else {
            let source = currentBlock ? blocks.slice(0, blocks.length - 1) : blocks;

            if (query) source = FilterOperations.filterQuery(query, source);
            if (tags.length > 0) source = FilterOperations.filterTags(tags, source);
            if (date) source = FilterOperations.filterCalendar(date.toDateString(), source);

            if (currentBlock) source = [...source, currentBlock];

            setFilteredBlocks(source);
        }
    }

    return (
        <div className="App">
            <TagsContext.Provider value={tagsContext}>
                <ToolBar
                    filterInputs={filterInputs}
                    setFilterInputs={setFilterInputs}
                    blockDates={blocks.map(block => new Date(block.timestamp))}
                    createNewEntry={createNewEntry}
                />
                <div className="blocks">
                    {(filteredBlocks || blocks).map((block: Block) => (
                        <BlockUnit
                            block={block}
                            key={block.uid}
                            readBlocks={readBlocks}
                        />
                    )).reverse()}
                </div>
            </TagsContext.Provider>
        </div>
    );
}

export default App;
