import React from 'react';
import { Block, SubBlock } from '../models/block';
import SubBlockUnit from './SubBlockUnit';
import ApiContainer from '../api-service/api-container';

function BlockUnit(props: BlockUnitProps) {
    const { uid, timestamp, contents } = props.block;

    function writeBlock(updatedBlock: Block | null) {
        try {
            ApiContainer.blocksApi.writeBlock(updatedBlock, uid);
            props.readBlocks();
        } catch (error) {
            console.log(error); // TODO: Add error handling.
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
                />
            )).reverse()}
        </div>
    );
}

interface BlockUnitProps {
    block: Block;
    readBlocks: Function;
}

export default BlockUnit;