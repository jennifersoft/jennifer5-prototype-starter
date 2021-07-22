import * as logStore from './store.custom/log';
import store, { registerModules } from './vuex';

registerModules([logStore]);

export default store;
