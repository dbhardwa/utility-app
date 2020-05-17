import ApiContainer from "../api-container";
import { Block } from "../../models/block";

// Operations needed for native application.
const electron = window.require('electron');
const fs = electron.remote.require('fs');
const path = electron.remote.require('path');

// TODO: Needs error handling.
export default class BlocksApi {
    private blocks: Block[] = [];

    public readBlocks(): Block[] {
        if (!this.blocks.length) {
            let blocks: Block[] = [];

            // TODO: If this folder doesn't exist in the directory, we need to create it.
            const folders = fs.readdirSync(ApiContainer.paths.root);

            folders.forEach((uid: string) => {
                if (uid.match(/\d{12}/g)) {
                    const data = fs.readFileSync(ApiContainer.paths.blockFile(uid));
                    const block: Block = JSON.parse(data.toString());
                    blocks.push(block);
                }
            });

            this.blocks = blocks;
        }

        return this.blocks;
    }

    public writeBlock(updatedBlock: Block | null, uid: string): void {
        const blockFilePath = ApiContainer.paths.blockFile(uid);

        // Case for removing the block entirely.
        if (!updatedBlock) {
            this.blocks = this.blocks.filter(block => block.uid !== uid);
            fs.rmdirSync(path.dirname(blockFilePath), { recursive: true });
        } else { // Case for updating block contents.
            this.blocks = this.blocks.map(block => (block.uid === uid) ? updatedBlock : block);

            if (!fs.existsSync(path.dirname(blockFilePath)))
                fs.mkdirSync(path.dirname(blockFilePath));

            fs.writeFileSync(blockFilePath, JSON.stringify(updatedBlock));
        }
    }
}