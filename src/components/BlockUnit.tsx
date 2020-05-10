import React from 'react';
import { Block, SubBlock } from '../models/block';
import SubBlockUnit from './SubBlockUnit';

// Operations needed for native application.
const electron = window.require('electron');
const fs = electron.remote.require('fs');
const path = electron.remote.require('path');

function BlockUnit(props: BlockUnitProps) {
    const { uid, timestamp, contents } = props.block;

    function writeBlock(updatedBlock: Block | null) {
        const filePath = `/Users/devansh/Desktop/utility-data/${uid}/${uid}.json`;

        // Case for removing the block entirely.
        if (!updatedBlock) {
            fs.rmdirSync(path.dirname(filePath), { recursive: true });
            props.updateBlock(uid); // NOTE: Pass a second argument for greater clarity instead.
        } else { // Case for updating block contents.
            if (!fs.existsSync(path.dirname(filePath)))
                fs.mkdirSync(path.dirname(filePath));

            fs.writeFileSync(filePath, JSON.stringify(updatedBlock)); // TODO: Error handling needed.
            props.updateBlock(updatedBlock);
        }
    }

    function editEntry(updatedSubBlock: SubBlock) {
        const updatedBlock: Block = {
            ...props.block,
            contents: contents.map((subBlock: SubBlock) => {
                return (subBlock.uid === updatedSubBlock.uid) ? updatedSubBlock : subBlock;
            })
        }

        writeBlock(updatedBlock);
    }

    function deleteEntry(uid: string) {
        const updatedContents: SubBlock[] = contents.filter(subBlock => subBlock.uid !== uid);
        (updatedContents.length > 0) ? writeBlock({ ...props.block, contents: updatedContents }) : writeBlock(null);
    }

    return (
        <div className="block-unit">
            {uid}, {timestamp}
            {contents.map((subBlock: SubBlock) => (
                <SubBlockUnit
                    subBlock={subBlock}
                    key={subBlock.uid}
                    deleteEntry={deleteEntry}
                    editEntry={editEntry}
                    setTag={props.setTag}
                    query={props.query}
                />
            )).reverse()}
        </div>
    );
}

interface BlockUnitProps {
    block: Block;
    setTag: Function;
    query: string;
    updateBlock: Function;
}

export default BlockUnit;