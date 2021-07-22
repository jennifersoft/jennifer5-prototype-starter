import store from '@vuejs/vuex/store';
import { state, mutations, actions, NAMESPACE } from './store/autoProfile';
import * as instanceSelectorStore from './store/instanceSelector';
import * as methodTreeStore from '@entry/analysis/loadedClasses/store/methodTree';

store.registerModule(NAMESPACE, {
    namespaced: true,
    state,
    mutations,
    actions,
});

store.registerModule(instanceSelectorStore.NAMESPACE, {
    namespaced: true,
    state: instanceSelectorStore.state,
    mutations: instanceSelectorStore.mutations,
    actions: instanceSelectorStore.actions,
});

store.registerModule(methodTreeStore.NAMESPACE, {
    namespaced: true,
    state: methodTreeStore.state,
    getters: methodTreeStore.getters,
    mutations: methodTreeStore.mutations,
    actions: methodTreeStore.actions,
});
