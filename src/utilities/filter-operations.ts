import { Block, SubBlock, Tag } from "../models/block";

export default class FilterOperations {
    private static evaluateBlockContents(block: Block, prevContents: SubBlock[], updatedContents: SubBlock[]): Block | null {
        // 1. Something was deleted in this block.
        if (updatedContents.length !== prevContents.length) {
            if (!updatedContents.length) { // The sub-block deleted was the only sub-block.
                return null;
            } else { // The sub-block deleted was one of many.
                return { ...block, contents: updatedContents };
            }
        } else // 2. Nothing was deleted in this block. 
            return block;
    }

    public static filterQuery(query: string, source: Block[]): Block[] {
        let filteredContents: SubBlock[];

        return source.map(block => {
            filteredContents = block.contents.filter(subBlock => subBlock.template.toLowerCase().includes(query.toLowerCase()));
            return this.evaluateBlockContents(block, block.contents, filteredContents);
        }).filter((block): block is Block => block !== null);
    }

    public static filterTags(tag: Tag, source: Block[]): Block[] {
        let filteredContents: SubBlock[];

        return source.map(block => {
            filteredContents = block.contents.filter(subBlock => {
                return subBlock.tags.some(subBlockTag => {
                    return subBlockTag = tag
                });
            });

            return this.evaluateBlockContents(block, block.contents, filteredContents);
        }).filter((block): block is Block => block !== null);
    }

    public static filterCalendar(timestamp: string, source: Block[]): Block[] {
        return source.filter(block => block.timestamp === timestamp);
    }
}