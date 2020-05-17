// TODO: Move this into 'models/'.
export interface IPaths {
    root: string;
    blockFile: (uid: string) => string;
    tagsFile: () => string;
}

export default class Paths implements IPaths {
    public root = '/Users/devansh/Desktop/utility-data';

    public blockFile(uid: string): string {
        return `${this.root}/${uid}/${uid}.json`;
    }

    public tagsFile(): string {
        // TODO: Change 'TAGS' ––> 'tags'.
        return `${this.root}/TAGS/tags.json`;
    }
}