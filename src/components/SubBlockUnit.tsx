import React, { useEffect, useState, useContext } from 'react';
import { Tags, Tag } from "../models/tags";
import { SubBlock } from "../models/sub-block";
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import './SubBlockUnit.css';
import SearchAddSelect from '../recyclables/SearchAddSelect';
import { TagsContext, ITagsContext } from '../context/tags-context';

function SubBlockUnit(props: SubBlockUnitProps) {
    const [text, setText] = useState<string>('');
    const [tags, setTags] = useState<Tag[]>([]);
    const [readOnly, setReadOnly] = useState<boolean>(props.subBlock.template ? true : false);

    const tagsContext = useContext<ITagsContext>(TagsContext);

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

        setText(
            parseTemplate(props.subBlock.template)
        );
    }, []);

    function parseTemplate(markup: string): string {
        const linkRegEx = /(?<=\[\[)\d{12}(?=\]\])/g;

        let splitTemplate = markup.split(linkRegEx),
            matchedTemplate = markup.match(linkRegEx) || [],
            result = markup;

        if (matchedTemplate.length > 0) {
            result = splitTemplate.reduce((accumulator, partialTemplate, i) => (
                `${accumulator}<a href="#${matchedTemplate[i - 1]}"}>${matchedTemplate[i - 1]}</a>${partialTemplate}`
            ));
        }

        return result;
        // TODO: Bug ––> Goes out of focus upon adding link.
    }

    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            ['done']
        ]
    };

    function saveSubBlock() {
        props.editEntry({
            ...props.subBlock,
            tags: [], // TODO: This should be 'tags'.
            template: text
        });
    }

    return (
        <div className="sub-block-unit" id={props.subBlock.uid}>
            <span><b>generic sub-block: {props.subBlock.uid}</b></span>
            <button onClick={() => props.deleteEntry(props.subBlock.uid)}>delete</button>
            <div>
                <div className="tags">
                    <SearchAddSelect
                        allTags={tagsContext.getFilteredAllTags(tagsContext.allTags, tags)}
                        addToAllTags={(tag: Tag) => tagsContext.addTag(tagsContext.allTags, tag)}

                        selectedTags={tags}
                        selectTag={(tag: Tag) => setTags([...tags, tag])}
                        removeSelectedTag={(tag: Tag) => setTags(tags.filter(iterTag => iterTag !== tag))}
                    />
                    {/* {props.subBlock.tags.map((tag, i, tags) => (
                        <span>
                            <span
                                onClick={() => props.setTag(tag)}
                                key={tag}
                                className="tag"
                            >#{tag}</span>{(i === tags.length - 1) ? '' : ', '}
                        </span>
                    ))} */}
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
                <button
                    onClick={() => {
                        if (!readOnly) saveSubBlock();
                        setReadOnly(!readOnly);
                    }}
                >
                    {readOnly ? 'Edit' : 'Save'}
                </button>
            </div>
        </div>
    );
}

interface SubBlockUnitProps {
    subBlock: SubBlock;
    deleteEntry: Function;
    editEntry: Function;
}

export default SubBlockUnit;