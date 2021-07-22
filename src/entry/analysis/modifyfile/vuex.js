import store from '@vuejs/vuex/store';
import { createNamespacedHelpers } from 'vuex';
import { getDayjs, serverDateFormat } from '@common/base';
import { startOfDayjs } from '@common/dayjsWrapper';
import axios from '@library/axios';

import {
    SearchModifiedFileResultCodeDef,
    SimpleAgentCallResultCodeDef,
} from '@common/definition';

export const NAMESPACE = 'analysis/modifyFile';

store.registerModule(NAMESPACE, {
    namespaced: true,
    state: {
        domain: {
            sid: -1,
            oid: -1,
        },
        searchPath: '',
        timeFilter: {
            start: startOfDayjs(getDayjs(), 'date'),
            end: startOfDayjs(getDayjs(), 'date'),
        },
        limit: 100,
        tableData: [],
        loading: false,
        alertMessage: '',
    },
    mutations: {
        updateDomain(state, config) {
            const { sid, oid } = config;
            state.domain.sid = sid;
            state.domain.oid = oid;
        },
        updateSearchPath(state, text) {
            state.searchPath = text;
        },
        updateStartTime(state, time = startOfDayjs(getDayjs(), 'date')) {
            state.timeFilter = {
                ...state.timeFilter,
                start: time,
            };
        },
        updateEndTime(state, time = startOfDayjs(getDayjs(), 'date')) {
            state.timeFilter = {
                ...state.timeFilter,
                end: time,
            };
        },
        updateLimit(state, limit = 100) {
            state.limit = limit;
        },
        updateTableData(state, list = []) {
            state.tableData = list;
        },
        updateLoading(state, loading) {
            state.loading = loading;
        },
        updateAlertMessage(state, message = '') {
            state.alertMessage = message;
        },
    },
    getters: {
        isDomainValid(state) {
            const { sid, oid } = state.domain;
            return sid !== -1 && oid !== -1;
        },
    },
    actions: {
        async loadModifyFileData({ state, commit, getters }) {
            if (getters.isDomainValid) {
                const { sid, oid } = state.domain;
                const { searchPath: keyword, limit } = state;
                const { start, end } = state.timeFilter;

                commit('updateLoading', true);
                const { data, status } = await axios.get(
                    '/analysis/modifyfile',
                    {
                        params: {
                            format: 'json',
                            sid,
                            oid,
                            keyword,
                            limit,
                            stime: start.valueOf(),
                            etime: end.valueOf(),
                        },
                    }
                );
                if (status === 200) {
                    const { list, agentStatus, searchStatus } = data;
                    commit(
                        'updateTableData',
                        list.map(e => ({
                            ...e,
                            timestamp: getDayjs(e.lastModified).format(
                                serverDateFormat.long
                            ),
                        }))
                    );
                    if (agentStatus === SimpleAgentCallResultCodeDef.SUCCESS) {
                        // 검색이 제한된 경로일 때
                        if (
                            searchStatus ===
                            SearchModifiedFileResultCodeDef.NOT_SEARCHED_RESTRICTED_DIRECTORY
                        ) {
                            commit('updateAlertMessage', i18n.get('M0336'));
                        }
                    }
                }
                commit('updateLoading', false);
            } else {
                commit('updateTableData');
            }
        },
    },
});

export const { mapState, mapMutations, mapActions } = createNamespacedHelpers(
    NAMESPACE
);

export default store;
