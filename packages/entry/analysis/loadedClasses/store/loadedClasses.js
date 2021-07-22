import { createNamespacedHelpers } from 'vuex';
import { LoadedClassListSearchTypeDef } from '@common/definition';
import axios from '@library/axios';

export const NAMESPACE = 'loadedClasses';

export const { mapState, mapMutations, mapActions } = createNamespacedHelpers(
    NAMESPACE
);

export const state = {
    domainId: -1,
    instanceOid: -1,
    className: '',

    detailName: '',
    detailCode: '',

    searchType: LoadedClassListSearchTypeDef.CLASS_NAME_CONTAINS_KEYWORD,
    searchLimit: 1000,

    loadedClasses: [],
    mainHeight: 630,
    useLoading: false,
};

export const getters = {
    isDomainValid(state) {
        return state.domainId !== -1 && state.instanceOid !== -1;
    },
};

export const mutations = {
    updateClassName(state, className) {
        state.className = className;
    },
    updateSearchCondition(state, payload) {
        state.searchType = payload.type;
        state.className = payload.keyword;
        state.searchLimit = payload.limit;
    },
    calculateMainHeight(state) {
        state.mainHeight = window.innerHeight - 230;
    },
    updateLoadedClasses(state, list = []) {
        state.loadedClasses = list;
    },
    updateTargetData(state, payload) {
        state.domainId = payload?.domainId || -1;
        state.instanceOid = payload?.instanceOid || -1;
    },
    toggleUseLoading(state, active) {
        state.useLoading = active;
    },
    updateDetailName(state, name) {
        state.detailName = name;
    },
    updateDetailCode(state, code) {
        state.detailCode = code;
    },
};

export const actions = {
    async loadClassListInAgent({ state, commit, getters }) {
        if (getters.isDomainValid) {
            commit('toggleUseLoading', true);

            const { data } = await axios.get('/analysis/loadedClasses/list', {
                params: {
                    format: 'json',
                    sid: state.domainId,
                    agent: state.instanceOid,
                    type: state.searchType,
                    limit: state.searchLimit,
                    keyword: state.className,
                    isProfile: false,
                },
            });

            commit('updateLoadedClasses', data.list);
            commit('toggleUseLoading', false);
        } else {
            commit('updateLoadedClasses');
        }
    },
    async loadClassTypeCode({ state, commit }) {
        const { data } = await axios.get('/analysis/classTypes', {
            params: {
                format: 'json',
                sid: state.domainId,
                agent: state.instanceOid,
                clazz: state.detailName,
            },
        });

        commit('updateDetailCode', data);
    },
    async loadDisassembleCode({ state, commit }) {
        const { data } = await axios.get('/analysis/disassembledCode', {
            params: {
                format: 'json',
                sid: state.domainId,
                agent: state.instanceOid,
                clazz: state.detailName,
            },
        });

        commit('updateDetailCode', data);
    },
    async loadDecompileCode({ state, commit }) {
        const { data } = await axios.get('/analysis/decompiledCode', {
            params: {
                format: 'json',
                sid: state.domainId,
                agent: state.instanceOid,
                clazz: state.detailName,
            },
        });

        commit('updateDetailCode', data);
    },
};
