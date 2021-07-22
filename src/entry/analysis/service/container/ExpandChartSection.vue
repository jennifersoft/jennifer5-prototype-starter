<template>
    <div class="expand-chart-section" v-click-outside="onHideChartDataMenus">
        <div class="left">
            <div class="subject">
                <div class="left">
                    {{ dailyChartTitle }}
                    <span
                        class="total"
                        @click="onClickDailyChartTotalMode"
                        v-if="!onlyDailyChartMode"
                    >
                        ({{ totalCountFormat }})
                    </span>
                </div>
                <div class="right">
                    <circle-loading-btn
                        small
                        :progress="dailyChartProgress"
                        :suspendible="false"
                        v-if="dailyChartProgress > 0"
                    ></circle-loading-btn>
                </div>
            </div>
            <div class="chart">
                <daily-column-chart
                    :key="dailyChartKey"
                    :rows="dailyChartRows"
                    :row-index="activeDailyChartIndex"
                    :height="chartHeight"
                    @click="onClickDailyChartRow"
                ></daily-column-chart>
            </div>
        </div>
        <div class="right" v-if="!onlyDailyChartMode">
            <div class="subject">
                <div class="left">{{ hourlyChartTitle }}</div>
                <div class="right" v-if="!isErrorPage">
                    <circle-loading-btn
                        small
                        :progress="hourlyChartProgress"
                        :suspendible="false"
                        v-if="hourlyChartProgress > 0"
                    ></circle-loading-btn>
                    <btn
                        class="border-none"
                        :items="[{ iconType: moreIcon }]"
                        :pressed="showHourlyDataMenu"
                        @click="
                            () => (showHourlyDataMenu = !showHourlyDataMenu)
                        "
                        v-else
                    ></btn>
                    <layered-menu
                        :right="3"
                        :top="30"
                        v-if="showHourlyDataMenu"
                    >
                        <popup-list
                            no-scroll
                            :items="hourlyDataItems"
                            :active-index="hourlyDataIndex"
                            @update:active-index="onChangeHourlyDataKey"
                        />
                    </layered-menu>
                </div>
            </div>
            <div class="chart">
                <hourly-column-chart
                    :rows="hourlyChartRows"
                    :height="chartHeight"
                    @click="onClickHourlyChartRow"
                ></hourly-column-chart>
            </div>
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import CircleLoadingBtn from '@vuejs/component/button/CircleLoadingBtn';
import PopupList from '@vuejs/component/Dropdown/PopupList';
import LayeredMenu from '@entry/popup/xviewAnalysis/component/LayeredMenu';
import DailyColumnChart from '../component/DailyColumnChart';
import HourlyColumnChart from '../component/HourlyColumnChart';
import HourlyLineChart from '../component/HourlyLineChart';
import clickOutside from '@vuejs/directive/clickOutside';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { mapState, mapMutations, mapActions, mapGetters } from '../vuex';

export default {
    inject: ['i18n'],
    components: {
        Btn,
        CircleLoadingBtn,
        PopupList,
        LayeredMenu,
        DailyColumnChart,
        HourlyColumnChart,
        HourlyLineChart,
    },
    directives: {
        clickOutside,
    },
    data() {
        return {
            moreIcon: ICON_TYPE.moreHorizon,
            showHourlyDataMenu: false,
            dailyChartKey: 1,
            hourlyDataIndex: 0,
            hourlyDataItems: [
                { text: this.i18n.hourlyHit, value: 'count' },
                {
                    text: this.i18n.responseTimeChart,
                    value: 'averageResponseTime',
                },
            ],
            chartHeight: 160,
        };
    },
    computed: {
        ...mapState({
            tableType: state => state.tableType,
            isErrorPage: state => state.tableType === 'error',

            tableProgress: state => state.expandTableProgress,
            dailyChartProgress: state => state.expandDailyChartProgress,
            hourlyChartProgress: state => state.expandHourlyChartProgress,
            onlyDailyChartMode: state =>
                state.expandActiveDailyChartIndex === -1,
            activeDailyChartIndex: state => state.expandActiveDailyChartIndex,
            expandDailyChartRows: state => state.expandDailyChartRows,
            expandHourlyChartRows: state => state.expandHourlyChartRows,
        }),
        ...mapGetters([
            'expandHourlyChartSearchDates',
            'expandSumOfDailyChartValues',
        ]),
        totalCountFormat() {
            return this.expandSumOfDailyChartValues.toLocaleForAries();
        },
        dailyChartTitle() {
            return this.i18n[this.isErrorPage ? 'dailyErrorCount' : 'dailyHit'];
        },
        hourlyChartTitle() {
            return this.isErrorPage
                ? this.i18n.hourlyErrorCount
                : this.hourlyDataItems[this.hourlyDataIndex].text;
        },
        dailyChartRows() {
            return this.expandDailyChartRows.map(row => {
                return {
                    date: row.date,
                    value: row.count,
                };
            });
        },
        hourlyChartRows() {
            return this.expandHourlyChartRows.map(row => {
                return {
                    date: row.date,
                    value:
                        row[this.hourlyDataItems[this.hourlyDataIndex].value],
                };
            });
        },
    },
    methods: {
        ...mapMutations([
            'changeExpandActiveDailyChartIndex',
            'changeExpandActiveHourlyChartIndex',
        ]),
        ...mapActions([
            'loadExpandChartData',
            'loadExpandTableData',
            'loadExpandTableDataForApplication',
        ]),
        loadTableData() {
            if (this.tableType === 'application')
                this.loadExpandTableDataForApplication();
            else this.loadExpandTableData();
        },
        onHideChartDataMenus() {
            this.showHourlyDataMenu = false;
        },
        onChangeHourlyDataKey(index) {
            this.hourlyDataIndex = index;
            this.onHideChartDataMenus();
        },
        onClickDailyChartTotalMode() {
            this.changeExpandActiveDailyChartIndex(-1);
            this.dailyChartKey += 1;
            this.loadTableData();
        },
        onClickDailyChartRow(index) {
            if (this.onlyDailyChartMode && this.tableProgress > 0) {
                // 차트를 다시 그려서 선택 효과를 없애 준다. (이게 좋은 방법인지는 모르겠음)
                this.dailyChartKey += 1;
            } else {
                const onlyDailyChartMode = this.onlyDailyChartMode;
                this.changeExpandActiveDailyChartIndex(index);

                // 전체 모드에서 개별 모드로 전환될 때, 차트 객체를 다시 생성한다.
                if (onlyDailyChartMode) this.dailyChartKey += 1;

                this.loadExpandChartData('HOUR');
                this.loadTableData();
            }
        },
        onClickHourlyChartRow(index) {
            this.changeExpandActiveHourlyChartIndex(index);
            this.loadTableData();
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes';

.expand-chart-section {
    @include themify($themes) {
        display: flex;
        height: 200px;
        margin-top: 16px;
        border-radius: 4px;
        border: solid 1px themed('chart-section-border-color');
        background-color: themed('chart-section-background-color');

        > div {
            flex: 1;

            > .subject {
                display: flex;
                font-size: 12px;
                font-weight: 500;
                line-height: 32px;
                height: 32px;
                padding-left: 10px;
                color: themed('chart-section-font-color');
                border-bottom: 1px solid themed('chart-section-border-color');

                > div {
                    position: relative;
                    flex: 1;

                    &.left {
                        > .total {
                            cursor: pointer;
                            opacity: 0.5;
                        }
                    }
                    &.right {
                        position: relative;
                        text-align: right;
                        ::v-deep .aries-ui-btn {
                            margin-top: -2px;
                            margin-right: 3px;
                        }
                        ::v-deep .aries-ui-circle-loading-btn {
                            margin-top: 3px;
                            margin-right: 3px;
                        }
                        ::v-deep .layered-menu {
                            text-align: left;
                        }
                    }
                }
            }

            &.right {
                border-left: solid 1px themed('chart-section-border-color');
            }
        }
    }
}
</style>
