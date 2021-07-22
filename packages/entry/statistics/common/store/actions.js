import axios from '@library/axios';
import { ErrorTypeDef } from '@common/definition';

export const actions = {
    async fetchPeakTimeDataInDaily({ state, getters, commit }) {
        const url = '/statistic/dailySystem/peaktime';
        const args = {
            format: 'json',
            sid: state.domainId,
            peakTimeType: getters.searchCondition.metricByPeakTimeCondition,
            date: getters.searchTimeInDaily.startDate,
            startTimeInDay: getters.searchCondition.startTimeInDay,
            endTimeInDay: getters.searchCondition.endTimeInDay,
        };

        const { data } = await axios.get(url, { params: args });
        commit('setPeakData', data);
    },
    async fetchTotalDataInDaily({ state, getters, commit }, isBiz = false) {
        const url = '/statistic/dailySystem/total';
        const args = {
            format: 'json',
            sid: state.domainId,
            date: getters.searchTimeInDaily.startDate,
            startTimeInDay: getters.searchCondition.startTimeInDay,
            endTimeInDay: getters.searchCondition.endTimeInDay,
            oidList: getters.searchCondition.oids,
            peaktime: getters.peakData.time,
            isBiz,
        };

        const { data } = await axios.get(url, { params: args });
        commit('setTotalData', data);
    },
    async fetchSummaryDataInDaily({ state, getters, commit }, isBiz = false) {
        const url = '/statistic/dailySystem/summary';
        const args = {
            format: 'json',
            sid: state.domainId,
            date: getters.searchTimeInDaily.startDate,
            startTimeInDay: getters.searchCondition.startTimeInDay,
            endTimeInDay: getters.searchCondition.endTimeInDay,
            oidList: getters.searchCondition.oids,
            peaktime: getters.peakData.time,
            isBiz,
        };

        const { data } = await axios.get(url, { params: args });
        commit('setSummaryData', data);
    },
    async fetchDetailChartDataInDaily(
        { state, getters, commit },
        isBiz = false
    ) {
        const metrics5min = state.detailConditionByTarget.viewMetricsArray
            .filter(object => object.type === 'line')
            .map(object => object.mxid);
        const metrics60min = state.detailConditionByTarget.viewMetricsArray
            .filter(object => object.type === 'column')
            .map(object => object.mxid);

        const url = '/statistic/dailySystem/detail';
        const args = {
            format: 'json',
            sid: state.domainId,
            date: getters.searchTimeInDaily.startDate,
            startTimeInDay: getters.searchCondition.startTimeInDay,
            endTimeInDay: getters.searchCondition.endTimeInDay,
            oidList: getters.searchCondition.oids,
            mxidList_fiveMin: metrics5min,
            mxidList_oneHour: metrics60min,
            isBiz,
            isTable: false,
        };

        const { data } = await axios.get(url, { params: args });
        commit('setDetailChartData', data);
    },
    async fetchDetailTableDataInDaily(
        { state, getters, commit },
        isBiz = false
    ) {
        const metrics5min = state.detailConditionByTarget.viewMetricsArray
            .filter(object => object.type === 'line')
            .map(object => object.mxid);
        const metrics60min = state.detailConditionByTarget.viewMetricsArray
            .filter(object => object.type === 'column')
            .map(object => object.mxid);

        const url = '/statistic/dailySystem/detail';
        const args = {
            format: 'json',
            sid: state.domainId,
            date: getters.searchTimeInDaily.startDate,
            startTimeInDay: getters.searchCondition.startTimeInDay,
            endTimeInDay: getters.searchCondition.endTimeInDay,
            oidList: getters.searchCondition.oids,
            mxidList_fiveMin: metrics5min,
            mxidList_oneHour: metrics60min,
            isBiz,
            isTable: true,
        };

        const { data } = await axios.get(url, { params: args });
        commit('setDetailTableData', data);
    },
    async fetchErrorCountFromSessionInDaily(_, { session, otype }) {
        const url = '/domaingroup/db/error/count/data';
        const args = {
            otype,
            session,
            checkZeroCount: false,
        };
        return await axios.get(url, { params: args });
    },
    async fetchErrorCountInDaily({ state, getters, commit, dispatch }, otype) {
        commit('clearErrorData');
        commit('updateProgressForErrorData');

        const domainGroup = {};
        domainGroup[state.domainId] = getters.searchCondition.oids;

        const url = '/domaingroup/db/error/count/key';
        const args = {
            group: JSON.stringify(domainGroup),
            stime: getters.searchTimeInDaily.startTime,
            etime: getters.searchTimeInDaily.endTime,
            otype,
            errorTypes: Object.values(ErrorTypeDef),
            intervalInMinute:
                (getters.searchCondition.endTimeInDay -
                    getters.searchCondition.startTimeInDay) /
                1000,
        };
        const headers = {
            'Content-Type': 'text/html',
            accept: 'text/html',
        };

        const response = await axios.get(url, {
            headers: headers,
            params: args,
        });
        // FIXME response.data 값이 Number로 자동 변환되서 사용할수 없다.
        const sessionKey = response.request.responseText;

        let hasNext = true;
        while (hasNext) {
            if (!state.loading) {
                commit('clearErrorData');
                commit('updateProgressForErrorData', 1);
                break;
            }
            const errorCountData = await dispatch(
                'fetchErrorCountFromSessionInDaily',
                { session: sessionKey, otype }
            );

            commit('appendErrorData', errorCountData.data.partialData);
            hasNext = errorCountData.data.hasNext;
            commit('updateProgressForErrorData', errorCountData.data.progress);
        }
    },

    async fetchPeakTimeDataInMonthly({ state, getters, commit }) {
        const url = '/statistic/monthlySystem/peakday';
        const args = {
            format: 'json',
            sid: state.domainId,
            peakTimeType: getters.searchCondition.metricByPeakTimeCondition,
            sdate: getters.searchTimeInMonthly.startDate,
            edate: getters.searchTimeInMonthly.endDate,
            startTimeInDay: getters.searchCondition.startTimeInDay,
            endTimeInDay: getters.searchCondition.endTimeInDay,
        };

        const { data } = await axios.get(url, { params: args });
        commit('setPeakData', data);
    },
    async fetchTotalDataInMonthly({ state, getters, commit }, isBiz = false) {
        const url = '/statistic/monthlySystem/total';
        const args = {
            format: 'json',
            sid: state.domainId,
            sdate: getters.searchTimeInMonthly.startDate,
            edate: getters.searchTimeInMonthly.endDate,
            startTimeInDay: getters.searchCondition.startTimeInDay,
            endTimeInDay: getters.searchCondition.endTimeInDay,
            oidList: getters.searchCondition.oids,
            peaktime: getters.peakData.time,
            isBiz,
        };

        const { data } = await axios.get(url, { params: args });
        commit('setTotalDataListInMonth', data);
    },
    async fetchSummaryDataInMonthly({ state, getters, commit }, isBiz = false) {
        const url = '/statistic/monthlySystem/summary';
        const args = {
            format: 'json',
            sid: state.domainId,
            peakday: getters.peakHourOrDay,
            sdate: getters.searchTimeInMonthly.startDate,
            edate: getters.searchTimeInMonthly.endDate,
            startTimeInDay: getters.searchCondition.startTimeInDay,
            endTimeInDay: getters.searchCondition.endTimeInDay,
            oidList: getters.searchCondition.oids,
            peaktime: getters.peakData.time,
            isBiz,
        };

        const { data } = await axios.get(url, { params: args });
        commit('setSummaryDataInMonthly', data);
    },
    async fetchDetailTableDataInMonthly(
        { state, getters, commit },
        isBiz = false
    ) {
        const mxidList = state.detailConditionByTarget.viewMetricsArray.map(
            object => object.mxid
        );
        const url = '/statistic/monthlySystem/detail';
        const args = {
            format: 'json',
            sid: state.domainId,
            sdate: getters.searchTimeInMonthly.startDate,
            edate: getters.searchTimeInMonthly.endDate,
            startTimeInDay: getters.searchCondition.startTimeInDay,
            endTimeInDay: getters.searchCondition.endTimeInDay,
            oidList: getters.searchCondition.oids,
            mxidList,
            isBiz,
        };

        if (mxidList.length > 0) {
            const res = await axios.get(url, { params: args });
            commit('setDetailData', res?.data);
        }
    },
    async fetchErrorCountFromSessionInMonthly(_, { session, otype }) {
        const url = '/domaingroup/db/error/count/data';
        const args = {
            otype,
            session,
            checkZeroCount: false,
        };
        return await axios.get(url, { params: args });
    },
    async fetchErrorCountInMonthly(
        { state, getters, commit, dispatch },
        otype
    ) {
        const domainGroup = {};
        domainGroup[state.domainId] = getters.searchCondition.oids;

        const url = '/domaingroup/db/error/count/key';
        const args = {
            group: JSON.stringify(domainGroup),
            stime: getters.searchTimeInMonthly.startTime,
            etime: getters.searchTimeInMonthly.endTime,
            otype,
            errorTypes: Object.values(ErrorTypeDef),
            intervalInMinute:
                (getters.searchTimeInMonthly.endTime -
                    getters.searchTimeInMonthly.startTime) /
                1000,
        };
        const headers = {
            'Content-Type': 'text/html',
            accept: 'text/html',
        };

        commit('clearErrorData');
        commit('updateProgressForErrorData');

        const response = await axios.get(url, { headers, params: args });
        //FIXME response.data 값이 Number로 자동 변환되서 사용할수 없다.
        const sessionKey = response.request.responseText;

        let hasNext = true;
        while (hasNext) {
            if (!state.loading) {
                commit('clearErrorData');
                commit('updateProgressForErrorData', 1);
                break;
            }

            const errorCountData = await dispatch(
                'fetchErrorCountFromSessionInMonthly',
                { session: sessionKey, otype }
            );

            commit('appendErrorData', errorCountData.data.partialData);
            hasNext = errorCountData.data.hasNext;
            commit('updateProgressForErrorData', errorCountData.data.progress);
        }
    },

    async fetchPeakTimeDataInPeriod({ state, getters, commit }) {
        const url = '/statistic/monthlySystem/peakday';
        const args = {
            format: 'json',
            sid: state.domainId,
            peakTimeType: getters.searchCondition.metricByPeakTimeCondition,
            sdate: getters.searchTimeInPeriod.startDate,
            edate: getters.searchTimeInPeriod.endDate,
            startTimeInDay: getters.searchCondition.startTimeInDay,
            endTimeInDay: getters.searchCondition.endTimeInDay,
        };

        const { data } = await axios.get(url, { params: args });
        commit('setPeakData', data);
    },
    async fetchTotalDataInPeriod({ state, getters, commit }, isBiz = false) {
        const url = '/statistic/monthlySystem/total';
        const args = {
            format: 'json',
            sid: state.domainId,
            sdate: getters.searchTimeInPeriod.startDate,
            edate: getters.searchTimeInPeriod.endDate,
            startTimeInDay: getters.searchCondition.startTimeInDay,
            endTimeInDay: getters.searchCondition.endTimeInDay,
            oidList: getters.searchCondition.oids,
            peaktime: getters.peakData.time,
            isBiz,
        };

        const { data } = await axios.get(url, { params: args });
        commit('setTotalDataListInMonth', data);
    },
    async fetchSummaryDataInPeriod({ state, getters, commit }, isBiz = false) {
        const url = '/statistic/monthlySystem/summary';
        const args = {
            format: 'json',
            sid: state.domainId,
            peakday: getters.peakHourOrDay,
            sdate: getters.searchTimeInPeriod.startDate,
            edate: getters.searchTimeInPeriod.endDate,
            startTimeInDay: getters.searchCondition.startTimeInDay,
            endTimeInDay: getters.searchCondition.endTimeInDay,
            oidList: getters.searchCondition.oids,
            peaktime: getters.peakData.time,
            isBiz,
        };

        const { data } = await axios.get(url, { params: args });
        commit('setSummaryDataInMonthly', data);
    },
    async fetchDetailTableDataInPeriod(
        { state, getters, commit },
        isBiz = false
    ) {
        const mxidList = state.detailConditionByTarget.viewMetricsArray.map(
            object => object.mxid
        );

        const url = '/statistic/monthlySystem/detail';
        const args = {
            format: 'json',
            sid: state.domainId,
            sdate: getters.searchTimeInPeriod.startDate,
            edate: getters.searchTimeInPeriod.endDate,
            startTimeInDay: getters.searchCondition.startTimeInDay,
            endTimeInDay: getters.searchCondition.endTimeInDay,
            oidList: getters.searchCondition.oids,
            mxidList,
            isBiz,
        };

        if (mxidList.length > 0) {
            const res = await axios.get(url, { params: args });
            commit('setDetailData', res?.data);
        }
    },
    async fetchErrorCountFromSessionInPeriod(_, { session, otype }) {
        const url = '/domaingroup/db/error/count/data';
        const args = {
            otype,
            session,
            checkZeroCount: false,
        };
        return await axios.get(url, { params: args });
    },
    async fetchErrorCountInPeriod({ state, getters, commit, dispatch }, otype) {
        const domainGroup = {};
        domainGroup[state.domainId] = getters.searchCondition.oids;

        const url = '/domaingroup/db/error/count/key';
        const args = {
            group: JSON.stringify(domainGroup),
            stime: getters.searchTimeInPeriod.startTime,
            etime: getters.searchTimeInPeriod.endTime,
            otype,
            errorTypes: Object.values(ErrorTypeDef),
            intervalInMinute:
                (getters.searchTimeInPeriod.endTime -
                    getters.searchTimeInPeriod.startTime) /
                1000,
        };
        const headers = {
            'Content-Type': 'text/html',
            accept: 'text/html',
        };

        commit('clearErrorData');
        commit('updateProgressForErrorData');

        const res = await axios.get(url, { headers: headers, params: args });
        // FIXME response.data 값이 Number로 자동 변환되서 사용할수 없다.
        const sessionKey = res.request.responseText;

        let hasNext = true;
        while (hasNext) {
            if (!state.loading) {
                commit('clearErrorData');
                commit('updateProgressForErrorData', 1);
                break;
            }

            const errorCountData = await dispatch(
                'fetchErrorCountFromSessionInPeriod',
                { session: sessionKey, otype }
            );

            commit('appendErrorData', errorCountData.data.partialData);
            hasNext = errorCountData.data.hasNext;
            commit('updateProgressForErrorData', errorCountData.data.progress);
        }
    },
};
