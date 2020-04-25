import React from 'react';
import { SubBlock } from '../models/block';

function SubBlockUnit(props: SubBlockUnitProps) {

    function generateTemplate(): JSX.Element {
        const template = props.subBlock.template;

        // 1. Split the template by our RegExp (/\[\[\d{12}\]\]/g).
        // 2. Match the same template by our RegExp (now you have two arrays).
        // NOTE: This is more ideal but not sure if lookbehinds are supported (?<=\[\[)\d{12}(?=\]\]).
        let splitTemplate = template.split(/\d{12,14}(?=\]\])/g),
            matchedTemplate = template.match(/\d{12,14}(?=\]\])/g) || [];

        if (!splitTemplate.length || !matchedTemplate.length) return <div>{template}</div>;

        // 3. Run reduced on the initial split array, subbing in the matches array where appropriate.
        let result = splitTemplate.reduce<JSX.Element>((accumulator, partialTemplate, i) => (
            <>{accumulator}<a href={`#${matchedTemplate[i - 1]}`}>{matchedTemplate[i - 1]}</a>{partialTemplate}</>
        ), <></>);

        return <div>{result}</div>;
    }

    return (
        <div className="sub-block-unit" id={props.subBlock.uid}>
            <span><b>{props.subBlock.title || 'generic sub-block'}: {props.subBlock.uid}</b></span>
            <button onClick={() => props.deleteEntry(props.subBlock.uid)}>delete</button>
            <div>
                <div className="tags">
                    {props.subBlock.tags.map((tag, i, tags) => (
                        <span>
                            <span
                                onClick={() => props.setTag(tag)}
                                key={tag}
                                className="tag"
                            >#{tag}</span>{(i === tags.length - 1) ? '' : ', '}
                        </span>
                    ))}
                </div>
                {generateTemplate()}
            </div>
        </div>
    );
}

interface SubBlockUnitProps {
    subBlock: SubBlock;
    deleteEntry: Function;
    setTag: Function;
    query: string;
}

export default SubBlockUnit;