import { getDayjs } from '@common/base';
import { startOfDayjs } from '@common/dayjsWrapper';

export const state = {
    domainId: undefined,
    domainName: undefined,
    instanceList: [],
    searchCondition: {
        checkedTargetList: [],
        operateStartHour: 0,
        operateEndHour: 24,

        //MxDef 키값
        metricByPeakTimeCondition: 'service_count',

        //instance or business
        isBusiness: false,
    },

    searchTimeInDaily: {
        time: startOfDayjs(getDayjs(), 'date').valueOf(),
    },

    searchTimeInPeriod: {
        startTime: startOfDayjs(getDayjs(), 'date')
            .subtract(6, 'day')
            .valueOf(),
        endTime: startOfDayjs(getDayjs(), 'date').valueOf(),
    },

    searchTimeInMonthly: {
        year: getDayjs().year(),
        month: getDayjs().month(),
    },

    detailConditionByTarget: {
        viewTable: true,
        viewChart: false,
        viewMetricsArray: [],
    },
    totalData: {
        today: {
            concurrent_user: 0,
            event_count: 0,
            error_count: 0,
            max_tps: 0,
            service_count: 0,
            service_rate: 0,
            service_time: 0,
            visit_day: 0,
        },

        total: [
            {
                concurrent_user: 0,
                event_count: 0,
                error_count: 0,
                max_tps: 0,
                service_count: 0,
                service_rate: 0,
                service_time: 0,
                visit_day: 0,
                time: 0,
            },
            {
                concurrent_user: 0,
                event_count: 0,
                error_count: 0,
                max_tps: 0,
                service_count: 0,
                service_rate: 0,
                service_time: 0,
                visit_day: 0,
                time: 0,
            },
            {
                concurrent_user: 0,
                event_count: 0,
                error_count: 0,
                max_tps: 0,
                service_count: 0,
                service_rate: 0,
                service_time: 0,
                visit_day: 0,
                time: 0,
            },
        ],

        chartHour: [],
        chart5Min: [],
    },

    totalDataListInMonth: [
        {
            service_time: 0,
            event_count: 0,
            service_count: 0,
            visit_day: 0,
            max_tps: 0,
            concurrent_user: 0,
            error_count: 0,
            total_visit_day: 0,
            total_service_count: 0,
            service_rate: 0,
        },
        {
            service_time: 0,
            event_count: 0,
            service_count: 0,
            visit_day: 0,
            max_tps: 0,
            concurrent_user: 0,
            error_count: 0,
            total_visit_day: 0,
            total_service_count: 0,
            service_rate: 0,
        },
    ],

    peakData: {
        concurrent_user: 0,
        date: 0,
        event_count: 0,
        instance_event_count: 0,
        max_tps: 0,
        service_count: 0,
        service_rate: 0,
        service_time: 0,
        time: 0,
        visit_hour: 0,

        //-- 월간 peakData는 daily, operation, 그리고 peakDay 조건 (호출건수, 일일 방문자)로 데이터를 저장한다.
        daily: {
            service_count: {
                concurrent_user: 0,
                date: 0,
                event_count: 0,
                instance_event_count: 0,
                max_tps: 0,
                service_count: 0,
                service_rate: 0,
                service_time: 0,
                time: 0,
                visit_day: 0,
            },
            visit_hour: {
                concurrent_user: 0,
                date: 0,
                event_count: 0,
                instance_event_count: 0,
                max_tps: 0,
                service_count: 0,
                service_rate: 0,
                service_time: 0,
                time: 0,
                visit_day: 0,
            },
            visit_day: {
                concurrent_user: 0,
                date: 0,
                event_count: 0,
                instance_event_count: 0,
                max_tps: 0,
                service_count: 0,
                service_rate: 0,
                service_time: 0,
                time: 0,
                visit_day: 0,
            },
        },
        operation: {
            service_count: {
                concurrent_user: 0,
                date: 0,
                event_count: 0,
                instance_event_count: 0,
                max_tps: 0,
                service_count: 0,
                service_rate: 0,
                service_time: 0,
                time: 0,
                visit_day: 0,
            },
            visit_hour: {
                concurrent_user: 0,
                date: 0,
                event_count: 0,
                instance_event_count: 0,
                max_tps: 0,
                service_count: 0,
                service_rate: 0,
                service_time: 0,
                time: 0,
                visit_day: 0,
            },
            visit_day: {
                concurrent_user: 0,
                date: 0,
                event_count: 0,
                instance_event_count: 0,
                max_tps: 0,
                service_count: 0,
                service_rate: 0,
                service_time: 0,
                time: 0,
                visit_day: 0,
            },
        },
        //-- 월간 끝
    },

    summaryData: {
        operateTime: [],
        peakTime: [],
    },

    summaryDataInMonthly: {
        chart: [],
        peakday: [],
    },

    detailData: {
        table: {
            five_min: [],
            one_hour: [],
        },
        chart: {
            five_min: [],
            one_hour: [],
        },
        one_day: [],
    },

    errorData: [],

    loading: false,
    progressForErrorData: 1,
};
