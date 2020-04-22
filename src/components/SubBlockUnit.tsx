import React from 'react';
import { SubBlock } from '../models/block';

function SubBlockUnit(props: SubBlockUnitProps) {
    return (
        <div className="sub-block-unit">
            <span><b>{props.subBlock.title || 'generic sub-block'}: {props.subBlock.uid}</b></span>
            <button onClick={() => props.deleteEntry(props.subBlock.uid)}>delete</button>
            <div>
                <div className="tags">
                    {props.subBlock.tags.map((tag, i, tags) => (
                        <span key={tag} className="tag">#{tag}{(i === tags.length - 1) ? '' : ', '}</span>
                    ))}
                </div>
                {props.subBlock.template}
            </div>
        </div>
    );
}

interface SubBlockUnitProps {
    subBlock: SubBlock;
    deleteEntry: Function;
}

export default SubBlockUnit;