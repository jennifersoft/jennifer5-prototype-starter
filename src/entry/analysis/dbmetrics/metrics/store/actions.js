import { Business, Instance } from '@service/oidConfig';
import { OTypeDef } from '@common/definition';
import axios from '@library/axios';
import { i18n } from '@common/utility';
import { getDayjs } from '@common/base';

export const actions = {
    async fetchResource({ commit, state, rootGetters }) {
        const sidList = rootGetters['domain/sidList'];
        const { start, end } = state.filters.time;

        const instance = await Instance.get(
            sidList,
            start.valueOf(),
            end.valueOf()
        );
        const business = await Business.get(
            sidList,
            start.valueOf(),
            end.valueOf()
        );
        commit('updateResourceData', { instance, business });
    },
    async findMetricsGroup({ commit }, resourceType) {
        const { data } = await axios.get(`/metrics/${resourceType}`, {
            params: { format: 'json' },
        });
        commit(
            'updateMetricsData',
            data.map(d => ({
                label: i18n.get(`ui.mx.${d[0]}`),
                description: i18n.get(`ui.mx.${d[0]}.tooltip`),
                value: d[1],
            }))
        );
    },
    async loadMetricsData(
        { commit, dispatch, state, getters },
        { index = 0, list = [] }
    ) {
        if (index === state.searchConditionQueue.length) {
            commit('updateTableData', list);
            commit('updateProgress', 1);
            commit('setSearchCache', {
                gatheringInterval: state.filters.gatheringInterval,
                time: {
                    ...state.filters.time,
                },
                operatingTime: {
                    ...state.filters.operatingTime,
                },
            });
            return;
        }

        const { columnIndexMap } = getters;
        const {
            gatheringInterval,
            time,
            operatingTime,
            excludes,
        } = state.filters;
        const { start, end } = time;
        const { from, to } = operatingTime;
        let cycle = gatheringInterval * 60 * 1000;
        let sindex = 0,
            eindex = 1;

        // all
        if (gatheringInterval === 0) {
            cycle = end.valueOf() - start.valueOf();
        } else {
            sindex = Math.floor(
                (start.valueOf() -
                    start
                        .hour(0)
                        .minute(0)
                        .valueOf()) /
                    cycle
            );
            eindex =
                sindex + Math.ceil((end.valueOf() - start.valueOf()) / cycle);
        }

        const { resourceType, resources, metric } = state.searchConditionQueue[
            index
        ];

        const otype =
            resourceType === 'business' ? OTypeDef.BUSINESS : OTypeDef.SYSTEM;
        commit('updateProgress', index / state.searchConditionQueue.length);
        const { data } = await axios.get('/domaingroup/db/metrics', {
            params: {
                group: JSON.stringify(resources.grouped),
                metrics: metric.value,
                otype,
                interval: gatheringInterval * 60 * 1000,
                stime: start.valueOf(),
                etime: end.valueOf(),
                shour: from,
                ehour: to,
                excludes,
            },
        });

        if (list.length === 0) {
            let accTime = 0;
            for (let i = sindex; i < eindex; i++) {
                const timestamp = start.valueOf() + accTime;
                const d = getDayjs(timestamp);
                if (
                    !excludes.includes(d.format('YYYYMMDD')) ||
                    gatheringInterval === 0
                ) {
                    list.push([timestamp]);
                }
                accTime += cycle;
            }
        }
        for (let i = 0; i < data.length; i++) {
            const columnKey =
                index +
                ':' +
                data[i].v1.domainId +
                ':' +
                data[i].v1.instanceOid;

            for (let j = 0; j < list.length; j++) {
                list[j][columnIndexMap[columnKey]] = data[i].v2[j + sindex];
            }
        }
        await dispatch('loadMetricsData', { index: index + 1, list });
    },
};
