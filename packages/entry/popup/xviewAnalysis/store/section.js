import axios from '@library/axios';
import { createNamespacedHelpers } from 'vuex';
import { BACKEND_TYPES } from '../constant';

export const NAMESPACE = 'xviewAnalysis/section';

export const {
    mapState,
    mapMutations,
    mapActions,
    mapGetters,
} = createNamespacedHelpers(NAMESPACE);

export const state = {
    // 개별 보기 (서버일 경우, 메소드:16, SQL:48, TXCALL:32)
    profileType: BACKEND_TYPES.METHOD,
    // clientTimeComponent 컨트롤러
    domTime: 0,
    networkTime: 0,
    renderTime: 0,
    // serverTimeComponent 컨트롤러
    methodTime: 0,
    sqlTime: 0,
    externalCallTime: 0,
    methodRows: [],
    sqlRows: [],
    externalCallRows: [],
    // serverTimeComponent/individual 컨트롤러 :  method/sql/tx 프로퍼티 이름이 모두 동일함 (개별 보기)
    individualRows: [],
};

export const mutations = {
    changeProfileType(state, profileType) {
        state.profileType = profileType;
    },
    updateIndividualRows(state, rows) {
        state.individualRows = rows;
    },
    updateServerData(state, payload) {
        // 개별 데이터를 가져오기 위한 프로파일 타입 설정
        if (
            payload.sqlTotalTime >
            Math.max(payload.methodTotalTime, payload.txTotalTime)
        )
            state.profileType = BACKEND_TYPES.SQL;
        else if (
            payload.txTotalTime >
            Math.max(payload.methodTotalTime, payload.sqlTotalTime)
        )
            state.profileType = BACKEND_TYPES.EXTERNALCALL;
        else state.profileType = BACKEND_TYPES.METHOD;

        state.methodTime = payload.methodTotalTime;
        state.sqlTime = payload.sqlTotalTime;
        state.externalCallTime = payload.txTotalTime;
        state.methodRows = payload.methodList;
        state.sqlRows = payload.sqlList;
        state.externalCallRows = payload.txList;
    },
    updateClientData(state, payload) {
        state.domTime = payload.domTime;
        state.networkTime = payload.networkTime;
        state.renderTime = payload.renderTime;
    },
};

export const actions = {
    async loadIndividualRows({ commit, state }, payload) {
        const { data } = await axios.get(
            '/xview/profile/serverTimeComponent/individual',
            {
                params: { ...payload, profileType: state.profileType },
            }
        );

        commit('updateIndividualRows', data.list);
    },
    async loadServerData({ dispatch, commit, state }, payload) {
        const { data } = await axios.get('/xview/profile/serverTimeComponent', {
            params: payload,
        });

        commit('updateServerData', data);

        // 선택된 프로파일 타입이 있을 경우 (개별 데이터 가져오기)
        await dispatch('loadIndividualRows', payload);
    },
    async loadClientData({ commit, state }, payload) {
        const { data } = await axios.get('/xview/profile/clientTimeComponent', {
            params: payload,
        });

        commit('updateClientData', data);
    },
    async loadSectionData({ dispatch, commit }, payload) {
        await dispatch('loadClientData', payload);
        await dispatch('loadServerData', payload);
    },
};

export const getters = {};
