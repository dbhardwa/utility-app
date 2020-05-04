import React, { useEffect, useState, useRef } from 'react';
import { SubBlock } from '../models/block';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function SubBlockUnit(props: SubBlockUnitProps) {
    const [text, setText] = useState<string>('');
    const [readOnly, setReadOnly] = useState<boolean>(false);
    let editorRef = useRef(null);

    useEffect(() => {
        let result = parseTemplate(text);
        result ? setText(result) : setText(text);
    }, [props.query]);


    useEffect(() => {
        let Inline = Quill.import('blots/inline');

        class HighlightBlot extends Inline {
            static blotName = 'highlight';
            static tagName = 'highlight';
        }

        Quill.register(HighlightBlot);

        // TODO: Need to add a link blot as well.

        setText('<ul><li><a href="#202001011200">Get</a></li><li>This</li></ul>');
    }, []);


    function generateTemplate(): JSX.Element {
        const template = props.subBlock.template;

        let splitTemplate = template.split(/\d{12,14}(?=\]\])/g),
            matchedTemplate = template.match(/\d{12,14}(?=\]\])/g) || [];

        if (!splitTemplate.length || !matchedTemplate.length) return <div>{template}</div>;

        // 3. Run reduced on the initial split array, subbing in the matches array where appropriate.
        let result = splitTemplate.reduce<JSX.Element>((accumulator, partialTemplate, i) => (
            <>{accumulator}<a href={`#${matchedTemplate[i - 1]}`}>{matchedTemplate[i - 1]}</a>{partialTemplate}</>
        ), <></>);

        return <div>{result}</div>;
    }

    // TODO: Make this return a string, keep it pure.
    function parseTemplate(markup: string): string {
        markup = markup.replace(/<(\/h|h)ighlight>/g, '');

        // 1. Split the template by our RegExp (/\[\[\d{12}\]\]/g).
        // 2. Match the same template by our RegExp.
        // NOTE: This is more ideal but not sure if lookbehinds are supported (?<=\[\[)\d{12}(?=\]\]).
        let linkRegEx = /(?<=\[\[)\d{12}(?=\]\])/g,
            splitTemplate = markup.split(/\d{12,14}(?=\]\])/g),
            matchedTemplate = markup.match(/\d{12,14}(?=\]\])/g) || [],
            result = markup;

        if (matchedTemplate.length > 0) {
            result = splitTemplate.reduce((accumulator, partialTemplate, i) => (
                `${accumulator}<a href="#${matchedTemplate[i - 1]}"}>${matchedTemplate[i - 1]}</a>${partialTemplate}`
            ));
        }

        if (props.query) {
            let query = props.query.toLowerCase();

            let exp = new RegExp(`(?!(?<=<[^>]*)${query}(?=[^>]*>))${query}`, 'gi');

            let splitTemplate = result.split(exp),
                matchedTemplate = result.match(exp) || [];

            if (matchedTemplate.length > 0) {
                result = splitTemplate.reduce((accumulator, partialTemplate, i) => (
                    `${accumulator}<highlight>${matchedTemplate[i - 1]}</highlight>${partialTemplate}`
                ));
            }
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
                {/* {generateTemplate()} */}
                <div onDoubleClick={() => { readOnly && setReadOnly(false) }}>
                    <ReactQuill
                        ref={editorRef}
                        className={readOnly ? 'read-only' : 'editable'}
                        value={text}
                        readOnly={readOnly}
                        theme={readOnly ? 'bubble' : 'snow'}
                        onChange={(value, delta, source, editor) => {
                            debugger;
                            if (source === 'user') {
                                console.log(value, delta, source, editor.getContents());
                                let result = parseTemplate(value);
                                result ? setText(result) : setText(value);
                            }
                        }}
                        modules={modules} />
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