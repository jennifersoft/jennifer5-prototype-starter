import axios from '@library/axios';
import { createFormData } from '@common/utility';

export default {
    async loadDatabaseSettings({ commit }) {
        const { data } = await axios.get('/dbplan/info/list');
        commit('updateDatabaseSettings', data);
    },
    async executeDatabasePlan({ state, commit }) {
        const { data } = await axios.post(
            '/dbplan/exec',
            createFormData({
                dbName: state.databaseName,
                sid: state.domainId,
                key: state.dataKey,
                stime: state.startTime,
                etime: state.endTime,
                params: JSON.stringify(state.inlineParameters),
                bindParams: JSON.stringify(state.boundParameters),
            })
        );

        commit('updateOutputPlan', data);
    },
    async buildQueries({ state, commit }) {
        const { data } = await axios.post(
            '/dbplan/build',
            createFormData({
                sid: state.domainId,
                key: state.dataKey,
                stime: state.startTime,
                etime: state.endTime,
                params: JSON.stringify(state.inlineParameters),
                bindParams: JSON.stringify(state.boundParameters),
            })
        );

        commit('updateOutputQueries', data);
    },
};
