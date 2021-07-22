import axios from '@library/axios';
import { getDayjs, serverDateFormat } from '@common/base';
import { convertTimeText } from '@entry/analysis/dbmetrics/dbsearch';

export default {
    fetchListData(
        { state, commit, getters, dispatch },
        { session = null, list = [] }
    ) {
        const { group, otype } = getters;
        const { start, end } = state.timeFilter;

        if (!state.loading) {
            commit('updateProgress', 1);
            commit('updateListTableData', list);
            return;
        }

        setTimeout(async () => {
            if (!session) {
                const { data, status } = await axios.get(
                    '/domaingroup/db/error/list/key',
                    {
                        params: {
                            group,
                            stime: start.valueOf(),
                            etime: end.valueOf(),
                            otype,
                            errorTypes: state.errorTypes,
                        },
                    }
                );
                if (status === 200) {
                    commit('updateProgress', 0);
                    commit('updateListTableData');
                    dispatch('fetchListData', { session: data });
                }
            } else {
                const { data, status } = await axios.get(
                    '/domaingroup/db/error/list/data',
                    {
                        params: {
                            session,
                        },
                    }
                );
                if (status === 200) {
                    const { partialData, hasNext, progress } = data;
                    commit('updateProgress', progress);
                    if (!hasNext) commit('updateLoading', false);
                    dispatch('fetchListData', {
                        session,
                        list: list.concat(
                            partialData.map(e => ({
                                ...e,
                                nameWithDomain:
                                    state.resourceType === 'domain'
                                        ? e.name
                                        : `${e.name} (${e.domainName})`,
                                timeFormat: getDayjs(e.time).format(
                                    serverDateFormat.longWithSec
                                ),
                            }))
                        ),
                    });
                }
            }
        }, 100);
    },
    fetchCountData(
        { state, commit, getters, dispatch },
        { session = null, list = [] }
    ) {
        const { group, otype, intervalInMinute } = getters;
        const { start, end } = state.timeFilter;

        if (!state.loading) {
            commit('updateProgress', 1);
            commit('updateCountTableData', list);
            return;
        }
        setTimeout(async () => {
            if (!session) {
                const { data, status } = await axios.get(
                    '/domaingroup/db/error/count/key',
                    {
                        params: {
                            group,
                            stime: start.valueOf(),
                            etime: end.valueOf(),
                            otype,
                            errorTypes: state.errorTypes,
                            intervalInMinute,
                            checkZeroCount: state.showZeroCount,
                        },
                    }
                );
                if (status === 200) {
                    commit('updateProgress', 0);
                    commit('updateCountTableData');
                    dispatch('fetchCountData', { session: data });
                }
            } else {
                const { status, data } = await axios.get(
                    '/domaingroup/db/error/count/data',
                    {
                        params: {
                            otype,
                            session,
                            checkZeroCount: state.showZeroCount,
                        },
                    }
                );
                if (status === 200) {
                    const { partialData, hasNext, progress } = data;
                    commit('updateProgress', progress);
                    if (!hasNext) commit('updateLoading', false);
                    dispatch('fetchCountData', {
                        session,
                        list: list.concat(
                            partialData.map(e => ({
                                ...e,
                                nameWithDomain:
                                    state.resourceType === 'domain'
                                        ? e.name
                                        : `${e.name} (${e.domainName})`,
                                timeFormat: convertTimeText(
                                    e.time,
                                    end.valueOf(),
                                    state.gatheringInterval,
                                    state.onlyStartTime
                                ),
                            }))
                        ),
                    });
                }
            }
        }, 100);
    },
};
