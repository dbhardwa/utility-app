import React, { useState } from 'react';
import './App.css';
import { Block, SubBlock, Tag } from './models/block';
import { generateUID } from './utility';
import BlockUnit from './components/BlockUnit';
import ToolBar from './components/ToolBar';
import * as mockBlocks from './mocks/blocks.json';

function App() {
    // TODO: There needs to be a mechanism to ensure the blocks are always sorted by 'timestamp'.
    // TODO: Right now the 'uid's are not truly unique. To do that we'll need a helper function.

    // @ts-ignore
    const [blocks, setBlocks] = useState<Block[]>(mockBlocks['default']);
    const [filteredBlocks, setFilteredBlocks] = useState<Block[] | undefined>(undefined);

    function createNewEntry() {
        // 1. Generate 'timestamp' and 'UID'.
        let date = new Date(),
            uid = generateUID(date),
            timestamp = date.toDateString();

        // 2. Check if a block for the current day has been made.
        const currentBlock = blocks.find(block => block.timestamp === timestamp);

        // 3. If block for current day does not exist, generate a block (and subsequeny sub-block).
        if (!currentBlock) {
            // TODO: This should ideally create an instance (i.e. new Block(date)).
            setBlocks([
                ...blocks,
                { uid, timestamp, contents: [{ uid, tags: [], template: '' }] }
            ]);

        } else { // 4. Else generate a new sub-block in existing block (in a immutable fashion).
            const updatedBlocks = blocks.map((block: Block) => {
                if (block.timestamp === timestamp) {
                    return {
                        ...block,
                        contents: [...block.contents, { uid, tags: [], template: '' }]
                    }
                } else return block;
            });

            setBlocks(updatedBlocks);
        }
    }

    // NOTE: 
    // This function assumes 'uid' is truly unique (which should be the case).
    // Not sure if it is necessary to handle this otherwise.
    function deleteEntry(uid: string) {
        let updatedContents: SubBlock[];

        let updatedBlocks = blocks.map(block => {
            updatedContents = block.contents.filter(subBlock => subBlock.uid !== uid);

            // 1. Something was deleted in this block.
            if (updatedContents.length !== block.contents.length) {
                if (!updatedContents.length) { // The sub-block deleted was the only sub-block.
                    return null;
                } else { // The sub-block deleted was one of many.
                    return { ...block, contents: updatedContents };
                }
            } else // 2. Nothing was deleted in this block. 
                return block;
        }).filter((block): block is Block => block !== null);

        setBlocks(updatedBlocks);
    }

    // TODO: Will need to be tested and validated when 'template' field of sub-blocks becomes occupied.
    function queryEntries(query: string) {
        let filteredContents: SubBlock[];

        // 1. Iterate through each sub-block of all blocks.
        let queriedBlocks = blocks.map(block => {
            filteredContents = block.contents.filter(subBlock => subBlock.template.toLowerCase().includes(query));

            // TODO: Exact same logic re-used.
            if (filteredContents.length !== block.contents.length) {
                if (!filteredContents.length) {
                    return null;
                } else {
                    return { ...block, contents: filteredContents };
                }
            } else
                return block;
        }).filter((block): block is Block => block !== null);

        // TODO: Cannot just pass undefined, there may be other filters, need to develop an appropriate mechanism.
        setFilteredBlocks(queriedBlocks);
    }

    // TODO: This should filter based on pre-existing filteredBlocks value.
    function filterTags(tags: Tag[]) {
        if (!tags.length) {
            setFilteredBlocks(undefined);
            return;
        }

        let filteredContents: SubBlock[];

        let updatedBlocks = blocks.map(block => {
            filteredContents = block.contents.filter(subBlock => {
                return subBlock.tags.some(subBlockTag => {
                    return tags.some(inputTag => inputTag === subBlockTag);
                });
            });

            // TODO: Exact same logic re-used.
            if (filteredContents.length !== block.contents.length) {
                if (!filteredContents.length) {
                    return null;
                } else {
                    return { ...block, contents: filteredContents };
                }
            } else
                return block;
        }).filter((block): block is Block => block !== null);

        setFilteredBlocks(updatedBlocks);
    }

    return (
        <div className="App">
            <ToolBar
                createNewEntry={createNewEntry}
                queryEntries={queryEntries}
                filterTags={filterTags}
            />
            {/* NOTE: This should ideally be a component (i.e. BlockContainer), have to deal with prop drilling though. */}
            <div className="blocks">
                {(filteredBlocks || blocks).map((block: Block) => (
                    <BlockUnit block={block} key={block.uid} deleteEntry={deleteEntry} />
                ))}
            </div>
        </div>
    );
}

export default App;
