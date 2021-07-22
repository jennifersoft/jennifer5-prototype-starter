import { createNamespacedHelpers } from 'vuex';
import axios from '@library/axios';

export const NAMESPACE = 'xviewAnalysis/text';

export const {
    mapState,
    mapMutations,
    mapActions,
    mapGetters,
} = createNamespacedHelpers(NAMESPACE);

export const state = {
    profileText: '',
    profileCsv: '',
    profileNo: '',
};

export const mutations = {
    updateProfileText(state, text) {
        state.profileText = text;
    },
    updateProfileCsv(state, csv) {
        state.profileCsv = csv;
    },
    updateProfileNo(state, no) {
        state.profileNo = no;
    },
};

export const actions = {
    async loadProfileText({ commit }, payload) {
        const { data } = await axios.get('/xview/profile/text', {
            params: payload,
            headers: {
                Accept: 'text/plain; charset=utf-8',
            },
        });

        commit('updateProfileText', data);
    },
    async loadProfileCsv({ commit }, payload) {
        const { data } = await axios.get('/xview/profile/csv', {
            params: payload,
            headers: {
                Accept: 'text/plain; charset=utf-8',
            },
        });

        commit('updateProfileCsv', data);
    },
};

export const getters = {};
