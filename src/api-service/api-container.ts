import Paths from './paths';
import BlocksApi from './apis/blocks-api';
import TagsApi from './apis/tags-api';

// NOTE: All external calls should be made through this Container.
export default class ApiContainer {
    private static pathsSingleton: Paths;
    private static blocksApiSingleton: BlocksApi;
    private static tagsApiSingleton: TagsApi;

    public static get paths() {
        if (!this.pathsSingleton) {
            this.pathsSingleton = new Paths();
        }

        return this.pathsSingleton;
    }

    public static get blocksApi() {
        if (!this.blocksApiSingleton) {
            this.blocksApiSingleton = new BlocksApi();
        }

        return this.blocksApiSingleton;
    }

    public static get tagsApi() {
        if (!this.tagsApiSingleton) {
            this.tagsApiSingleton = new TagsApi();
        }

        return this.tagsApiSingleton;
    }
}