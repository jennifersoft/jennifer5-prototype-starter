import axios from '@library/axios';
import { createNamespacedHelpers } from 'vuex';

export const NAMESPACE = 'xviewAnalysis/async';

export const {
    mapState,
    mapMutations,
    mapActions,
    mapGetters,
} = createNamespacedHelpers(NAMESPACE);

export const state = {
    asyncRows: [],
    maxRange: 100,
    chartDomain: [0, 100],
};

export const mutations = {
    updateAsyncRows(state, { txid, rows }) {
        const minStartTime =
            rows.length === 0
                ? 0
                : Math.min.apply(
                      null,
                      rows.map(row => row.collectTime - row.elapsedTime)
                  );
        const maxEndTime =
            rows.length === 0
                ? 100
                : Math.max.apply(
                      null,
                      rows.map(row => row.collectTime)
                  );

        state.maxRange = maxEndTime - minStartTime;
        state.chartDomain = [0, state.maxRange];
        state.asyncRows = rows.map((row, i) => {
            const startTime = row.collectTime - row.elapsedTime;
            const isRoot = row.id === row.asyncCallerId;

            return {
                // 테이블 관련 데이터
                key: row.id,
                parentKey: isRoot ? -1 : row.asyncCallerId,
                active: row.id === txid,
                application: row.applicationName,
                // 차트 관련 데이터
                blank: isRoot ? 0 : startTime - minStartTime,
                method: row.methodTime,
                sql: row.sqlTime,
                externalCall: row.externalCallTime,
            };
        });
    },
    updateChartDomain(state, chartDomain) {
        // 상호 참조를 할 수 있기 때문에 배열 카피를 하는게 안전함
        state.chartDomain = [...chartDomain];
    },
};

export const actions = {
    async loadAsyncRows({ commit }, payload) {
        const { data } = await axios.get('/api-v2/transaction/reactor-family', {
            params: {
                domains: payload.sid,
                asyncCallerId: payload.asyncCallerId,
                collectTime: payload.etime,
            },
        });

        commit('updateAsyncRows', {
            txid: payload.txid,
            rows: data,
        });
    },
};

export const getters = {};
