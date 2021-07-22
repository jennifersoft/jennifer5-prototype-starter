import { createNamespacedHelpers } from 'vuex';
import axios from '@library/axios';
import { GetProfileResultCodeDef } from '@common/definition';
import { createFormData } from '@common/utility';
import { STORAGE_KEYS } from '../constant';
import { getItem, setItem } from '../storage';

export const NAMESPACE = 'xviewAnalysis/timeline';

export const {
    mapState,
    mapMutations,
    mapActions,
    mapGetters,
} = createNamespacedHelpers(NAMESPACE);

export const state = {
    // 타임라인 조회시 프로파일 수집상태를 가져옴
    timelineStatus: GetProfileResultCodeDef.SEARCHED_ALL,
    timelineNodes: [],

    // 콜-트리 조회시 프로파일 수집상태를 가져올 수 있는데, 타임라인과 동일한 데이터라 추가하지 않았음
    callTreeNodes: [],

    activeCallTreeNodes: {
        type: 'Method',
        stime: 0,
        etime: 0,
        startProfileIndexInPlainText: 0,
        endProfileIndexInPlainText: 0,
        matchingCallTreeNodeKeyList: [],
        passingCallTreeNodeKeyList: [],
    },
    zeroMethodFilter: getItem(STORAGE_KEYS.CALLTREE_ZERO_FILTER, true, Boolean),
    notProfiledFilter: getItem(
        STORAGE_KEYS.CALLTREE_NOTPROFILED_FILTER,
        true,
        Boolean
    ),
    lostProfileFilter: getItem(
        STORAGE_KEYS.CALLTREE_LOSTPROFILE_FILTER,
        true,
        Boolean
    ),

    callTreeSequence: 1,
    activeSourceCode: '',

    instances: [],
    activeMethodProfile: {
        insList: null,
        retActive: false,
        retType: 'void',
        languageType: 1,
        returnValue: null,
        description: null,
        indexList: null,
        params: {
            value: '()',
            string: true,
            number: false,
            numberValue: 0,
            stringValue: '()',
            typeName: 'string',
            type: 18,
        },
    },
};

export const mutations = {
    updateTimelineNodes(state, { resultCode, list }) {
        state.timelineStatus = resultCode;
        state.timelineNodes = list;
    },
    updateCallTreeNodes(state, nodes) {
        state.callTreeNodes = nodes;
    },
    updateActiveCallTreeNodes(state, profile) {
        state.activeCallTreeNodes = profile;
    },
    updateCallTreeFilters(state, payload) {
        state.zeroMethodFilter = payload[0];
        state.notProfiledFilter = payload[1];
        state.lostProfileFilter = payload[2];
        setItem(STORAGE_KEYS.CALLTREE_ZERO_FILTER, payload[0]);
        setItem(STORAGE_KEYS.CALLTREE_NOTPROFILED_FILTER, payload[1]);
        setItem(STORAGE_KEYS.CALLTREE_LOSTPROFILE_FILTER, payload[2]);
    },
    reloadCallTree(state) {
        state.callTreeSequence += 1;
    },
    updateActiveSourceCode(state, code) {
        state.activeSourceCode = code;
    },
    updateInstances(state, instances) {
        state.instances = instances;
    },
    updateActiveMethodProfile(state, profile) {
        state.activeMethodProfile = profile;
    },
};

export const actions = {
    async loadTimelineNodes({ commit }, payload) {
        const { data } = await axios.get('/xview/profile/timeline', {
            params: payload,
        });

        commit('updateTimelineNodes', data);
    },
    async loadCallTreeNodes({ commit, state }, payload) {
        const { data } = await axios.get('/xview/profile/calltree', {
            params: {
                ...payload,
                zeroFilter: state.zeroMethodFilter,
                profileFilter: state.notProfiledFilter,
                lostFilter: state.lostProfileFilter,
            },
        });

        commit('updateCallTreeNodes', data.list);
    },
    async loadTimelineData({ dispatch }, payload) {
        await dispatch('loadTimelineNodes', payload);
        dispatch('loadCallTreeNodes', payload);
    },

    async setPackageOrClassProfile({}, payload) {
        const { data } = await axios.post(
            '/xview/profile/calltree/set/method',
            createFormData({
                format: 'json',
                sid: payload.domainId,
                insList: [payload.instanceOid],
                method: payload.profileTarget,
                methodList: [],
                langType: payload.languageType,
                ignore: payload.ignore,
                type: payload.profileType,
                isActive: true,
            })
        );

        return data;
    },

    async loadDecompileCode({ commit }, payload) {
        const { data } = await axios.get('/analysis/decompiledCode', {
            params: {
                format: 'json',
                sid: payload.domainId,
                agent: payload.instanceOid,
                clazz: payload.className,
            },
        });

        commit('updateActiveSourceCode', data);
    },
    async loadDisassembleCode({ commit }, payload) {
        const { data } = await axios.get('/analysis/disassembledCode', {
            params: {
                format: 'json',
                sid: payload.domainId,
                agent: payload.instanceOid,
                clazz: payload.className,
            },
        });

        commit('updateActiveSourceCode', data);
    },
    async loadClassType({ commit }, payload) {
        const { data } = await axios.get('/analysis/classTypes', {
            params: {
                format: 'json',
                sid: payload.domainId,
                agent: payload.instanceOid,
                clazz: payload.className,
            },
        });

        commit('updateActiveSourceCode', data);
    },

    async loadInstances({ commit }, domainId) {
        const { data } = await axios.get('/agent/names', {
            params: {
                format: 'json',
                sid: domainId,
            },
        });

        commit('updateInstances', data);
    },
    async loadMethodProfile({ dispatch, commit }, payload) {
        await dispatch('loadInstances', payload.domainId);

        const { data } = await axios.get('/xview/profile/calltree/get', {
            params: {
                format: 'json',
                type: payload.type,
                xtype: payload.xtype,
                sid: payload.domainId,
                method: payload.fullMethodDescription,
            },
        });

        commit('updateActiveMethodProfile', data);
    },
    async setMethodProfile({}, payload) {
        const { data } = await axios.post(
            '/xview/profile/calltree/set',
            createFormData({
                format: 'json',
                type: payload.type,
                languageType: payload.languageType,
                sid: payload.domainId,
                method: payload.fullMethodDescription,
                isActive: payload.activeProfile,
                retStatus: payload.activeReturn,
                paramIndex: payload.activeParameters,
                insList: payload.activeInstances,
            })
        );

        return data;
    },

    async loadErrorMessage({}, payload) {
        const { data } = await axios.get('/xview/error/detail', {
            params: {
                format: 'json',
                sid: payload.domainId,
                stime: payload.startTime,
                etime: payload.endTime,
                key: payload.key,
            },
        });

        return data;
    },
};

export const getters = {};
