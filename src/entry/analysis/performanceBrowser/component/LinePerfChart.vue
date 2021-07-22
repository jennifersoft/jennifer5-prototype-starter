<template>
    <div
        class="line-perf-chart"
        @mousemove.capture="mouseMove"
        @mousedown.capture="stopMouseEventWhenLoadingData"
        @mouseup.capture="stopMouseEventWhenLoadingData"
    >
        <loading-indicator v-show="loadingData" :indicator-color="'#8652ff'" />
        <chart-component
            :chart-option="item"
            :show-interaction-component="false"
            @chart-made="madeChart"
        ></chart-component>
        <div class="performance-chart-range-navi" v-if="naviBtnItems">
            <btn
                @click="clickNavi"
                :items="naviBtnItems"
                :type-in-group-button="'noselect'"
                class="primary-reverse"
            ></btn>
        </div>
        <div class="performance-chart-interaction">
            <btn
                class="border-none"
                :tooltip-options="{
                    message: i18n.originratio,
                    position: 'top-center',
                }"
                :items="[{ iconType: refreshIcon }]"
                @click="emitDefaultRatio"
            />
            <btn
                class="border-none"
                :tooltip-options="{
                    message: i18n.autoScale,
                    position: 'top-center',
                }"
                :items="[{ iconType: autoScaleUpIcon }]"
                @click="emitAutoScale"
            />
            <btn
                class="border-none"
                :tooltip-options="{
                    message: toggleLayoutMessage,
                    position: 'top-center',
                }"
                :items="[{ iconType: toggleLayoutIcon }]"
                @click="toggleChartOnlyLayout"
            />
        </div>
        <div v-show="loadingData" class="loading-data-message">
            {{ i18n.M0630 }}
        </div>
        <div v-show="intervalSec > 0" class="interval">
            <tooltip :message="i18n.M0308" :position="'top-right'">
                <span>Interval {{ intervalSec }}sec</span>
            </tooltip>
        </div>

        <div
            class="values-box"
            v-show="
                mousePositionX !== undefined &&
                    Object.keys(currentXValues).length > 0
            "
            :style="styleValuesBox"
        >
            <div
                class="row"
                v-for="(item, index) in liveConditionOrSelectedList"
            >
                <div
                    class="circle"
                    :style="{
                        background: item.displayOption.switchButtonColor,
                    }"
                ></div>
                <span class="value">{{ toLocaleValue(item.key) }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import ChartComponent from '@entry/userdefine/dashboard/component/ChartComponent';
import { mapMutations, mapState, mapGetters, mapActions } from 'vuex';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import Btn from '@vuejs/component/button/Btn';
import Tooltip from '@vuejs/component/tooltip/Tooltip';
import { LicenseStatusDef } from '@common/definition';
import { timeSelectRangeToText } from '@module/chart/util/Time18n';
import { Observer } from '@common/legacy/Observer';
import { ChartKeywordInObserver } from '@common/ObserverKeyword';
import LoadingIndicator from '@vuejs/component/Loading/LoadingIndicator';

export default {
    name: 'LinePerfChart',
    components: {
        LoadingIndicator,
        ChartComponent,
        Btn,
        Tooltip,
    },
    inject: {
        theme: {
            default: 'classic',
        },
        i18n: {
            default: () => ({
                viewSmaller: 'View smaller',
                viewLarger: 'View larger',
                autoScale: 'Auto Scale',
                M0308: '',
                M0630: 'Getting data from server.',
            }),
        },
    },
    props: {},
    data() {
        return {
            item: {
                charttype: 'line.perf',
                zIndex: 10,
                defaultmax: 100,
                inAnalysis: true,
            },
            performanceChart: undefined,
            LicenseStatusDef: LicenseStatusDef,

            mousePositionX: undefined,
            mousePositionY: undefined,
            clientWidth: undefined,
            clientHeight: undefined,
        };
    },
    methods: {
        ...mapMutations('performancebrowser', [
            'configureChart',
            'toggleChartOnlyLayout',
            'appendFocusTimeStack',
            'popFocusTimeStack',
            'clearFocusTimeStack',
        ]),

        ...mapActions('performancebrowser', ['reloadDataWhenChangeTime']),

        stopMouseEventWhenLoadingData(event) {
            if (this.loadingData) {
                event.stopPropagation();
            }
        },
        madeChart(chart) {
            this.configureChart(chart);
            this.performanceChart = chart;
            this.performanceChart.handlerReload(this.reloadDataWhenChangeTime);
        },
        emitAutoScale() {
            const modelGroup = this.performanceChart.getModel();
            const models = modelGroup.getModels();
            const maxFromModelGroup = modelGroup.getMax();

            models.forEach(model => {
                if (model.getMax() > 0)
                    model.ratio = maxFromModelGroup / model.getMax();
            });
            this.performanceChart.paintChart();
        },
        emitDefaultRatio() {
            const modelGroup = this.performanceChart.getModel();
            const models = modelGroup.getModels();

            models.forEach(model => (model.ratio = 1));
            this.performanceChart.paintChart();
        },
        clickNavi(item) {
            if (item.value === 'backHistory') this.emitBackHistory();
            else if (item.value === 'removeAllHistory')
                this.emitRemoveAllHistory();
        },
        emitBackHistory() {
            this.popFocusTimeStack();

            this.performanceChart.focusTimeRange = this.focusTimeRange;
            this.performanceChart.repaint();
        },
        emitRemoveAllHistory() {
            this.clearFocusTimeStack();
            this.performanceChart.focusTimeRange = undefined;
            this.performanceChart.repaint();
        },
        mouseMove(event) {
            this.mousePositionX = event.offsetX;
            this.mousePositionY = event.offsetY;
            this.stopMouseEventWhenLoadingData(event);
        },

        toLocaleValue(key) {
            return this.currentXValues[key]?.toLocaleForAries();
        },
    },
    computed: {
        ...mapState('performancebrowser', {
            loadingData: state => state.loadingData,
            searchConditionQueue: state => state.searchConditionQueue,
            selectedLineKey: state => state.selectedLineKey,
            focusTimeStack: state => state.focusTimeStack,
            chartOnlyLayout: state => state.chartOnlyLayout,
            periodDays: state => state.selected.periodDays,
        }),
        ...mapGetters('performancebrowser', ['focusTimeRange']),

        liveConditionOrSelectedList() {
            const filterFunction = this.selectedLineKey
                ? item => item.key === this.selectedLineKey
                : ({ displayOption }) =>
                      displayOption.agent.license_status ===
                      LicenseStatusDef.RUNNING;

            return this.searchConditionQueue.filter(filterFunction);
        },
        toggleLayoutIcon() {
            return this.chartOnlyLayout ? this.shrinkIcon : this.expandIcon;
        },
        toggleLayoutMessage() {
            return this.chartOnlyLayout
                ? this.i18n.viewSmaller
                : this.i18n.viewLarger;
        },
        naviBtnItems() {
            if (this.focusTimeRange) {
                const { stime, etime } = this.focusTimeRange;
                const range = etime - stime;
                const startTimeText = timeSelectRangeToText(
                    stime,
                    range,
                    this.periodDays > 1
                );

                const endTimeText = timeSelectRangeToText(
                    etime,
                    range,
                    this.periodDays > 1
                );

                return [
                    { iconType: ICON_TYPE.arrowLeft, value: 'backHistory' },
                    {
                        text: `${startTimeText} ~ ${endTimeText}`,
                        value: 'text',
                    },
                    { iconType: ICON_TYPE.close, value: 'removeAllHistory' },
                ];
            } else return undefined;
        },
        styleValuesBox() {
            const styles = {};

            if (this.clientWidth * 0.5 < this.mousePositionX)
                styles.right =
                    this.clientWidth - this.mousePositionX + 10 + 'px';
            else styles.left = this.mousePositionX + 10 + 'px';

            const maxBoxHeight = this.clientHeight - 100;
            const realBoxHeight =
                12 * 2 + this.liveConditionOrSelectedList.length * 12;
            const boxHeight =
                realBoxHeight > maxBoxHeight ? maxBoxHeight : realBoxHeight;

            styles.top = (this.clientHeight - boxHeight) * 0.5 + 'px';
            styles.height = boxHeight + 'px';

            return styles;
        },

        intervalSec() {
            return this.performanceChart?.intervalSec;
        },

        currentXValues() {
            return this.performanceChart?.currentXValues;
        },
    },
    created() {
        this.expandIcon = ICON_TYPE.expand;
        this.shrinkIcon = ICON_TYPE.shrink;
        this.autoScaleUpIcon = ICON_TYPE.autoScaleUp;
        this.refreshIcon = ICON_TYPE.refresh;
        this.arrowLeftIcon = ICON_TYPE.arrowLeft;
        this.closeIcon = ICON_TYPE.close;
    },
    mounted() {
        //https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
        const resizeObserver = new ResizeObserver(el => {
            this.clientWidth = this.$el.clientWidth;
            this.clientHeight = this.$el.clientHeight;
            this.performanceChart.paintChart();
        });
        resizeObserver.observe(this.$el);

        this.clientWidth = this.$el.clientWidth;
        this.clientHeight = this.$el.clientHeight;

        Observer.on(
            ChartKeywordInObserver.FOCUS_TIME_AREA_IN_PERFORMANCE_CHART,
            focusTimeArea => {
                this.appendFocusTimeStack(focusTimeArea);
            }
        );
    },
};
</script>
<style lang="scss" scoped>
@import '~@common/scss/themes.scss';
$themes: (
    classic: (
        border-color: #e8e8e8,
        hover-box-text-color: #212121,
        interval-text-color: #999999,
        values-box-bg-color: #ffffff,
        values-box-box-shadow1: rgba(0, 0, 0, 0.2),
        values-box-box-shadow2: rgba(0, 0, 0, 0.1),
    ),
    dark: (
        border-color: #4e4e4e,
        hover-box-text-color: #e8e8e8,
        interval-text-color: #616161,
        values-box-bg-color: #292929,
        values-box-box-shadow1: rgba(0, 0, 0, 0.2),
        values-box-box-shadow2: rgba(0, 0, 0, 0.1),
    ),
);
.line-perf-chart {
    position: relative;
    height: 100%;

    ::v-deep .chart-component {
        position: relative;
        height: 100%;
        box-shadow: none;

        @include themify($themes) {
            border: solid 1px themed('border-color');
        }
    }
    .performance-chart-range-navi {
        position: absolute;
        left: 17px;
        top: 17px;
        z-index: 10;
        ::v-deep .aries-ui-btn {
            .item {
                & + .item {
                    border-left: 0;
                }
                > span {
                    padding: 0;
                }
                &:nth-child(2) {
                    pointer-events: none;
                    cursor: default;
                }
            }
        }
    }
    .performance-chart-interaction {
        position: absolute;
        right: 9px;
        top: 9px;
        z-index: 10;
    }
    .loading-data-message {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 20;
        font-size: 14px;
        padding: 24px;
        border-radius: 4px;

        @include themify($themes) {
            background: themed('values-box-bg-color');
            box-shadow: 0 1px 3px 0 themed('values-box-box-shadow1'),
                0 2px 8px 0 themed('values-box-box-shadow2');
            color: themed('hover-box-text-color');
        }
    }
    .interval {
        position: absolute;
        right: 17px;
        bottom: 17px;
        z-index: 10;
        font-size: 11px;

        @include themify($themes) {
            color: themed('interval-text-color');
        }
    }
    .values-box {
        position: absolute;
        z-index: 100;
        border-radius: 3px;
        padding: 12px;
        overflow-y: auto;
        @include themify($themes) {
            background: themed('values-box-bg-color');
            box-shadow: 0 1px 3px 0 themed('values-box-box-shadow1'),
                0 2px 8px 0 themed('values-box-box-shadow2');
        }

        > .row {
            .circle {
                width: 8px;
                height: 8px;
                border-radius: 4px;
                display: inline-flex;
            }
            .value {
                margin-left: 4px;
                display: inline-flex;
                font-size: 12px;
                @include themify($themes) {
                    color: themed('hover-box-text-color');
                }
            }
        }
    }
}
</style>
