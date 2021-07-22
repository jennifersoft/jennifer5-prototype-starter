import store from '@vuejs/vuex/store';
import { createNamespacedHelpers } from 'vuex';
import axios from '@library/axios';
import { i18n } from '@common/utility';
import { getDayjs, serverDateFormat } from '@common/base';

export const NAMESPACE = 'analysis/searchclass';

export const {
    mapState,
    mapMutations,
    mapActions,
    mapGetters,
} = createNamespacedHelpers(NAMESPACE);

store.registerModule(NAMESPACE, {
    namespaced: true,
    state: {
        domain: {
            sid: -1,
            oid: -1,
        },
        searchParams: {
            keyword: '',
            type: 3,
            limit: 100,
        },
        tableData: [],
        loading: false,
    },
    mutations: {
        updateDomain(state, config) {
            const { sid, oid } = config;
            state.domain.sid = sid;
            state.domain.oid = oid;
        },
        updateTableData(state, list = []) {
            state.tableData = list;
        },
        updateSearchKeyword(state, keyword = '') {
            state.searchParams = {
                ...state.searchParams,
                keyword,
            };
        },
        updateSearchType(state, type) {
            state.searchParams = {
                ...state.searchParams,
                type,
            };
        },
        updateSearchLimit(state, limit) {
            state.searchParams = {
                ...state.searchParams,
                limit,
            };
        },
        updateLoading(state, loading) {
            state.loading = loading;
        },
    },
    getters: {
        isDomainValid(state) {
            const { sid, oid } = state.domain;
            return sid !== -1 && oid !== -1;
        },
    },
    actions: {
        async loadSearchClassData({ state, commit, getters }) {
            if (getters.isDomainValid) {
                const { sid, oid } = state.domain;
                const { keyword, type, limit } = state.searchParams;

                // 검색조건 체크
                if (keyword === '') {
                    alert(i18n.get('M0021'));
                    return;
                }

                commit('updateLoading', true);
                const { data, status } = await axios.get(
                    '/analysis/searchclass',
                    {
                        params: {
                            format: 'json',
                            sid,
                            oid,
                            keyword,
                            type,
                            limit,
                        },
                    }
                );
                if (status === 200) {
                    commit(
                        'updateTableData',
                        data.map(e => ({
                            ...e,
                            timestamp: getDayjs(e.lastModified).format(
                                serverDateFormat.long
                            ),
                        }))
                    );
                }
                commit('updateLoading', false);
            } else {
                commit('updateTableData');
            }
        },
    },
});

export default store;
