import { ServiceText } from '@entry/analysis/dbmetrics/service/api/textBySession';
import { ServiceDataLegacy } from '@entry/analysis/dbmetrics/service/api/serviceBySession';

export const actions = {
    async fetchApplicationText(
        { state, commit, dispatch, rootGetters },
        { sessionKey = '', payload = [] }
    ) {
        const domainIds = rootGetters['domain/sidList'];
        const startTime = state.startTime.valueOf();
        const endTime = state.endTime.valueOf();
        const realSessionKey =
            sessionKey ||
            (
                await ServiceText.create(
                    state.serviceType,
                    domainIds,
                    startTime,
                    endTime
                )
            ).data;

        const res = await ServiceText.read(realSessionKey);
        payload = payload.concat(res.data.texts);

        if (res.data.completed) {
            commit(
                'updateServiceNameData',
                payload.map(e => ({
                    ...e,
                    checked: state.serviceHashSet.has(e.hash),
                }))
            );
        } else {
            await dispatch('fetchApplicationText', {
                sessionKey: realSessionKey,
                payload,
            });
        }
    },
    async fetchApplicationService({ state, commit }) {
        const groupData = JSON.stringify(state.groupData);
        const startTime = state.startTime.valueOf();
        const endTime = state.endTime.valueOf();

        commit('updateTableLoading', true);
        const res = await ServiceDataLegacy.read(
            state.serviceType,
            groupData,
            startTime,
            endTime,
            state.serviceHashes.map(e => e.hash),
            state.intervalType
        );
        if (res?.data) {
            commit('updateTableData', res.data);
        }
        commit('updateTableLoading', false);
    },
};
