import React, { useState, useEffect } from 'react';
import './App.css';
import { Block, SubBlock, Tag, FilterInputs } from './models/block';
import { generateUID } from './utility';
import BlockUnit from './components/BlockUnit';
import ToolBar from './components/ToolBar';

// Operations needed for native application.
const electron = window.require('electron');
const fs = electron.remote.require('fs');

// TODO: Right now the 'uid's are not truly unique. To do that we'll need a helper function.
function App() {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [filteredBlocks, setFilteredBlocks] = useState<Block[] | undefined>(undefined);
    const [filterInputs, setFilterInputs] = useState<FilterInputs>({ query: '', tag: '', date: null });
    const [currentBlock, setCurrentBlock] = useState<Block | null>(null);

    useEffect(() => {
        const blocks = readBlocks();
        setBlocks(blocks);

        // NOTE: Needs validation that this is working properly.
        let timestamp = new Date().toDateString();
        const currentBlock = blocks.find(block => block.timestamp === timestamp);
        currentBlock ? setCurrentBlock(currentBlock) : setCurrentBlock(null);
    }, []);

    useEffect(() => {
        const { query, tag, date } = filterInputs;

        if (!query && !tag && !date) {
            setFilteredBlocks(undefined);
        } else {
            runFilters();
        }
    }, [filterInputs, blocks, currentBlock]);

    function readBlocks(): Block[] {
        let blocks: Block[] = [];

        const folders = fs.readdirSync('/Users/devansh/Desktop/utility-data');

        folders.forEach((uid: string) => {
            if (uid.match(/\d{12}/g)) {
                const data = fs.readFileSync(`/Users/devansh/Desktop/utility-data/${uid}/${uid}.json`);
                const block: Block = JSON.parse(data.toString());
                blocks.push(block);
            }
        });

        return blocks;
    }

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

    function filterQuery(query: string, source: Block[]): Block[] {
        let filteredContents: SubBlock[];

        return source.map(block => {
            filteredContents = block.contents.filter(subBlock => subBlock.template.toLowerCase().includes(query.toLowerCase()));
            return evaluateBlockContents(block, block.contents, filteredContents);
        }).filter((block): block is Block => block !== null);
    }

    function filterTags(tag: Tag, source: Block[]): Block[] {
        let filteredContents: SubBlock[];

        return source.map(block => {
            filteredContents = block.contents.filter(subBlock => {
                return subBlock.tags.some(subBlockTag => {
                    return subBlockTag = tag
                });
            });

            return evaluateBlockContents(block, block.contents, filteredContents);
        }).filter((block): block is Block => block !== null);
    }

    function filterCalendar(timestamp: string, source: Block[]): Block[] {
        return source.filter(block => block.timestamp === timestamp);
    }

    function runFilters() {
        const { query, tag, date } = filterInputs;

        // NOTE: As long as these are synchronous operations, there is no race condition.
        let source = currentBlock ? blocks.slice(0, blocks.length - 1) : blocks;

        if (query) source = filterQuery(query, source);
        if (tag) source = filterTags(tag, source);
        if (date) source = filterCalendar(date.toDateString(), source);

        if (currentBlock) source = [...source, currentBlock];

        setFilteredBlocks(source);
    }

    function updateBlock(updatedBlock: Block | string) {
        let updatedBlocks: Block[] = [];

        if (typeof updatedBlock === 'string') {
            updatedBlocks = blocks.filter(block => block.uid !== updatedBlock);
        } else {
            updatedBlocks = blocks.map(block => (block.uid === updatedBlock.uid) ? updatedBlock : block);
        }

        setBlocks(updatedBlocks);
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
                        updateBlock={updateBlock}

                        // TODO: These below are being prop drilled at the moment.    
                        setTag={(tag: Tag) => {
                            if (filterInputs.tag !== tag)
                                setFilterInputs({ ...filterInputs, tag });
                        }}
                        query={filterInputs.query}

                    />
                )).reverse()}
            </div>
        </div>
    );
}

export default App;
