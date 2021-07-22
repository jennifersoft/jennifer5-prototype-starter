import store from '@vuejs/vuex/store';

import { store as metricsStore } from '@entry/analysis/dbmetrics/metrics/store';
import { store as eventStore } from '@entry/analysis/dbmetrics/event/store';
import { store as diskStore } from '@entry/analysis/dbmetrics/disk/store';
import { store as serviceStore } from '@entry/analysis/dbmetrics/service/store';
import { store as connPoolStore } from '@entry/analysis/dbmetrics/connpool/store';
import { store as errorStore } from '@entry/analysis/dbmetrics/error/store';

const storeModules = [
    metricsStore,
    eventStore,
    diskStore,
    serviceStore,
    connPoolStore,
    errorStore,
];

(function registerModules(storeModules) {
    storeModules.forEach(module => {
        const namespace = module.NAMESPACE;
        store.registerModule(namespace, {
            namespaced: true,
            state: module.state,
            getters: module.getters,
            mutations: module.mutations,
            actions: module.actions,
        });
    });
})(storeModules);

export default store;
