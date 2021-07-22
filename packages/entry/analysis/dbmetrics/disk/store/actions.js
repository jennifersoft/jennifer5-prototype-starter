import { Instance } from '@service/oidConfig';
import { normalizeOidConfigResponse } from '@vuejs/component/Resource/Tree/treeAction';
import axios from '@library/axios';
import { getByteToUnit } from '@common/utility';

export const actions = {
    async fetchResource({ state, commit, rootGetters }) {
        const sidList = rootGetters['domain/sidList'];
        const { start, end } = state.time;
        const ret = await Instance.get(sidList, start.valueOf(), end.valueOf());
        const domainNotClickable = normalizeOidConfigResponse(ret, 'instance')
            .map(n => ({
                ...n,
                check: 'no-check',
                selected: false,
            }))
            .map(l => {
                if (l.resourceType === 'domain') {
                    return {
                        ...l,
                        noInteraction: true,
                    };
                }
                return l;
            });
        commit('updateResourceData', Array.from(domainNotClickable));
    },
    async fetchPartitionList({ state, commit }) {
        const { sid: domainId, instanceId } = state.selected.resource;
        const { start, end } = state.time;
        if (!domainId || !instanceId) return;

        commit('updateLoadingPartitionList');
        const { data, status } = await axios.get('/agentDisk/partitionList', {
            params: {
                domainId,
                instanceId,
                startTime: start.valueOf(),
                endTime: end.valueOf(),
            },
        });
        if (status === 200)
            commit(
                'updatePartitionData',
                data.map(e => ({
                    label: e,
                    value: e,
                }))
            );
        commit('updateLoadingPartitionList', false);
    },
    async fetchDiskData({ state, commit }) {
        const { start, end } = state.time;
        const isDayFirst = state.viewByDate;

        const convertToRow = (
            list = [],
            partitionList,
            metricList,
            originData
        ) => {
            if (!originData || Object.keys(originData).length === 0) return;

            if (list.length === 0) {
                originData[partitionList[0]].forEach(item => {
                    list.push([item.collectTime]);
                });
            }

            partitionList.forEach(partition => {
                const items = originData[partition];

                items.forEach((item, index) => {
                    metricList.forEach(metric => {
                        if (item[metric] == -1) list[index].push('');
                        else
                            list[index].push(
                                metric == 'usedSpaceRate'
                                    ? item[metric].toFixed(1)
                                    : getByteToUnit(item[metric])
                            );
                    });
                });
            });
            return list;
        };

        let ret = [];
        for (const [index, item] of state.conditionQueue.entries()) {
            const { sid: domainId, instanceId } = item.resource;
            const partitionList = item.partitions.map(e => e.value);
            const metricList = item.metrics.map(e => e.value);
            const { data } = await axios.get('/agentDisk/diskInfoList', {
                params: {
                    domainId: domainId,
                    instanceId: instanceId,
                    startTime: start.valueOf(),
                    endTime: end.valueOf(),
                    partitionList,
                    isDayFirst,
                },
            });
            ret = convertToRow(ret, partitionList, metricList, data);
            commit('updateProgress', (index + 1) / state.conditionQueue.length);
        }
        commit('updateFilterCache', isDayFirst);
        commit('updateTableData', ret);
    },
};
