import { getDayjs } from '@common/base';
import { startOfDayjs, endOfDayjs } from '@common/dayjsWrapper';
import { MxDef, OTypeDef } from '@common/definition';
import { TABLE_COLUMNS, EXPAND_TABLE_COLUMNS } from '../constant';
import { initializeColumn, createRowTemplate } from '../utility';

const now = getDayjs();
const start = startOfDayjs(now.clone(), 'month');
const end = endOfDayjs(now.clone(), 'month');
const defColumns = TABLE_COLUMNS['application'].map(col =>
    initializeColumn(col)
);
const expandDefColumns = EXPAND_TABLE_COLUMNS['service'].map(col =>
    initializeColumn(col)
);

export default {
    headerFold: false,

    domainIds: [],
    instanceData: [],
    businessData: [],
    otype: OTypeDef.SYSTEM,
    oidMap: {},

    // 월단위 또는 기간 타입
    searchRangeType: 'monthly', // or period
    // 일단위 차트만 보이고, 시간당 차트는 숨김 (-1이면 전체)
    activeDailyChartIndex: now.date() - 1,

    // 일간/시간당 차트, Metrics
    dailyChartMetrics: MxDef.service_count,
    dailyChartInterval: 1440, // 현재는 고정, 썸머타임을 고려해야 할 수도 있음
    hourlyChartMetrics: MxDef.service_count,
    hourlyChartInterval: 60, // or 5

    // 월단위 조회 범위 (일단위 차트)
    startDateForMonthly: start.clone(),
    endDateForMonthly: end.clone(),
    // 기간 조회 범위 (일단위 차트)
    startDateForPeriod: start.clone(),
    endDateForPeriod: end.clone(),

    // 하단 테이블을 위한 조회 범위
    // 변경 조건 : 일단위 차트 전체, 일단위 차트 하루, 시간당 차트 시간
    startDateForTable: startOfDayjs(now.clone(), 'day'), // or null
    endDateForTable: endOfDayjs(now.clone(), 'day'),

    // 차트 데이터
    dailyChartRows: [],
    hourlyChartRows: [],

    // 테이블 데이터 타입 (탭)
    tableType: 'application', // or sql, externalCall, error, cics
    tableColumns: defColumns,
    tableRowTemplate: createRowTemplate(defColumns),
    tableRows: [],
    tableWidth: 800,
    tableHeight: 600,
    tableProgress: 0,

    // 차트 로딩
    dailyChartLoading: false,
    hourlyChartLoading: false,

    // 최초 로드 체크
    isLoadedFirstData: false,

    // -------------------------------------
    // 확장 윈도우 관련 데이터
    // -------------------------------------

    expandName: '',
    expandHash: -1,
    expandPosition: {
        left: 0,
        top: 0,
    },

    expandDailyChartProgress: 0,
    expandHourlyChartProgress: 0,
    expandTableProgress: 0,

    expandDailyChartRows: [],
    expandHourlyChartRows: [],
    expandActiveDailyChartIndex: now.date() - 1,

    expandTableColumns: expandDefColumns,
    expandTableRowTemplate: createRowTemplate(expandDefColumns),
    expandTableRows: [],

    expandStartDateForTable: startOfDayjs(now.clone(), 'day'), // or null
    expandEndDateForTable: endOfDayjs(now.clone(), 'day'),
};
