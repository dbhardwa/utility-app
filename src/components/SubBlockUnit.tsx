import React from 'react';
import { SubBlock } from '../models/block';

function SubBlockUnit(props: SubBlockUnitProps) {
    return (
        <div>
            <span>sub-block: {props.subBlock.uid}</span>
            <button onClick={() => props.deleteEntry(props.subBlock.uid)}>delete</button>
        </div>
    );
}

interface SubBlockUnitProps {
    subBlock: SubBlock;
    deleteEntry: Function;
}

export default SubBlockUnit;