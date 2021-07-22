import axios from '@library/axios';
import { createFormData } from '@common/utility';

export default {
    async loadTemplateList({ commit }) {
        const { data } = await axios.get('/template/document/list');

        commit('updateTemplateList', data);
    },
    async startTemplateBuild({}, payload) {
        await axios.post('/template/build/start', createFormData(payload));
    },
    async loadTemplateBuildTime({ commit }) {
        const { data } = await axios.get('/report/template/buildconfig');

        if (data !== '{}') {
            const tokens = JSON.parse(data).buildTime.split(':');
            commit('updateAutoBuildTime', {
                hour: parseInt(tokens[0]),
                minute: parseInt(tokens[1]),
            });
        }
    },
    async saveTemplateBuildTime({ commit }, { hour, minute }) {
        const hourText = hour < 10 ? `0${hour}` : `${hour}`;
        const minuteText = minute < 10 ? `0${minute}` : `${minute}`;

        const { data } = await axios.post(
            '/template/set/autoBuildTime',
            createFormData({
                buildTime: `${hourText}:${minuteText}`,
            })
        );

        if (data.result) commit('updateAutoBuildTime', { hour, minute });
    },
    async saveTemplateChartSetting({}, { line, bar, pie }) {
        await axios.post(
            '/report/template/theme/save',
            createFormData({
                line: JSON.stringify(line),
                bar: JSON.stringify(bar),
                pie: JSON.stringify(pie),
            })
        );
    },
    async saveTemplateBuildSetting({}, payload) {
        await axios.post('/template/set/autoBuildDist', payload);
    },
    async copyTemplateList({ commit, dispatch, state }) {
        await axios.post(
            '/template/document/copy',
            createFormData({
                keys: state.checkedTemplateKeys.join(','),
            })
        );

        commit('updateCheckedTemplateKeys', []);
        dispatch('loadTemplateList');
    },
    async deleteTemplateList({ commit, dispatch, state }) {
        await axios.post(
            '/template/document/delete',
            createFormData({
                keys: state.checkedTemplateKeys.join(','),
            })
        );

        commit('updateCheckedTemplateKeys', []);
        dispatch('loadTemplateList');
    },
    async loadUserMailList({ commit }) {
        const { data } = await axios.get('/serverInfo/smtp/list', {
            params: {
                format: 'json',
            },
        });

        commit('updateUserMailList', data);
    },
    async loadUserGroupList({ commit }) {
        const { data } = await axios.get('/report/groupList', {
            params: {
                format: 'json',
            },
        });

        commit('updateUserGroupList', data);
    },
    async loadUserMailListInGroup({}, groupId) {
        const { data } = await axios.get('/report/userEmailList', {
            params: {
                groupId: groupId,
                format: 'json',
            },
        });

        return data;
    },
};
