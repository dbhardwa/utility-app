import React, { useEffect, useState, useRef } from 'react';
import { SubBlock } from '../models/block';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import './SubBlockUnit.css';

function SubBlockUnit(props: SubBlockUnitProps) {
    const [title, setTitle] = useState<string>('');
    const [text, setText] = useState<string>('');
    const [readOnly, setReadOnly] = useState<boolean>(false);

    useEffect(() => {
        let Inline = Quill.import('blots/inline');

        class LinkBlot extends Inline {
            static blotName = 'link';
            static tagName = 'a';

            static create(value: string) {
                let node = super.create();
                node.setAttribute('href', value);
                return node;
            }

            static formats(node: any) {
                return node.getAttribute('href');
            }
        }

        Quill.register(LinkBlot);
    }, []);

    // NOTE: The negative lookbehind part is not completely necessary (as it is not fully supported).
    function parseTemplate(markup: string): string {
        // 1. Split the template by our RegExp (/\[\[\d{12}\]\]/g).
        // 2. Match the same template by our RegExp.
        let expression = /(?<=\[\[)\d{12}(?=\]\])/g,
            splitTemplate = markup.split(expression),
            matchedTemplate = markup.match(/\d{12,14}(?=\]\])/g) || [],
            result = markup;

        if (matchedTemplate.length > 0) {
            result = splitTemplate.reduce((accumulator, partialTemplate, i) => (
                `${accumulator}<a href="#${matchedTemplate[i - 1]}"}>${matchedTemplate[i - 1]}</a>${partialTemplate}`
            ));
        }

        return result;
    }

    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            ['done']
        ]
    };

    return (
        <div className="sub-block-unit" id={props.subBlock.uid}>
            <span><b>generic sub-block: {props.subBlock.uid}</b></span>
            {/* {readOnly ?
                <span>{title || 'generic sub-block'}</span>
                : <ReactQuill value={title} theme="bubble" onChange={setTitle} />
            } */}
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
                <div onDoubleClick={() => { readOnly && setReadOnly(false) }}>
                    <ReactQuill
                        className={readOnly ? 'read-only' : 'editable'}
                        value={text}
                        readOnly={readOnly}
                        theme={readOnly ? 'bubble' : 'snow'}
                        onChange={(value, delta, source, editor) => {
                            if (source === 'user') setText(parseTemplate(value));
                        }}
                        modules={modules}
                    />
                </div>
                <button onClick={() => setReadOnly(!readOnly)}>
                    {readOnly ? 'Edit' : 'Save'}
                </button>
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