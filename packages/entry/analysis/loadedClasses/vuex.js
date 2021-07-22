import store from '@vuejs/vuex/store';
import * as loadedClassesStore from './store/loadedClasses';
import * as methodTreeStore from './store/methodTree';

store.registerModule(loadedClassesStore.NAMESPACE, {
    namespaced: true,
    state: loadedClassesStore.state,
    getters: loadedClassesStore.getters,
    mutations: loadedClassesStore.mutations,
    actions: loadedClassesStore.actions,
});

store.registerModule(methodTreeStore.NAMESPACE, {
    namespaced: true,
    state: methodTreeStore.state,
    getters: methodTreeStore.getters,
    mutations: methodTreeStore.mutations,
    actions: methodTreeStore.actions,
});

export default store;
