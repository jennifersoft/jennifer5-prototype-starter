import { getDayjs, getDayjsUseFullYear, serverDateFormat } from '@common/base';

export const getters = {
    searchCondition: state => {
        return {
            ...state.searchCondition,
            startTimeInDay:
                state.searchCondition.operateStartHour * 60 * 60 * 1000,
            endTimeInDay: state.searchCondition.operateEndHour * 60 * 60 * 1000,
            operateTime:
                state.searchCondition.operateStartHour +
                ':00 ~ ' +
                state.searchCondition.operateEndHour +
                ':00',
            oids: state.searchCondition.checkedTargetList.map(
                target => target.oid
            ),
            names: state.searchCondition.checkedTargetList.map(
                target => target.label
            ),
        };
    },

    searchTimeInDaily: state => {
        return {
            startTime:
                state.searchTimeInDaily.time +
                state.searchCondition.operateStartHour * 60 * 60 * 1000,
            endTime:
                state.searchTimeInDaily.time +
                state.searchCondition.operateEndHour * 60 * 60 * 1000,
            startDate: getDayjs(state.searchTimeInDaily.time).format(
                'YYYYMMDD'
            ),
            endDate: getDayjs(state.searchTimeInDaily.time).format('YYYYMMDD'),
            dateInFormat: getDayjs(state.searchTimeInDaily.time).format(
                serverDateFormat.short
            ),
            startDateAndEndDate: [
                getDayjs(
                    state.searchTimeInDaily.time +
                        state.searchCondition.operateStartHour * 60 * 60 * 1000
                ).toDate(),
                getDayjs(
                    state.searchTimeInDaily.time +
                        state.searchCondition.operateEndHour * 60 * 60 * 1000
                ).toDate(),
            ],
        };
    },

    searchTimeInMonthly: state => {
        return {
            startTime: getDayjsUseFullYear(
                state.searchTimeInMonthly.year,
                state.searchTimeInMonthly.month,
                1
            ).valueOf(),
            endTime: getDayjsUseFullYear(
                state.searchTimeInMonthly.year,
                state.searchTimeInMonthly.month,
                1
            )
                .add(1, 'month')
                .subtract(1, 'second')
                .valueOf(),
            startDate: getDayjsUseFullYear(
                state.searchTimeInMonthly.year,
                state.searchTimeInMonthly.month,
                1
            ).format('YYYYMMDD'),
            endDate: getDayjsUseFullYear(
                state.searchTimeInMonthly.year,
                state.searchTimeInMonthly.month,
                1
            )
                .add(1, 'month')
                .subtract(1, 'second')
                .format('YYYYMMDD'),
            dateInYYMM: getDayjsUseFullYear(
                state.searchTimeInMonthly.year,
                state.searchTimeInMonthly.month,
                1
            ).format('YYYY.MM'),
        };
    },

    //ajax로 조회시에는 다음날 00시 00분 00초까지 조회한다.
    searchTimeInPeriod: state => {
        return {
            startTime: state.searchTimeInPeriod.startTime,
            endTime: getDayjs(state.searchTimeInPeriod.endTime)
                .add(1, 'day')
                .valueOf(),
            startDate: getDayjs(state.searchTimeInPeriod.startTime).format(
                'YYYYMMDD'
            ),
            endDate: getDayjs(state.searchTimeInPeriod.endTime).format(
                'YYYYMMDD'
            ),
            startDateInFormat: getDayjs(
                state.searchTimeInPeriod.startTime
            ).format(serverDateFormat.short),
            endDateInFormat: getDayjs(state.searchTimeInPeriod.endTime).format(
                serverDateFormat.short
            ),
        };
    },

    peakData: state => {
        return {
            ...state.peakData,
            peakRangeString:
                state.peakData.time < 24
                    ? state.peakData.time +
                      ':00~' +
                      (state.peakData.time + 1) +
                      ':00'
                    : state.peakData.time + ':00',
        };
    },

    peakDayTimestamp: state => {
        const metricByPeakTimeCondition =
            state.searchCondition.metricByPeakTimeCondition;

        const operationPeakDataByMetrics =
            state.peakData.operation[metricByPeakTimeCondition];
        const dailyPeakDataByMetrics =
            state.peakData.daily[metricByPeakTimeCondition];

        return metricByPeakTimeCondition === 'visit_day'
            ? dailyPeakDataByMetrics.date
            : operationPeakDataByMetrics.date;
    },

    peakHourOrDay: (_, getters) => {
        return getDayjs(getters.peakDayTimestamp).format('YYYYMMDD');
    },

    totalData: state => {
        return {
            ...state.totalData,
            todayWithOperateTime: state.totalData.total[0],
            yesterdayWithOperateTime: state.totalData.total[1],
            lastweekdayWithOperateTime: state.totalData.total[2],
            selectMonth: state.totalData[0],
            selectLastMonth: state.totalData[1],
        };
    },

    totalDataListInMonth: state => {
        return state.totalDataListInMonth;
    },

    totalDataObjectInMonth: state => {
        return {
            searchMonth: state.totalDataListInMonth[0],
            prevMonth: state.totalDataListInMonth[1],
        };
    },

    summaryData: state => {
        return {
            ...state.summaryData,
        };
    },

    summaryDataInMonthly: state => {
        return {
            ...state.summaryDataInMonthly,
        };
    },

    detailData: state => {
        return {
            ...state.detailData,
        };
    },

    errorData: state => {
        return {
            ...state.errorData,
        };
    },
};
