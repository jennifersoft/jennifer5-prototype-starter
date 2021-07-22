import { createNamespacedHelpers } from 'vuex';
import store from '@vuejs/vuex/store';
import axios from '@library/axios';
import _ from '@library/lodash';
import { i18n } from '@common/utility';

export const NAMESPACE = 'agentHelp';

export const {
    mapState,
    mapMutations,
    mapActions,
    mapGetters,
} = createNamespacedHelpers(NAMESPACE);

store.registerModule(NAMESPACE, {
    namespaced: true,
    state: {
        params: {
            type: -1,
            key: '',
        },
        currentTab: 'index',
        currentItem: {
            key: '',
            name: '',
            text: '',
        },
        progress: 1,
        indexData: [],
        groupData: [],
        search: '',
    },
    mutations: {
        updateParams(state, params) {
            state.params = params;
        },
        updateCurrentTab(state, tab) {
            state.currentTab = tab;
        },
        resetCurrentItem(state, _) {
            state.currentItem = {
                key: '',
                name: '',
                text: '',
            };
        },
        updateCurrentItem(state, item) {
            state.currentItem = item;
        },
        updateIndexData(state, data) {
            state.indexData = data;
        },
        updateGroupData(state, data) {
            state.groupData = data;
        },
        updateProgress(state, progress) {
            state.progress = progress;
        },
        updateSearchText(state, text) {
            state.search = text;
        },
    },
    actions: {
        onChangeTab({ state, commit }, tab) {
            if (state.currentTab !== tab) {
                commit('resetCurrentItem');
            }
            commit('updateCurrentTab', tab);
        },
        async loadIndex({ state, commit }) {
            const { type, key } = state.params;
            const { data, status } = await axios.get('/agent/config/help/all', {
                params: {
                    format: 'json',
                    langType: type,
                },
            });
            if (status === 200) {
                commit('updateIndexData', data);
            }
        },
        async loadGroup({ state, commit }) {
            commit('updateProgress', 0);

            const { type } = state.params;
            const { data, status } = await axios.get('/agent/config/help', {
                params: {
                    format: 'json',
                    langType: type,
                },
            });
            if (status === 200) {
                commit('updateGroupData', data);
            }
            commit('updateProgress', 1);
        },
    },
    getters: {
        filteredIndexData({ indexData, search }) {
            if (!search) return indexData;
            let isResult = false;
            const filtered = {};
            for (let key in indexData) {
                if (!filtered[key]) filtered[key] = [];

                const list = indexData[key];
                for (let i = 0; i < list.length; i++) {
                    const data = _.clone(list[i]);

                    if (
                        data.name.includes(search) ||
                        data.text.includes(search)
                    ) {
                        filtered[key].push(data);
                        isResult = true;
                    }
                }
            }
            for (let key in filtered) {
                if (filtered[key].length == 0) {
                    delete filtered[key];
                }
            }

            return filtered;
        },
        renamedGroupData({ groupData }) {
            return groupData.map(d => {
                const pathArray = d.index.split('.');
                const label = d.name.startsWith('ui.group')
                    ? i18n.get(d.name)
                    : d.name;
                const isRootNode = pathArray.length === 1;
                const parent = isRootNode
                    ? null
                    : pathArray.slice(0, -1).join('.');
                return {
                    key: d.index,
                    label,
                    depth: pathArray.length,
                    leaf: !isRootNode,
                    fold: isRootNode,
                    parent,
                    text: d.text,
                };
            });
        },
        contentsArray({ currentTab, currentItem, groupData }) {
            if (currentTab === 'index') return [currentItem];
            if (!currentItem?.key) return [];
            else {
                return groupData
                    .filter(
                        e =>
                            e.index.startsWith(currentItem.key) &&
                            e.text.length > 0
                    )
                    .map(e => ({
                        name: e.name,
                        text: e.text,
                    }));
            }
        },
        pathFromRoot({ currentTab, currentItem }, { renamedGroupData }) {
            if (currentTab === 'index' || !currentItem?.key) return [];
            const path = [];
            const tokens = currentItem.key.split('.');
            let parentKey, parent;
            for (let i = 1; i < tokens.length; i++) {
                parentKey = tokens.slice(0, i).join('.');
                parent = renamedGroupData.find(e => e.key === parentKey);
                path.push({
                    key: parent.key,
                    name: parent.label,
                    text: parent.text,
                });
            }
            path.push(currentItem);
            return path;
        },
    },
});

export default store;
