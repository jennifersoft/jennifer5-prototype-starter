import { createNamespacedHelpers } from 'vuex';
import axios from '@library/axios';
import { createFormData } from '@common/utility';

export const NAMESPACE = 'xviewAnalysis/stacktrace';

export const {
    mapState,
    mapMutations,
    mapActions,
    mapGetters,
} = createNamespacedHelpers(NAMESPACE);

export const state = {
    groupIndex: 0,
    stacktraceIndex: 0,
    stacktraceText: '',
    stacktraceContentRows: [],
    stacktraceSummaryRows: [],
    collectCount: 0,
    collectInterval: 0,
    collectThreshold: 0,
    collectStatus: '',
};

export const mutations = {
    updateStacktraceSummaries(state, payload) {
        state.stacktraceSummaryRows = payload.summary;
        state.collectCount = payload.collectCount;
        state.collectInterval = payload.config.interval;
        state.collectThreshold = payload.config.threshold;
        state.collectStatus = payload.config.policy;
    },
    updateStacktraceContents(state, contents) {
        state.groupIndex = 0;
        state.stacktraceIndex = 0;
        state.stacktraceText = '';
        state.stacktraceContentRows = contents;
    },
    updateStacktraceText(state, payload) {
        state.groupIndex = payload.groupIndex;
        state.stacktraceIndex = payload.stacktraceIndex;
        state.stacktraceText = payload.stacktraceText;
    },
};

export const actions = {
    async loadStacktraceSummaries({ commit }, params) {
        const { data } = await axios.get(
            '/dynamicProfile/autoStacktrace/summary',
            {
                params: params,
            }
        );

        commit('updateStacktraceSummaries', data);
    },
    async loadStacktraceContents({ commit }, params) {
        const { data } = await axios.get(
            '/dynamicProfile/autoStacktrace/contents/v2',
            {
                params: params,
            }
        );

        commit('updateStacktraceContents', data);
    },
    async loadStacktraceText(
        { commit, state },
        { domainId, groupIndex, stacktraceIndex }
    ) {
        const { stacktraceContentRows } = state;

        if (stacktraceContentRows.length > 0) {
            const stackTraces = stacktraceContentRows[groupIndex].stackTraces;

            if (stackTraces.length > 0) {
                const { time, hashes } = stackTraces[stacktraceIndex];
                const { data } = await axios.post(
                    '/dynamicProfile/autoStacktrace/texts',
                    createFormData({
                        format: 'json',
                        sid: domainId,
                        time: time,
                        hashes: hashes,
                    })
                );

                commit('updateStacktraceText', {
                    groupIndex: groupIndex,
                    stacktraceIndex: stacktraceIndex,
                    stacktraceText: data,
                });
            }
        }
    },
    async loadStacktraceData({ dispatch, getters, state }, payload) {
        const params = getters.transactionToProfileSearchParams(payload);
        await dispatch('loadStacktraceSummaries', params);
        await dispatch('loadStacktraceContents', params);
        dispatch('loadStacktraceText', {
            domainId: params.sid,
            groupIndex: state.groupIndex,
            stacktraceIndex: state.stacktraceIndex,
        });
    },
};

export const getters = {
    transactionToProfileSearchParams: () => payload => {
        const params = { ...payload, collectTime: payload.etime };
        delete params.stime;
        delete params.etime;
        return params;
    },
};
