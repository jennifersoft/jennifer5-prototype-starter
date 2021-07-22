import _ from '@library/lodash';
import axios from '@library/axios';
import Vue from 'vue';
import store from '@vuejs/vuex/store';
import CommonHeader from '@layout/container/header/CommonHeader';
import ToggleSwitch from '@vuejs/component/Toggle/ToggleSwitch';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import AlertWindow from '@vuejs/component/window/AlertWindow';
import ToolBar from './component/ToolBar';
import CountChart from './component/CountChart';
import RateChart from './component/RateChart';
import DetailTable from './component/DetailTable';
import i18nMessages from './i18n';
import { ariesuser, getDayjs, serverDateFormat } from '@common/base';
import { getChartTarget } from '@common/utility';
import { ErrorTypeDef, EventLevelDef, MxDef } from '@common/definition';
import { ClientUtilities } from '@common/legacy/ClientUtilities';
import '@layout/base';
import './index.scss';

new Vue({
    el: '#vue_app',
    store,
    provide: {
        theme: ariesuser.theme,
        i18n: i18nMessages,
    },
    components: {
        CommonHeader,
        ToggleSwitch,
        Dropdown,
        ToolBar,
        CountChart,
        RateChart,
        DetailTable,
        AlertWindow,
    },
    data: function() {
        return {
            chartFilterOptions: [
                {
                    active: true,
                    buttonColor: '#497eff',
                    color: 'rgba(73, 126, 255, 0.5)',
                    text: i18nMessages.normal,
                    value: EventLevelDef.NORMAL,
                },
                {
                    active: true,
                    buttonColor: '#ffdd00',
                    color: 'rgba(255, 221, 0, 0.5)',
                    text: i18nMessages.warning,
                    value: EventLevelDef.WARNING,
                },
                {
                    active: true,
                    buttonColor: '#ff384d',
                    color: 'rgba(250, 85, 89, 0.5)',
                    text: i18nMessages.fatal,
                    value: EventLevelDef.FATAL,
                },
            ],

            chartShowTypes: [
                { text: i18nMessages.dailyOverview, value: 'daily' },
                { text: i18nMessages.dailyDetailedView, value: 'hourly' },
            ],
            selectedChartType: 'daily',

            dailyChartNames: [],
            dailyChartLabels: [],
            dailyChartValues: [],
            dailyChartOriginValues: [],
            dailyChartMaxValue: 100,
            dailyChartActiveIndex: getDayjs().date() - 1,

            hourlyChartNames: [],
            hourlyChartLabels: [],
            hourlyChartValues: [],
            hourlyChartOriginValues: [],
            hourlyChartMaxValue: 100,
            hourlyChartActiveIndex: -1,

            detailDataList: [],
            detailProgress: 1,
            mainHeight: 300,
            isHeaderFold: false,
            isFilterDetailData: false,
            isActiveHourlyChart: false,
            resizeHandler: null,

            searchDateFormat: '',
            searchCondition: {},

            alertMessage: '',
        };
    },
    methods: {
        getEventTypes: function() {
            let list = [-1, -2];

            for (let key in ErrorTypeDef) {
                list.push(ErrorTypeDef[key]);
            }

            return list;
        },
        getStackChartLabels: function(stime, etime, interval) {
            const labels = [];

            if (interval == ClientUtilities.ONE_DAY) {
                let isOdd = false;
                for (let i = stime; i <= etime; i += interval) {
                    let date = getDayjs(i).format('MM-DD');
                    labels.push(isOdd ? '' : date);
                    isOdd = !isOdd;
                }
            } else if (interval == ClientUtilities.ONE_HOUR) {
                const count = (etime - stime) / interval;

                for (let i = 0; i <= count; i++) {
                    let date = i < 10 ? `0${i}` : `${i}`;
                    labels.push(i % 2 != 0 ? '' : date);
                }
            }

            return labels;
        },
        getStackMaxValue: function(values) {
            let maxValue = 0;

            for (let i = 0; i < values[0].length; i++) {
                let sum = 0;

                for (let j = 0; j < values.length; j++) {
                    sum += values[j][i];
                }

                maxValue = Math.max(maxValue, sum);
            }

            return getChartTarget(maxValue);
        },
        sumArrayElements: function(res) {
            const list = res.data.map(item => item.v2);

            if (list.length > 1) {
                for (let i = 1; i < list.length; i++) {
                    for (let j = 0; j < list[i].length; j++) {
                        list[0][j] += list[i][j];
                    }
                }
            }

            return list[0];
        },
        getDetailSearchTime: function(dateIndex = -1, hourIndex = -1) {
            if (dateIndex == -1) {
                return {
                    stime: this.searchCondition.stime,
                    etime: this.searchCondition.etime,
                };
            } else {
                let stime =
                    this.searchCondition.stime +
                    dateIndex * ClientUtilities.ONE_DAY;
                let etime = stime + ClientUtilities.ONE_DAY;

                if (hourIndex > -1) {
                    stime = stime + hourIndex * ClientUtilities.ONE_HOUR;
                    etime = stime + ClientUtilities.ONE_HOUR;
                }

                return {
                    stime: stime,
                    etime: etime,
                };
            }
        },
        updateStackChartData: function(stime, etime, interval) {
            const chartNames = this.chartFilterOptions.map(opt => opt.text);

            this.loadEventLevelData(stime, etime, interval, function(
                labels,
                values,
                maxValue
            ) {
                if (interval == ClientUtilities.ONE_HOUR) {
                    this.hourlyChartMaxValue = maxValue;
                    this.hourlyChartLabels = labels;
                    this.hourlyChartValues = values;
                    this.hourlyChartOriginValues = [...values];
                    this.hourlyChartNames = chartNames;
                } else if (interval == ClientUtilities.ONE_DAY) {
                    this.dailyChartMaxValue = maxValue;
                    this.dailyChartLabels = labels;
                    this.dailyChartValues = values;
                    this.dailyChartOriginValues = [...values];
                    this.dailyChartNames = chartNames;
                }
            });
        },

        // 서버 호출 관련 메소드
        loadEventLevelData: function(stime, etime, interval, callback) {
            const self = this;
            const url = '/domaingroup/db/metrics';
            const args = {
                group: this.searchCondition.group,
                otype: this.searchCondition.otype,
                stime: stime,
                etime: etime,
                interval: interval,
            };

            const normalFetch = axios
                .get(url, {
                    params: Object.assign(
                        { metrics: MxDef.event_normal_count },
                        args
                    ),
                })
                .then(this.sumArrayElements);

            const warningFetch = axios
                .get(url, {
                    params: Object.assign(
                        { metrics: MxDef.event_warning_count },
                        args
                    ),
                })
                .then(this.sumArrayElements);

            const fatalFetch = axios
                .get(url, {
                    params: Object.assign(
                        { metrics: MxDef.event_fatal_count },
                        args
                    ),
                })
                .then(this.sumArrayElements);

            axios
                .all([normalFetch, warningFetch, fatalFetch])
                .then(function(values) {
                    if (typeof callback == 'function') {
                        const labels = self.getStackChartLabels(
                            stime,
                            etime,
                            interval
                        );
                        const maxValue = self.getStackMaxValue(values);

                        callback.call(self, labels, values, maxValue);
                    }
                })
                .catch(function(err) {
                    console.log(err);
                });
        },
        loadEventDetailData: function(
            stime,
            etime,
            isHourly = false,
            session,
            data
        ) {
            const levels = this.chartFilterOptions
                .filter(opt => opt.active)
                .map(opt => opt.value);

            // JQA-358, EVENT 레벨 필터가 없을 경우, 테이블을 초기화한다.
            if (levels.length == 0) {
                this.detailDataList = [];
                this.isFilterDetailData = false;
                return;
            }

            // 테이블에 표시되는 날짜 문자열 출력
            const dateFormat = isHourly
                ? serverDateFormat.long
                : serverDateFormat.short;
            this.searchDateFormat = `${getDayjs(stime).format(
                dateFormat
            )} ~ ${getDayjs(etime).format(dateFormat)}`;

            if (!session) {
                setTimeout(() => {
                    this.detailProgress = 0;

                    axios
                        .get('/domaingroup/db/event/list/key', {
                            params: {
                                group: this.searchCondition.group,
                                otype: this.searchCondition.otype,
                                stime: stime,
                                etime: etime,
                                errorTypes: this.getEventTypes(),
                                eventLevelList: levels,
                                includeMetricEvent: true,
                                includeMetricCompareEvent: true,
                                filterByShowAlertFlag: false,
                                sendExternalNotificationFlag: false,
                            },
                        })
                        .then(res => {
                            this.loadEventDetailData(
                                stime,
                                etime,
                                isHourly,
                                res.data,
                                []
                            );
                        })
                        .catch(() => {
                            this.detailProgress = 1;
                        });
                }, 500);
            } else {
                axios
                    .get('/domaingroup/db/event/list/data', {
                        params: {
                            session: session,
                        },
                    })
                    .then(res => {
                        this.detailProgress = res.data.progress;

                        data = data.concat(res.data.partialData);
                        if (res.data.hasNext) {
                            this.loadEventDetailData(
                                stime,
                                etime,
                                isHourly,
                                session,
                                data
                            );
                        } else {
                            data.sort((a, b) => {
                                return a.time < b.time
                                    ? -1
                                    : a.time > b.time
                                    ? 1
                                    : 0;
                            });

                            this.detailDataList = data;
                            this.detailProgress = 1;
                            this.isFilterDetailData = false;
                        }
                    })
                    .catch(() => {
                        this.detailProgress = 1;
                    });
            }
        },

        // 하위 컴포넌트에서 호출되는 핸들러 메소드
        onUpdateSearchCondition: function(condition) {
            this.searchCondition = condition;

            const now = getDayjs();
            const startDate = getDayjs(condition.stime);

            // ARIES-9317: 검색 범위 안에 오늘이 포함되면, 선택 날짜를 오늘로 설정한다.
            if (
                now.valueOf() >= condition.stime &&
                now.valueOf() <= condition.etime
            ) {
                this.dailyChartActiveIndex =
                    now.date() - 1 - (startDate.date() - 1);
            } else {
                this.dailyChartActiveIndex = 0;
            }

            const hourlyTime = this.getDetailSearchTime(
                this.dailyChartActiveIndex
            );
            this.updateStackChartData(
                this.searchCondition.stime,
                this.searchCondition.etime,
                ClientUtilities.ONE_DAY
            );
            this.updateStackChartData(
                hourlyTime.stime,
                hourlyTime.etime,
                ClientUtilities.ONE_HOUR
            );
            this.loadEventDetailData(hourlyTime.stime, hourlyTime.etime, false);
        },
        onClickForDetailTable: function(obj, isHourly) {
            // 일간 차트 전체 개수 클릭시
            if (obj == null) {
                obj = { dataIndex: -1 };

                //  JJC-4347: 시간당 차트 숨기기
                this.isActiveHourlyChart = false;
                this.selectedChartType = 'daily';
            }

            const searchTime = this.getDetailSearchTime(
                !isHourly ? obj.dataIndex : this.dailyChartActiveIndex,
                !isHourly ? -1 : obj.dataIndex
            );
            if (!isHourly) {
                this.dailyChartActiveIndex = obj.dataIndex;
                this.hourlyChartActiveIndex = -1;

                this.updateStackChartData(
                    searchTime.stime,
                    searchTime.etime,
                    ClientUtilities.ONE_HOUR
                );
            } else {
                this.hourlyChartActiveIndex = obj.dataIndex;
            }

            this.loadEventDetailData(
                searchTime.stime,
                searchTime.etime,
                isHourly
            );
        },
        onFilterForDetailTable: function(targets, isHourly) {
            // 일간 차트 필터시, 우측 시간당 차트를 초기화 한다.
            if (!isHourly) {
                const searchTime = this.getDetailSearchTime(
                    this.dailyChartActiveIndex,
                    -1
                );

                this.loadEventDetailData(
                    searchTime.stime,
                    searchTime.etime,
                    isHourly
                );

                this.hourlyChartActiveIndex = -1;
            } else {
                const searchTime = this.getDetailSearchTime(
                    this.dailyChartActiveIndex,
                    this.hourlyChartActiveIndex
                );

                this.loadEventDetailData(
                    searchTime.stime,
                    searchTime.etime,
                    isHourly
                );
            }
        },
        onRateFilterForDetailTable: function(filterData, originData) {
            if (filterData.length == 0) {
                this.isFilterDetailData = false;
                this.detailDataList = originData;
            } else {
                this.isFilterDetailData = true;
                this.detailDataList = filterData;
            }
        },
        onResetForRateChart: function() {
            this.isFilterDetailData = false;
        },
        onChangeHeaderFold: function(isFold) {
            this.isHeaderFold = !isFold;
            this.resizeHandler();
        },
        onChangeChartFilter: function() {
            const levels = this.chartFilterOptions.map(opt => opt.active);
            const dailyValues = [];
            const hourlyValues = [];
            const searchTime = this.getDetailSearchTime(
                this.dailyChartActiveIndex,
                this.hourlyChartActiveIndex
            );

            levels.forEach((active, index) => {
                dailyValues[index] = [...this.dailyChartOriginValues[index]];
                hourlyValues[index] = [...this.hourlyChartOriginValues[index]];

                if (!active) {
                    dailyValues[index].fill(0);
                    hourlyValues[index].fill(0);
                }
            });

            this.dailyChartValues = dailyValues;
            this.dailyChartMaxValue = this.getStackMaxValue(dailyValues);
            this.hourlyChartValues = hourlyValues;
            this.hourlyChartMaxValue = this.getStackMaxValue(hourlyValues);

            this.loadEventDetailData(
                searchTime.stime,
                searchTime.etime,
                this.isActiveHourlyChart
            );
        },
        onChangeChartShowType: function({ value }) {
            if (this.dailyChartActiveIndex !== -1) {
                this.isActiveHourlyChart = value === 'hourly';
                this.selectedChartType = value;

                if (!this.isActiveHourlyChart) {
                    this.onClickForDetailTable(
                        {
                            dataIndex: this.dailyChartActiveIndex,
                        },
                        false
                    );
                }
            }
        },
    },
    created() {
        this.resizeHandler = _.throttle(() => {
            this.mainHeight =
                window.innerHeight - 556 + (this.isHeaderFold ? 365 : 0);
        }, 100);
        this.resizeHandler();
    },
    mounted() {
        window.addEventListener('resize', this.resizeHandler);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeHandler);
    },
});
