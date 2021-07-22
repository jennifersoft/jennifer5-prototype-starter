import { Business, Instance } from '@service/oidConfig';
import { ErrorTypeDef, OTypeDef, EventLevelDef } from '@common/definition';
import axios from '@library/axios';
import { i18n, printEscape } from '@common/utility';
import { convertTimeText } from '@entry/analysis/dbmetrics/dbsearch';
import { getDayjs, serverDateFormat } from '@common/base';

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
    loadEventTypes({ state, commit }) {
        const list = [{ text: i18n.get('ui.label.metricsEvent'), value: -1 }];
        const { resourceType } = state.filters;

        if (resourceType === 'instance') {
            list.push({
                text: i18n.get('ui.label.metricsCompareEvent'),
                value: -2,
            });

            for (const key in ErrorTypeDef) {
                list.push({ text: key, value: ErrorTypeDef[key] });
            }
        }

        commit(
            'updateEventTypeData',
            list.map(t => {
                return {
                    label: t.text,
                    data: t,
                };
            })
        );
    },
    loadEventLevels({ commit }) {
        const list = [
            {
                text: i18n.get('ui.label.fatal'),
                value: EventLevelDef.FATAL,
            },
            {
                text: i18n.get('ui.label.warning'),
                value: EventLevelDef.WARNING,
            },
            {
                text: i18n.get('ui.label.normal'),
                value: EventLevelDef.NORMAL,
            },
        ];
        commit(
            'updateEventLevelData',
            list.map(t => {
                return {
                    label: t.text,
                    data: t,
                };
            })
        );
    },
    async fetchListData(
        { state, getters, commit, dispatch },
        { session, list = [] }
    ) {
        const { loading } = state;
        if (!loading) {
            commit('updateProgress', 1);
            return;
        }

        if (!session) {
            commit('updateProgress', 0);
            commit('updateTableData', list);

            const {
                resources,
                time,
                resourceType,
                eventTypes,
                eventLevels,
            } = state.filters;
            const { start, end } = time;
            const { includeMetricEvent, includeMetricCompareEvent } = getters;

            // JJC-4220: 도메인 조회 시 빈 배열이 아닌 기본 값 [0] 전달
            const group = resources.grouped;
            Object.keys(group).forEach(key => {
                if (group[key].length === 0) group[key] = [0];
            });

            const { data, status } = await axios.get(
                '/domaingroup/db/event/list/key',
                {
                    params: {
                        group: JSON.stringify(group),
                        stime: start.valueOf(),
                        etime: end.valueOf(),
                        otype:
                            resourceType === 'business'
                                ? OTypeDef.BUSINESS
                                : OTypeDef.SYSTEM,
                        errorTypes: eventTypes.map(e => e.data.value),
                        eventLevelList: eventLevels.map(e => e.data.value),
                        includeMetricEvent,
                        includeMetricCompareEvent,
                        // filterByShowAlertFlag: filterByShowAlertFlag,
                        // sendExternalNotificationFlag: sendExternalNotificationFlag,
                    },
                }
            );
            if (status === 200) {
                dispatch('fetchListData', { session: data });
                // listTable.reset();
            }
        } else {
            const { resourceType } = state.filters;
            const { data, status } = await axios.get(
                '/domaingroup/db/event/list/data',
                {
                    params: {
                        session,
                    },
                }
            );
            if (status === 200) {
                const { progress, partialData, hasNext } = data;
                commit('updateProgress', progress);

                partialData.forEach(d => {
                    const { mxidName, errorTypeName } = d;

                    let errorTypeNameWithUnit = errorTypeName;
                    if (mxidName !== '')
                        errorTypeNameWithUnit +=
                            ' (' + i18n.get(`ui.mx.${mxidName}`) + ')';
                    list.push({
                        ...d,
                        nameWithDomain:
                            resourceType === 'domain'
                                ? d.domainName
                                : `${d.name} (${d.domainName})`,
                        newMessage: printEscape(d.message || d.detailMessage),
                        errorTypeNameWithUnit,
                        timestamp: getDayjs(d.time).format(
                            serverDateFormat.longWithSec
                        ),
                    });
                });

                if (hasNext) {
                    dispatch('fetchListData', { session, list });
                } else {
                    commit('updateTableData', list);
                    commit('updateProgress', 1);
                }
            }
        }
    },
    async fetchCountData(
        { state, getters, commit, dispatch },
        { session, list = [] }
    ) {
        if (!session) {
            commit('updateProgress', 0);
            commit('updateTableData', list);

            const {
                resources,
                time,
                resourceType,
                eventTypes,
                eventLevels,
                checkZeroCount,
            } = state.filters;
            const { start, end } = time;
            const {
                includeMetricEvent,
                includeMetricCompareEvent,
                intervalInMinute,
            } = getters;

            const group = resources.grouped;
            Object.keys(group).forEach(key => {
                if (group[key].length === 0) group[key] = [0];
            });

            const { data, status } = await axios.get(
                '/domaingroup/db/event/count/key',
                {
                    params: {
                        group: JSON.stringify(group),
                        stime: start.valueOf(),
                        etime: end.valueOf(),
                        otype:
                            resourceType === 'business'
                                ? OTypeDef.BUSINESS
                                : OTypeDef.SYSTEM,
                        errorTypes: eventTypes
                            .map(e => e.data.value)
                            .filter(e => e >= 0),
                        eventLevelList: eventLevels.map(e => e.data.value),
                        includeMetricEvent,
                        includeMetricCompareEvent,
                        // filterByShowAlertFlag: filterByShowAlertFlag,
                        // sendExternalNotificationFlag: sendExternalNotificationFlag,
                        intervalInMinute,
                        checkZeroCount,
                    },
                }
            );
            if (status === 200) {
                dispatch('fetchCountData', { session: data });
                // countTable.reset();
            }
        } else {
            const {
                resourceType,
                gatheringInterval,
                time,
                showStartTime,
            } = state.filters;
            const { data, status } = await axios.get(
                '/domaingroup/db/event/count/data',
                {
                    params: {
                        session,
                        otype:
                            resourceType === 'business'
                                ? OTypeDef.BUSINESS
                                : OTypeDef.SYSTEM,
                    },
                }
            );
            if (status === 200) {
                const { progress, partialData, hasNext } = data;
                commit('updateProgress', progress);

                partialData.forEach(d => {
                    const { errorTypeName, mxidName } = d;

                    let errorTypeNameWithUnit = errorTypeName;
                    if (mxidName !== '')
                        errorTypeNameWithUnit +=
                            ' (' + i18n.get(`ui.mx.${mxidName}`) + ')';
                    list.push({
                        ...d,
                        nameWithDomain:
                            resourceType === 'domain'
                                ? d.domainName
                                : `${d.name} (${d.domainName})`,
                        timeConverted: convertTimeText(
                            d.time,
                            time.end.valueOf(),
                            gatheringInterval,
                            showStartTime
                        ),
                        errorTypeNameWithUnit,
                    });
                });
                commit('updateTableData', list);

                if (hasNext) {
                    dispatch('fetchCountData', { session, list });
                } else {
                    commit('updateTableData', list);
                    commit('updateProgress', 1);
                }
            }
        }
    },
};
