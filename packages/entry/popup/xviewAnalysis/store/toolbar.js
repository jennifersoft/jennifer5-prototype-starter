import { createNamespacedHelpers } from 'vuex';
import axios from '@library/axios';
import { i18n } from '@common/utility';

export const NAMESPACE = 'xviewAnalysis/toolbar';

export const {
    mapState,
    mapMutations,
    mapActions,
    mapGetters,
} = createNamespacedHelpers(NAMESPACE);

export const state = {
    linkedTransactionRows: [],
    guidTransactionRows: [],
    talkTitle: '',
    talkContents: '',

    // 각각의 상세 탭 관련 설정
    showIndividualInSection: false,
};

export const mutations = {
    updateLinkedTransactionRows(state, rows) {
        state.linkedTransactionRows = rows;
    },
    updateGuidTransactionRows(state, rows) {
        state.guidTransactionRows = rows;
    },
    updateTalkData(state, data) {
        const title =
            '[' + i18n.get('ui.label.transaction') + '] ' + data.serviceName;
        const link =
            '/xview/profile/text?sid=' +
            data.params.sid +
            '&txid=' +
            data.params.txid +
            '&stime=' +
            data.params.stime +
            '&etime=' +
            data.params.etime;

        let contents =
            '<div id="xviewPoint" class="row" style="width: 100%;"><pre>' +
            data.text +
            '</pre></div><div class="hr"/><br/>';
        contents +=
            "<br /><a data-profile-sid='" +
            data.params.sid +
            "' data-profile-txid='" +
            data.params.txid +
            "' data-profile-stime='" +
            data.params.stime +
            "' data-profile-etime='" +
            data.params.etime +
            "' class='profile-popup-view'><i class='icon-link'></i> " +
            i18n.get('ui.label.watchProfilePopup') +
            '</a>';
        contents +=
            "<br /><a href='" +
            link +
            "' target='_blank' class='profile-link'><i class='icon-link'></i> " +
            i18n.get('ui.label.watchSharedProfile') +
            '</a>';

        state.talkTitle = title;
        state.talkContents = contents;
    },
    resetTransactionRows(state) {
        state.linkedTransactionRows = [];
        state.guidTransactionRows = [];
        state.talkTitle = '';
        state.talkContents = '';
    },
    toggleShowIndividualInSection(state) {
        state.showIndividualInSection = !state.showIndividualInSection;
    },
};

export const actions = {
    async loadLinkedTransactionRows({ commit }, payload) {
        const { data } = await axios.get('/xview/find/pointList/all', {
            params: payload,
        });

        commit('updateLinkedTransactionRows', data);
    },

    async loadGuidTransactionRows({ commit }, payload) {
        const { data } = await axios.get('/xview/find/pointList/guid', {
            params: payload,
        });

        commit('updateGuidTransactionRows', data);
    },

    async shareWithTalk({ commit }, payload) {
        const { data } = await axios.get('/xview/profile/talk', {
            params: payload.params,
            headers: {
                Accept: 'text/plain; charset=utf-8',
            },
        });

        commit('updateTalkData', {
            ...payload,
            text: data,
        });
    },
};

export const getters = {};
