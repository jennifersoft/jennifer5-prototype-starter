import axios from '@library/axios';
import { createNamespacedHelpers } from 'vuex';

export const NAMESPACE = 'autoProfile';

export const { mapState, mapMutations, mapActions } = createNamespacedHelpers(
    NAMESPACE
);

export const state = {
    // 추가로 조회하는 데이터
    instanceOid: -1,
    enable: false,
    baselineTransactionElapsedTimeForProfile: 8000,

    // 메소드 최소 응답시간, 메소드 샘플링 주기 (프로파일 레벨이 OPTIONAL일 때만)
    baselineMethodElapsedTimeForProfile: 100,
    methodSamplingIntervalDuringProfile: 100,

    // 고급 옵션설정 (M0664 ~ M0669)
    baselineIgnorableMethodElapsedTimeForSendToDataServer: 0,
    baselineNone: false,
    methodSamplingStackDepthLimit: 100,
    checkIntervalForSelectTransactionToProfile: 1000,
    clearInterval: 86400000,
    maxProfileTargetCount: 10000,
    profileQueueSize: 10000,

    profileLevel: 'PERFORMANCE', // AutoProfileLevel.kt 참고
    ignoreClassOrPackages: [],
    name: '',

    // 자동 프로파일이 설정된 메소드 목록
    profiledMethods: [],
};

export const mutations = {
    addIgnoreClassOrPackages(state, item) {
        if (!state.ignoreClassOrPackages.includes(item)) {
            state.ignoreClassOrPackages = [
                ...state.ignoreClassOrPackages,
                item,
            ];
        }
    },
    removeIgnoreClassOrPackages(state, item) {
        state.ignoreClassOrPackages = state.ignoreClassOrPackages.filter(
            v => v !== item
        );
    },
    updateInstanceSettings(state, data) {
        const keys = Object.keys(data);
        keys.forEach(key => {
            state[key] = data[key];
        });
    },
    updateProfiledMethods(state, data) {
        state.profiledMethods = data.filter(method => method !== '');
    },
};

export const actions = {
    async loadInstanceSettings({ state, commit }, payload) {
        const { data } = await axios.get(
            `/api-v2/manage/auto-profile/${payload.domainId}/${payload.instanceId}`
        );

        commit('updateInstanceSettings', {
            ...data,
            baselineNone:
                data.baselineIgnorableMethodElapsedTimeForSendToDataServer ===
                -1,
        });
    },
    async loadProfiledMethods({ state, commit }, payload) {
        const { data } = await axios.get(
            `/api-v2/auto-profile/profiled-method/${payload.domainId}/${payload.instanceId}`
        );

        commit('updateProfiledMethods', data);
    },
    saveInstanceSettings({ state }, payload) {
        return axios.put(`/api-v2/manage/auto-profile/${payload.domainId}`, {
            instanceId: payload.instanceId,
            enable: state.enable,
            baselineTransactionElapsedTimeForProfile:
                state.baselineTransactionElapsedTimeForProfile,
            baselineMethodElapsedTimeForProfile:
                state.baselineMethodElapsedTimeForProfile,
            baselineIgnorableMethodElapsedTimeForSendToDataServer: state.baselineNone
                ? -1
                : state.baselineIgnorableMethodElapsedTimeForSendToDataServer,
            profileQueueSize: state.profileQueueSize,
            clearInterval: state.clearInterval,
            checkIntervalForSelectTransactionToProfile:
                state.checkIntervalForSelectTransactionToProfile,
            methodSamplingIntervalDuringProfile:
                state.methodSamplingIntervalDuringProfile,
            methodSamplingStackDepthLimit: state.methodSamplingStackDepthLimit,
            maxProfileTargetCount: state.maxProfileTargetCount,
            profileLevel: state.profileLevel,
            ignoreClassOrPackages: state.ignoreClassOrPackages,
        });
    },
};
