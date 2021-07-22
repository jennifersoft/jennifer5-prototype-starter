import store from '@vuejs/vuex/store';
import * as baseStore from './store/base';
import * as toolbarStore from './store/toolbar';
import * as timelineStore from './store/timeline';
import * as textStore from './store/text';
import * as sectionStore from './store/section';
import * as socketStore from './store/socket';
import * as fileStore from './store/file';
import * as messageStore from './store/message';
import * as errorStore from './store/error';
import * as stacktraceStore from './store/stacktrace';
import * as asyncStore from './store/async';
import * as cicsStore from './store/cics';

const PROFILE_STORES = [
    timelineStore,
    textStore,
    sectionStore,
    socketStore,
    fileStore,
    messageStore,
    errorStore,
    stacktraceStore,
    cicsStore,
    asyncStore,
];

export const registerModules = storeModules => {
    storeModules.forEach(modStore => {
        const name = modStore.NAMESPACE;

        store.registerModule(name, {
            namespaced: true,
            state: modStore.state,
            mutations: modStore.mutations,
            actions: modStore.actions,
            getters: modStore.getters,
        });
    });
};

registerModules([...[baseStore, toolbarStore], ...PROFILE_STORES]);

export default store;
