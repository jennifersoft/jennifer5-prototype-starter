import axios from '@library/axios';
import { createFormData } from '@common/utility';

export default {
    async loadServiceDumpFiles({ commit, state }) {
        commit('updateSearchLoading', true);

        const { data } = await axios.get('/analysis/servicedump/list', {
            params: {
                format: 'json',
                sid: state.domainIds[0],
                agent: state.instanceOids[0],
                sdate: state.startDate.valueOf(),
                edate: state.endDate.valueOf() + 1,
            },
        });

        commit('updateServiceDumpFiles', data.list);
        commit('updateSearchLoading', false);
    },
    async createServiceDumpFile({ state, commit, dispatch }) {
        commit('updateDumpLoading', true);
        await axios.post(
            '/analysis/servicedump/set',
            createFormData({
                sid: state.domainIds[0],
                agent: state.instanceOids[0],
            })
        );
        commit('updateDumpLoading', false);

        await dispatch('loadServiceDumpFiles');
    },
    async deleteServiceDumpFiles({ state, commit, dispatch }, files) {
        commit('updateDeleteLoading', true);
        await axios.post(
            '/analysis/servicedump/delete',
            createFormData({
                format: 'json',
                sid: state.domainIds[0],
                agent: state.instanceOids[0],
                fileNames: files,
            })
        );
        commit('updateDeleteLoading', false);

        await dispatch('loadServiceDumpFiles');
    },
    async applyMemoryDump({ state }) {
        return await axios.post(
            '/analysis/servicedump/memory/set',
            createFormData({
                format: 'json',
                sid: state.domainIds[0],
                agent: state.instanceOids[0],
            })
        );
    },
};
