import React from 'react';
import { Block, SubBlock } from '../models/block';
import SubBlockUnit from './SubBlockUnit';

function BlockUnit(props: BlockUnitProps) {
    return (
        <div className="block-unit">
            {props.block.uid}, {props.block.timestamp}
            {props.block.contents.map((subBlock: SubBlock) => (
                <SubBlockUnit
                    subBlock={subBlock}
                    key={subBlock.uid}
                    deleteEntry={props.deleteEntry}
                    setTag={props.setTag}
                    query={props.query}
                />
            )).reverse()}
        </div>
    );
}

interface BlockUnitProps {
    block: Block;
    deleteEntry: Function;
    setTag: Function;
    query: string
}

export default BlockUnit;