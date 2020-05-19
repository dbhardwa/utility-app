// Operations needed for native application.
const electron = window.require('electron');
const fs = electron.remote.require('fs');
const os = electron.remote.require('os');

export default class Paths {
    public root = '';

    constructor() {
        const username = os.userInfo().username;
        this.root = `/Users/${username}/Desktop/utility-data`;

        // Needs to check if root folder exists, if not, it should create it.
        if (!fs.existsSync(this.root)) fs.mkdirSync(this.root);
    }

    public blockFile(uid: string): string {
        return `${this.root}/${uid}/${uid}.json`;
    }

    public tagsFile(): string {
        return `${this.root}/tags/tags.json`;
    }
}