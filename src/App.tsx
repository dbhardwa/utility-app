import React, { useState, useEffect } from 'react';
import './App.css';
import { Block, SubBlock, Tag, FilterInputs } from './models/block';
import { generateUID } from './utility';
import BlockUnit from './components/BlockUnit';
import ToolBar from './components/ToolBar';
import * as mockBlocks from './mocks/blocks.json';

// TODO: Right now the 'uid's are not truly unique. To do that we'll need a helper function.
function App() {
    // @ts-ignore (mockBlocks['default'])
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [filteredBlocks, setFilteredBlocks] = useState<Block[] | undefined>(undefined);
    const [filterInputs, setFilterInputs] = useState<FilterInputs>({ query: '', tags: [], date: null });

    const [currentBlock, setCurrentBlock] = useState<Block | null>(null);

    useEffect(() => {
        // NOTE: Needs validation that this is working properly.
        let timestamp = new Date().toDateString();
        const currentBlock = blocks.find(block => block.timestamp === timestamp);
        currentBlock ? setCurrentBlock(currentBlock) : setCurrentBlock(null);
    }, []);

    useEffect(() => {
        const { query, tags, date } = filterInputs;

        if (!query && !tags.length && !date) {
            setFilteredBlocks(undefined);
        } else {
            runFilters();
        }
    }, [filterInputs, blocks, currentBlock]);

    function createNewEntry() {
        // 1. Generate 'timestamp' and 'UID'.
        let date = new Date(),
            uid = generateUID(date),
            timestamp = date.toDateString();

        // 2. Check if a block for the current day has been made.
        // const currentBlock = blocks.find(block => block.timestamp === timestamp);

        // 3. If block for current day does not exist, generate a block (and subsequeny sub-block).
        if (!currentBlock) {
            // TODO: This should ideally create an instance (i.e. new Block(date)).
            const newBlock = { timestamp, uid, contents: [{ uid, tags: [], template: '' }] };
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

    function evaluateBlockContents(block: Block, prevContents: SubBlock[], updatedContents: SubBlock[]): Block | null {
        // 1. Something was deleted in this block.
        if (updatedContents.length !== prevContents.length) {
            if (!updatedContents.length) { // The sub-block deleted was the only sub-block.
                return null;
            } else { // The sub-block deleted was one of many.
                return { ...block, contents: updatedContents };
            }
        } else // 2. Nothing was deleted in this block. 
            return block;
    }

    // NOTE: 
    // This function assumes 'uid' is truly unique (which should be the case).
    // Not sure if it is necessary to handle this otherwise.
    function deleteEntry(uid: string) {
        let updatedContents: SubBlock[];

        let updatedBlocks = blocks.map(block => {
            updatedContents = block.contents.filter(subBlock => subBlock.uid !== uid);
            return evaluateBlockContents(block, block.contents, updatedContents);
        }).filter((block): block is Block => block !== null);

        setBlocks(updatedBlocks);
    }

    function filterQuery(query: string, source: Block[]): Block[] {
        let filteredContents: SubBlock[];

        return source.map(block => {
            filteredContents = block.contents.filter(subBlock => subBlock.template.toLowerCase().includes(query.toLowerCase()));
            return evaluateBlockContents(block, block.contents, filteredContents);
        }).filter((block): block is Block => block !== null);
    }

    function filterTags(tags: Tag[], source: Block[]): Block[] {
        let filteredContents: SubBlock[];

        return source.map(block => {
            filteredContents = block.contents.filter(subBlock => {
                return subBlock.tags.some(subBlockTag => {
                    return tags.some(inputTag => inputTag === subBlockTag);
                });
            });

            return evaluateBlockContents(block, block.contents, filteredContents);
        }).filter((block): block is Block => block !== null);
    }

    function filterCalendar(timestamp: string, source: Block[]): Block[] {
        return source.filter(block => block.timestamp === timestamp);
    }

    function runFilters() {
        const { query, tags, date } = filterInputs;

        // NOTE: As long as these are synchronous operations, there is no race condition.
        let source = currentBlock ? blocks.slice(0, blocks.length - 1) : blocks;

        if (query) source = filterQuery(query, source);
        if (tags.length > 0) source = filterTags(tags, source);
        if (date) source = filterCalendar(date.toDateString(), source);

        if (currentBlock) source = [...source, currentBlock];

        setFilteredBlocks(source);
    }

    return (
        <div className="App">
            <ToolBar
                filterInputs={filterInputs}
                setFilterInputs={setFilterInputs}
                blockDates={blocks.map(block => new Date(block.timestamp))}
                createNewEntry={createNewEntry}
            />
            {/* NOTE: This should ideally be a component (i.e. BlockContainer), have to deal with prop drilling though. */}
            <div className="blocks">
                {(filteredBlocks || blocks).map((block: Block) => (
                    <BlockUnit
                        block={block}
                        key={block.uid}
                        // TODO: These below are being prop drilled at the moment.    
                        deleteEntry={deleteEntry}
                        setTag={(tag: Tag) => {
                            if (!filterInputs.tags.includes(tag))
                                setFilterInputs({ ...filterInputs, tags: [...filterInputs.tags, tag] });
                        }}
                        query={filterInputs.query}
                    />
                )).reverse()}
            </div>
        </div>
    );
}

export default App;
