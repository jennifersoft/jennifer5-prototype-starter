import axios from '@library/axios';
import { createNamespacedHelpers } from 'vuex';
import store from '@vuejs/vuex/store';

export const NAMESPACE = 'threadDetail';

export const { mapState, mapMutations, mapActions } = createNamespacedHelpers(
    NAMESPACE
);

store.registerModule(NAMESPACE, {
    namespaced: true,
    state: {
        threadName: '',
        stackTrace: '',
        lockName: '',
        blockedTime: -1,
        blockedCount: -1,
        threadUserTime: -1,
        lockOwnerId: -1,
        waitedCount: -1,
        waitedTime: -1,
    },
    mutations: {
        updateThreadDetail(state, data) {
            state.threadName = data.threadName;
            state.stackTrace = data.stackTrace;
            state.lockName = data.lockName;
            state.blockedTime = data.blockedTime;
            state.blockedCount = data.blockedCount;
            state.threadUserTime = data.threadUserTime;
            state.lockOwnerId = data.lockOwnerId;
            state.waitedCount = data.waitedCount;
            state.waitedTime = data.waitedTime;
        },
    },
    actions: {
        async loadThreadDetail({ commit }, payload) {
            const { data } = await axios.get('/analysis/thread/detail', {
                params: {
                    format: 'json',
                    sid: payload.domainId,
                    agent: payload.instanceOid,
                    id: payload.threadKey,
                },
            });

            commit('updateThreadDetail', data);
        },
    },
});

export default store;
