import React, { useState } from 'react';
import './App.css';
import { Block, SubBlock } from './models/block';
import { generateUID } from './utility';
import BlockUnit from './components/BlockUnit';
import ToolBar from './components/ToolBar';

function App() {
    // TODO: There needs to be a mechanism to ensure the blocks are always sorted by 'timestamp'.
    // TODO: Right now the 'uid's are not truly unique. To do that we'll need a helper function.
    const [blocks, setBlocks] = useState<Block[]>([]);
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
        let updatedSubBlocks: SubBlock[];

        let updatedBlocks = blocks.map(block => {
            updatedSubBlocks = block.contents.filter(subBlock => subBlock.uid !== uid);

            // 1. Something was deleted in this block.
            if (updatedSubBlocks.length !== block.contents.length) {
                if (!updatedSubBlocks.length) { // The sub-block deleted was the only sub-block.
                    return null;
                } else { // The sub-block deleted was one of many.
                    return { ...block, contents: updatedSubBlocks };
                }
            } else // 2. Nothing was deleted in this block. 
                return block;
        }).filter((block): block is Block => block !== null);

        setBlocks(updatedBlocks);
    }

    function queryEntries(query: string) {
        let somethingWasFiltered = false;

        // 1. Iterate through each sub-block of all blocks.
        let queriedBlocks = blocks.map(block => {
            let filteredContents = block.contents.filter(subBlock => !subBlock.template.includes(query));

            // 2. If the contents were filtered, updated the data.
            if (filteredContents.length !== block.contents.length) {
                somethingWasFiltered = true;
                return { ...block, contents: filteredContents }

                // 3. Else, if nothing was filtered out, the query must be included in all contents of the block.
            } else return block;
        });

        // TODO: Cannot just pass undefined, there may be other filters, need to develop an appropriate mechanism.
        setFilteredBlocks(somethingWasFiltered ? queriedBlocks : undefined);
    }

    return (
        <div className="App">
            <ToolBar createNewEntry={createNewEntry} queryEntries={queryEntries} />
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
