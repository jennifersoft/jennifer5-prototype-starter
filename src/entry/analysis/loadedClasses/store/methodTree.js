import { createNamespacedHelpers } from 'vuex';
import axios from '@library/axios';
import { LoadedClassTreeNodeTypeDef } from '@common/definition';

export const NAMESPACE = 'methodTree';

export const { mapState, mapMutations, mapActions } = createNamespacedHelpers(
    NAMESPACE
);

export const state = {
    domainId: -1,
    instanceOid: -1,
    methodTree: [],
    classList: [],
    openKeySet: new Set(),
};

export const getters = {
    isDomainValid(state) {
        return state.domainId !== -1 && state.instanceOid !== -1;
    },
};

export const mutations = {
    updateTargetData(state, payload) {
        state.domainId = payload?.domainId || -1;
        state.instanceOid = payload?.instanceOid || -1;
    },
    addMethodTreeNodes(state, { nodes, parent }) {
        const ICON_MAP = {
            [`${LoadedClassTreeNodeTypeDef.PACKAGE}`]: 'resource',
            [`${LoadedClassTreeNodeTypeDef.CLASS}`]: 'class',
            [`${LoadedClassTreeNodeTypeDef.METHOD}`]: 'method',
        };

        state.methodTree = [
            ...state.methodTree,
            ...nodes.map(node => {
                return {
                    parent: parent,
                    key: parent === null ? node.key : `${parent}.${node.key}`,
                    label: node.name,
                    // TODO: 패키지와 클래스 아이콘으로 대체하기
                    icon: ICON_MAP[node.nodeType],
                    nodeType: parseInt(node.nodeType),
                    hasChild: node.hasChild === '1',
                };
            }),
        ];
    },
    clearMethodTreeNodes(state) {
        state.methodTree = [];
        state.openKeySet = new Set();
    },
    addClassList(state, list = []) {
        state.classList = list;
    },
};

export const actions = {
    async loadMethodTreeNodes({ getters, commit, dispatch }) {
        commit('clearMethodTreeNodes');
        if (getters.isDomainValid) {
            await dispatch('addMethodTreeNodes', null);
        }
    },
    async addMethodTreeNodes({ state, commit }, parentKey) {
        if (!state.openKeySet.has(parentKey)) {
            const { data } = await axios.get('/analysis/loadedClasses/nodes', {
                params: {
                    format: 'json',
                    isProfile: false,
                    sid: state.domainId,
                    agent: state.instanceOid,
                    nodes: parentKey !== null ? parentKey.split('.') : [],
                },
            });

            commit('addMethodTreeNodes', {
                nodes: data,
                parent: parentKey,
            });

            state.openKeySet.add(parentKey);
        }
    },
    async searchClassList(
        { state, getters, commit },
        { keyword = '', limit = 1000 }
    ) {
        if (getters.isDomainValid) {
            const { data } = await axios.get('/analysis/loadedClasses/list', {
                params: {
                    format: 'json',
                    sid: state.domainId,
                    agent: state.instanceOid,
                    keyword,
                    limit,
                    isProfile: false,
                },
            });
            if (data?.list) {
                commit('addClassList', data.list);
            }
        } else commit('addClassList');
    },
};
