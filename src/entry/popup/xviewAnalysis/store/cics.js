import { createNamespacedHelpers } from 'vuex';
import axios from '@library/axios';

export const NAMESPACE = 'xviewAnalysis/cics';

export const {
    mapState,
    mapMutations,
    mapActions,
    mapGetters,
} = createNamespacedHelpers(NAMESPACE);

export const state = {
    totalResponseTime: 0,
    dispatchTime: 0,
    // 위 두개 필드는 업데이트시 가공한다.
    jvmSuspendTime: 0,
    javaClassCount: 0,
    javaCpuTime: 0,
    originalCicsAbend: '',
    transactionName: '',
    resourceSuspendTime: 0,
    firstWaitTime: 0,
    jvmThreadWaitTime: 0,
    maxTcbDelayTime: 0,
    mroWaitTime: 0,
    jvmElapsedTime: 0,
    currentCicsAbend: '',
    startWaitTime: 0,
    startTime: Date.now(),
    stopTime: Date.now(),
    generalCpuTime: 0,
    tcbSwitchCount: 0,
    totalCpuTime: 0,
    cicsExecutionCount: 0,
    suspendTime: 0,
    pthreadWaitTime: 0,
    userId: '',
    dispatchWaitTime: 0,
    cicsLinkCount: 0,
    db2RequestCount: 0,
    fileAccessCount: 0,
    cicsSyncPointCount: 0,
    taskId: 1,
};

export const mutations = {
    updateCicsData(state, data) {
        Object.keys(state).forEach(key => {
            state[key] = data[key];
        });

        state.totalResponseTime = data.stopTime - data.startTime;
        state.dispatchTime = state.totalResponseTime - data.suspendTime;
    },
};

export const actions = {
    async loadCicsData({ commit, getters }, payload) {
        const { data } = await axios.get('/xview/cics', {
            params: getters.transactionToProfileSearchParams(payload),
        });

        commit('updateCicsData', data);
    },
};

export const getters = {
    transactionToProfileSearchParams: () => payload => {
        return {
            domainId: payload.sid,
            collectionTime: payload.etime,
            transactionId: payload.txid,
        };
    },
};
