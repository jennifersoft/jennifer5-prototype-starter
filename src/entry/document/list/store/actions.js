import axios from '@library/axios';
import { createFormData } from '@common/utility';

export default {
    async copyReportList({ commit, dispatch, state }) {
        await axios.post(
            '/report/document/copy',
            createFormData({
                keys: state.checkedReportKeys.join(','),
            })
        );

        commit('updateCheckedReportKeys', []);
        dispatch('loadReportList');
    },
    async deleteReportList({ commit, dispatch, state }) {
        await axios.post(
            '/report/document/delete',
            createFormData({
                keys: state.checkedReportKeys.join(','),
            })
        );

        commit('updateCheckedReportKeys', []);
        dispatch('loadReportList');
    },
    async moveReportList({ commit, dispatch, state }, directoryKey) {
        await axios.post(
            '/report/document/move',
            createFormData({
                keys: state.checkedReportKeys.join(','),
                directoryKey: directoryKey,
            })
        );

        commit('updateCheckedReportKeys', []);
        dispatch('loadReportList');
    },
    async loadReportList({ commit, state }) {
        const { data } = await axios.get('/report/document/page', {
            params: {
                directoryKey: state.directoryKey,
                isAllView: state.viewAll,
            },
        });

        commit('updateReportList', data.list);
        commit('updateReportListInDirectory');
    },
    async loadDirectoryList({ commit }, directoryKey) {
        const { data } = await axios.get('/report/directory/list');

        commit('updateDirectoryList', data);
        commit('updateDirectoryKey', directoryKey);
    },
    saveDirectoryName({ commit, state }, payload) {
        axios
            .post(
                '/report/directory/save',
                createFormData({
                    name: payload.name,
                    key: payload.key,
                })
            )
            .then(() => {
                const newDirectoryList = state.directoryList.map(dir => {
                    if (dir.key === payload.key) {
                        return {
                            ...dir,
                            name: payload.name,
                        };
                    }
                    return { ...dir };
                });

                commit('updateDirectoryList', newDirectoryList);

                // 현재 선택된 디렉토리의 경우에만 이름을 변경해줘야 함
                if (state.directoryKey === payload.key)
                    commit('updateDirectoryName', payload.name);
            });
    },
    deleteDirectory({ commit, state }, payload) {
        axios
            .post(
                '/report/directory/delete',
                createFormData({
                    name: payload.name,
                    key: payload.key,
                })
            )
            .then(() => {
                commit(
                    'updateDirectoryList',
                    state.directoryList.filter(dir => dir.key !== payload.key)
                );
            });
    },
};
