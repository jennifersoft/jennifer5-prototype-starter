import { getDayjsUseFullYear } from '@common/base';
import { endOfDayjs, startOfDayjs } from '@common/dayjsWrapper';
import { printEscape } from '@common/utility';
import { ServiceDBTypeDef, OTypeDef } from '@common/definition';
import { getItem } from '@entry/popup/xviewAnalysis/storage';
import {
    TABLE_COLUMNS,
    EXPAND_TABLE_COLUMNS,
    EXPAND_WINDOW_SIZE,
    FIVE_MINUTE_INTERVAL_METRICS,
    STORAGE_KEYS,
} from '../constant';

import {
    createRowTemplate,
    initializeColumn,
    createExpandColumnChartData,
} from '../utility';

export default {
    toggleHeaderFold(state) {
        state.headerFold = !state.headerFold;
        state.tableHeight =
            window.innerHeight - 560 + (state.headerFold ? 330 : 0);
    },
    resizePage(state) {
        // 새로운 레이아웃 메뉴 넓이 + 컨텐츠 영역 패딩 넓이
        state.tableWidth = window.innerWidth - 120;
        state.tableHeight =
            window.innerHeight - 566 + (state.headerFold ? 330 : 0);
        state.expandPosition = {
            left: window.innerWidth / 2 - EXPAND_WINDOW_SIZE.width / 2 + 40,
            top: window.innerHeight / 2 - EXPAND_WINDOW_SIZE.height / 2,
        };
    },

    updateDomainIds(state, domainIds) {
        state.domainIds = domainIds;
    },
    updateOidMap(state, oidMap) {
        state.oidMap = oidMap;
    },
    updateInstanceData(state, data) {
        state.instanceData = data;
    },
    updateBusinessData(state, data) {
        state.businessData = data;
    },
    changeResourceType(state, type) {
        state.otype = type === 'business' ? OTypeDef.BUSINESS : OTypeDef.SYSTEM;
    },

    // 검색 조회 타입 설정 : 월간 or 기간
    changeSearchRangeType(state, type) {
        state.searchRangeType = type;
    },
    updateSearchDatesForMonthly(state, date) {
        state.startDateForMonthly = startOfDayjs(date.clone(), 'month');
        state.endDateForMonthly = endOfDayjs(date.clone(), 'month');
    },
    updateSearchDatesForPeriod(state, payload) {
        state.startDateForPeriod = startOfDayjs(
            payload.startDate.clone(),
            'day'
        );
        state.endDateForPeriod = endOfDayjs(payload.endDate.clone(), 'day');
    },

    // 최초 데이터 로드 체크하기
    initLoadedFirstData(state) {
        state.isLoadedFirstData = true;
    },

    // 일간/시간당 차트 데이터 조회를 위한 값들
    updateChartDataMetrics(state, payload) {
        state.dailyChartMetrics = payload.daily;
        // state.dailyChartInterval = 1440;
        state.hourlyChartMetrics = payload.hourly;
        state.hourlyChartInterval = FIVE_MINUTE_INTERVAL_METRICS.includes(
            payload.hourly
        )
            ? 5
            : 60;
    },

    changeActiveDailyChartIndex(state, index) {
        state.activeDailyChartIndex = index;

        if (index === -1) {
            if (state.searchRangeType === 'monthly') {
                state.startDateForTable = state.startDateForMonthly.clone();
                state.endDateForTable = state.endDateForMonthly.clone();
            } else {
                state.startDateForTable = state.startDateForPeriod.clone();
                state.endDateForTable = state.endDateForPeriod.clone();
            }
        } else {
            const row = state.dailyChartRows[index];
            state.startDateForTable = row.date.clone();
            state.endDateForTable = endOfDayjs(row.date.clone(), 'day');
        }
    },
    changeActiveHourlyChartIndex(state, index) {
        const row = state.dailyChartRows[state.activeDailyChartIndex];

        if (index === -1) {
            state.startDateForTable = row.date.clone();
            state.endDateForTable = endOfDayjs(row.date.clone(), 'day');
        } else {
            const startDate = row.date.clone().add(index, 'hour');
            state.startDateForTable = startDate;
            state.endDateForTable = startDate
                .clone()
                .add(1, 'hour')
                .subtract(1, 'millisecond');
        }
    },

    updateDailyChartRows(state, payload) {
        state.dailyChartRows = payload.rows.map((value, index) => {
            return {
                date: startOfDayjs(
                    payload.date.add(index, 'day').clone(),
                    'day'
                ),
                value,
            };
        });
    },
    updateHourlyChartRows(state, payload) {
        const interval = state.hourlyChartInterval;

        state.hourlyChartRows = payload.rows.map((value, index) => {
            if (interval === 5) {
                const date = payload.date
                    .add(index * interval, 'minute')
                    .clone();
                return {
                    date: date,
                    time: date.valueOf(),
                    value,
                };
            }

            return {
                date: index,
                value,
            };
        });
    },

    changeTableType(state, type) {
        let columns = TABLE_COLUMNS[type].map(col => initializeColumn(col));
        let expandColumns = EXPAND_TABLE_COLUMNS[
            type === 'error' ? type : 'service'
        ].map(col => initializeColumn(col));

        // 테이블 타입 변경시 로컬 스토리지에서 컬럼 상태 가져오기 (application or cics)
        if (STORAGE_KEYS[type]) {
            const status = getItem(
                STORAGE_KEYS[type],
                columns.map(col => `${!col.isHide}`),
                Array
            );
            columns = columns.map((col, i) => {
                return {
                    ...col,
                    isHide: status[i] === 'false',
                };
            });
        }

        state.tableType = type;
        state.tableColumns = columns;
        state.tableRowTemplate = createRowTemplate(columns);
        state.tableRows = [];

        state.expandTableColumns = expandColumns;
        state.expandTableRowTemplate = createRowTemplate(expandColumns);
        state.expandTableRows = [];
    },
    updateTableColumns(state, status) {
        state.tableColumns = state.tableColumns.map((col, i) => {
            return {
                ...col,
                isHide: !status[i],
            };
        });
        state.tableRowTemplate = createRowTemplate(state.tableColumns);
    },
    updateTableRows(state, rows) {
        // cics만 다르게 구현을 했었네 ㅠㅠ
        const sortKey = state.tableType === 'cics' ? 'callCount' : 'count';

        const totalCount = rows.reduce((prev, next) => {
            return prev + next[sortKey];
        }, 0);

        state.tableRows = rows
            .sort((a, b) => b[sortKey] - a[sortKey])
            .map((row, i) => {
                const origin = row.name;
                return {
                    ...row,
                    no: i + 1,
                    name: printEscape(origin),
                    origin: origin,
                    rate: ((row.count / totalCount) * 100).toFixed(1),
                };
            });
    },

    updateTableProgress(state, progress) {
        state.tableProgress = progress;
    },
    toggleDailyChartLoading(state, active) {
        state.dailyChartLoading = active;
    },
    toggleHourlyChartLoading(state, active) {
        state.hourlyChartLoading = active;
    },

    // -------------------------------------
    // 확장 윈도우 관련 데이터
    // -------------------------------------

    showExpandWindow(state, payload) {
        // ARIES-9846 : 이름이 공백이면 해쉬는 0이라고 @sam이 알려줌
        state.expandName = payload.name;
        state.expandHash = payload.name === '' ? 0 : payload.hash;
    },
    updateExpandChartRows(state, payload) {
        const newRows = payload.rows.map(row => {
            const year = parseInt(row.name.substr(0, 4));
            const month = parseInt(row.name.substr(4, 2));
            const day = parseInt(row.name.substr(6, 2));
            const hour =
                payload.gtype === 'DAY' ? -1 : parseInt(row.name.substr(8, 2));
            const date = getDayjsUseFullYear(year, month - 1, day);

            return {
                ...row,
                date: payload.gtype === 'DAY' ? date : hour,
            };
        });

        if (payload.gtype === 'DAY') {
            const isMonthly = state.searchRangeType === 'monthly';

            state.expandDailyChartRows = createExpandColumnChartData(
                isMonthly
                    ? state.startDateForMonthly
                    : state.startDateForPeriod,
                isMonthly ? state.endDateForMonthly : state.endDateForPeriod,
                newRows
            );

            // ARIES-10187 : 테이블 로우 선택시 일간 차트 초기값 설정하는 로직 개선
            state.expandDailyChartRows.forEach((row, i) => {
                if (
                    row.date.format('MMDD') ===
                    state.startDateForTable.format('MMDD')
                )
                    state.expandActiveDailyChartIndex = i;
            });
        } else {
            // JJC-4195 : ERROR 탭 일때, 예외 처리 (중간에 값이 비어있을 수 있음)
            if (state.tableType === 'error' && newRows.length > 0) {
                const dataMap = {};

                newRows.forEach(row => {
                    dataMap[row.date] = row.count;
                });

                state.expandHourlyChartRows = Array(24)
                    .fill(0)
                    .map((v, i) => {
                        return {
                            date: i,
                            count: dataMap[i] > 0 ? dataMap[i] : v,
                        };
                    });
            } else {
                state.expandHourlyChartRows = newRows;
            }
        }
    },
    updateExpandTableRows(state, rows) {
        const sortKey = state.tableType === 'error' ? 'rate' : 'count';

        state.expandTableRows = rows
            .map(row => {
                let type = 'ERROR';
                let rate = 100;

                if (state.tableType !== 'error')
                    type = Object.keys(ServiceDBTypeDef)[row.type - 1];
                else rate = row.occurRate.toFixed(1);

                return {
                    ...row,
                    type,
                    rate,
                };
            })
            .sort((a, b) => b[sortKey] - a[sortKey])
            .map((row, i) => {
                return {
                    ...row,
                    no: i + 1,
                };
            });
    },
    updateExpandChartProgress(state, payload) {
        if (payload.gtype === 'DAY')
            state.expandDailyChartProgress = payload.progress;
        else state.expandHourlyChartProgress = payload.progress;
    },
    updateExpandTableProgress(state, progress) {
        state.expandTableProgress = progress;
    },

    changeExpandActiveDailyChartIndex(state, index) {
        state.expandActiveDailyChartIndex = index;

        if (index === -1) {
            if (state.searchRangeType === 'monthly') {
                state.expandStartDateForTable = state.startDateForMonthly.clone();
                state.expandEndDateForTable = state.endDateForMonthly.clone();
            } else {
                state.expandStartDateForTable = state.startDateForPeriod.clone();
                state.expandEndDateForTable = state.endDateForPeriod.clone();
            }
        } else {
            const row = state.expandDailyChartRows[index];
            state.expandStartDateForTable = row.date.clone();
            state.expandEndDateForTable = endOfDayjs(row.date.clone(), 'day');
        }
    },
    changeExpandActiveHourlyChartIndex(state, index) {
        const row =
            state.expandDailyChartRows[state.expandActiveDailyChartIndex];

        if (index === -1) {
            state.expandStartDateForTable = row.date.clone();
            state.expandEndDateForTable = endOfDayjs(row.date.clone(), 'day');
        } else {
            const startDate = row.date.clone().add(index, 'hour');
            state.expandStartDateForTable = startDate;
            state.expandEndDateForTable = startDate
                .clone()
                .add(1, 'hour')
                .subtract(1, 'millisecond');
        }
    },
};
