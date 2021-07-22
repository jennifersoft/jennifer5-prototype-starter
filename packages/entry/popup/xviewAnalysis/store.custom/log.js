import { createNamespacedHelpers } from 'vuex';
import axios from '@library/axios';

let cancelHandler = null;

export const NAMESPACE = 'xviewAnalysis/custom/log';

export const {
    mapState,
    mapMutations,
    mapActions,
    mapGetters,
} = createNamespacedHelpers(NAMESPACE);

export const state = {
    customLog: '',
};

export const mutations = {
    updateLogFile(state, log) {
        state.customLog = log;
    },
};

export const actions = {
    async loadCustomLog({ commit }, payload) {
        commit('updateLogFile', 'Loading the log file...');

        if (cancelHandler !== null) {
            cancelHandler.cancel('Canceled while processing the request.');
            cancelHandler = null;
        }

        cancelHandler = axios.CancelToken.source();

        axios
            .get(
                `/api-v2/third-party-log/${payload.domainId}/${payload.instanceId}`,
                {
                    cancelToken: cancelHandler.token,
                    params: {
                        transactionId: payload.transactionId,
                        transactionCollectTime: payload.collectionTime,
                    },
                }
            )
            .then(res => {
                cancelHandler = null;
                commit('updateLogFile', res.data.description);
            })
            .catch(err => {
                if (axios.isCancel(err)) console.warn(err.message);
                else console.error(err.message);
            });
    },
};

export const getters = {};
