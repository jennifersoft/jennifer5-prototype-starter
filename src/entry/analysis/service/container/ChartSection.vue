<template>
    <div class="chart-section" v-click-outside="onHideChartDataMenus">
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
                    <circle-loading-btn v-if="dailyChartLoading"
                                        type="loading"
                                        :loading="true" />
                    <btn
                        v-else
                        normal
                        class="border-none"
                        :items="[{ iconType: moreIcon }]"
                        :tooltip-options="{ message: i18n.settingETC }"
                        :pressed="showDailyDataMenu"
                        @click="() => (showDailyDataMenu = !showDailyDataMenu)"
                    ></btn>
                    <layered-menu v-if="showDailyDataMenu">
                        <popup-list
                            no-scroll
                            normal
                            :items="dailyDataItems"
                            :active-index="dailyDataIndex"
                            @update:active-index="onChangeDailyDataKey"
                        />
                    </layered-menu>
                </div>
            </div>
            <div class="chart">
                <daily-column-chart
                    :key="dailyChartKey"
                    :rows="dailyChartRows"
                    :row-index="activeDailyChartIndex"
                    @click="onClickDailyChartRow"
                ></daily-column-chart>
            </div>
        </div>
        <div class="right" v-if="!onlyDailyChartMode">
            <div class="subject">
                <div class="left">{{ hourlyChartTitle }}</div>
                <div class="right">
                    <circle-loading-btn v-if="hourlyChartLoading"
                                        type="loading"
                                        :loading="true" />
                    <btn
                        v-else
                        class="border-none"
                        normal
                        :items="[{ iconType: moreIcon }]"
                        :tooltip-options="{ message: i18n.settingETC }"
                        :pressed="showHourlyDataMenu"
                        @click="
                            () => (showHourlyDataMenu = !showHourlyDataMenu)
                        "
                    ></btn>
                    <layered-menu v-if="showHourlyDataMenu">
                        <popup-list
                            no-scroll
                            normal
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
                    @click="onClickHourlyChartRow"
                    v-if="isHourlyColumnChart"
                ></hourly-column-chart>
                <hourly-line-chart
                    :date="hourlyChartSearchDates[0]"
                    :rows="hourlyChartRows"
                    @click="onClickHourlyChartRow"
                    v-else
                ></hourly-line-chart>
            </div>
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import CircleLoadingBtn from "@vuejs/component/button/CircleLoadingBtn";
import PopupList from '@vuejs/component/Dropdown/PopupList';
import LayeredMenu from '@entry/popup/xviewAnalysis/component/LayeredMenu';
import DailyColumnChart from '../component/DailyColumnChart';
import HourlyColumnChart from '../component/HourlyColumnChart';
import HourlyLineChart from '../component/HourlyLineChart';
import clickOutside from '@vuejs/directive/clickOutside';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { MxDef } from '@common/definition';
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
            showDailyDataMenu: false,
            showHourlyDataMenu: false,
            dailyChartKey: 1,
            dailyDataIndex: 0,
            dailyDataItems: [
                { text: this.i18n.dailyHit, value: MxDef.service_count },
                { text: this.i18n.dailyVisitor, value: MxDef.visit_day },
                { text: this.i18n.dailyErrorCount, value: MxDef.error_count },
            ],
            hourlyDataIndex: 0,
            hourlyDataItems: [
                { text: this.i18n.hourlyHit, value: MxDef.service_count },
                { text: this.i18n.hourlyVisitor, value: MxDef.visit_hour },
                { text: this.i18n.hourlyErrorCount, value: MxDef.error_count },
                {
                    text: this.i18n.concurrentUser,
                    value: MxDef.concurrent_user,
                },
                {
                    text: this.i18n.tps,
                    value: MxDef.service_rate,
                },
                {
                    text: this.i18n.activeService,
                    value: MxDef.active_service,
                },
            ],
        };
    },
    computed: {
        ...mapState({
            tableLoading: state => state.tableLoading,
            dailyChartLoading: state => state.dailyChartLoading,
            hourlyChartLoading: state => state.hourlyChartLoading,

            onlyDailyChartMode: state => state.activeDailyChartIndex === -1,
            isHourlyColumnChart: state => state.hourlyChartInterval === 60,

            activeDailyChartIndex: state => state.activeDailyChartIndex,
            dailyChartRows: state => state.dailyChartRows,
            hourlyChartRows: state => state.hourlyChartRows,
        }),
        ...mapGetters([
            'dailyChartSearchDates',
            'hourlyChartSearchDates',
            'sumOfDailyChartValues',
        ]),
        totalCountFormat() {
            return this.sumOfDailyChartValues.toLocaleForAries();
        },
        dailyChartTitle() {
            return this.dailyDataItems[this.dailyDataIndex].text;
        },
        hourlyChartTitle() {
            return this.hourlyDataItems[this.hourlyDataIndex].text;
        },
    },
    methods: {
        ...mapMutations([
            'updateChartDataMetrics',
            'changeActiveDailyChartIndex',
            'changeActiveHourlyChartIndex',
        ]),
        ...mapActions([
            'loadDailyChartData',
            'loadHourlyChartData',
            'loadTableData',
            'changeActiveDailyChartStatus',
        ]),
        afterChangeChartKeys() {
            this.updateChartDataMetrics({
                daily: this.dailyDataItems[this.dailyDataIndex].value,
                hourly: this.hourlyDataItems[this.hourlyDataIndex].value,
            });

            this.onHideChartDataMenus();
        },
        onHideChartDataMenus() {
            this.showDailyDataMenu = false;
            this.showHourlyDataMenu = false;
        },
        onChangeDailyDataKey(index) {
            const [start, end] = this.dailyChartSearchDates;

            if (end.diff(start, 'day') > 30) {
                this.$emit('alert', this.i18n.M0010);
                return;
            }

            this.dailyDataIndex = index;
            this.afterChangeChartKeys();
            this.loadDailyChartData();
        },
        onChangeHourlyDataKey(index) {
            this.hourlyDataIndex = index;
            this.afterChangeChartKeys();
            this.loadHourlyChartData();
            // 시간당 차트는 타입을 변경시 선택 해제가 되기 때문에 테이블 데이터를 다시 불러와야 한다.
            this.changeActiveHourlyChartIndex(-1);
            this.loadTableData();
        },
        onClickDailyChartTotalMode() {
            this.changeActiveDailyChartIndex(-1);
            this.dailyChartKey += 1;
            this.loadTableData();
        },
        onClickDailyChartRow(index) {
            if (this.onlyDailyChartMode && this.tableLoading) {
                // 차트를 다시 그려서 선택 효과를 없애 준다. (이게 좋은 방법인지는 모르겠음)
                this.dailyChartKey += 1;
            } else {
                const onlyDailyChartMode = this.onlyDailyChartMode;
                this.changeActiveDailyChartIndex(index);

                // 전체 모드에서 개별 모드로 전환될 때, 차트 객체를 다시 생성한다.
                if (onlyDailyChartMode) this.dailyChartKey += 1;

                this.loadHourlyChartData();
                this.loadTableData();
            }
        },
        onClickHourlyChartRow(index) {
            this.changeActiveHourlyChartIndex(index);
            this.loadTableData();
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes';

.chart-section {
    @include themify($themes) {
        display: flex;
        height: 250px;
        margin-top: 16px;
        border-radius: 4px;
        border: solid 1px themed('chart-section-border-color');
        background-color: themed('chart-section-background-color');

        > div {
            flex: 1;

            > .subject {
                display: flex;
                font-size: 14px;
                font-weight: 500;
                line-height: 42px;
                height: 42px;
                padding-left: 16px;
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
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        padding-right: 3px;
                    }

                    ::v-deep .layered-menu {
                        text-align: left;
                        width: 250px !important;
                        right: 3px !important;
                        top: 42px !important;
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
