<template>
    <div class="chart-component" :style="style">
        <canvas class="render" :ctitle="chartOption.title" />
        <canvas class="interaction" tabindex="1000" />
        <div class="top-icon">
            <chart-ux-top-left
                :chart-option="chartOption"
                @update:autoMaxInXView="updateAutoMaxInXView"
                :data-key="dataKey"
            >
            </chart-ux-top-left>
            <chart-ux-top-right
                v-if="showInteractionComponent"
                :chart-option="chartOption"
                :data-key="dataKey"
                @chart:popup="chartPopup"
                @chart:export="chartExport"
                @chart:message="chartShowMessage"
            ></chart-ux-top-right>
        </div>
        <alert
            v-if="chartMessage"
            class="info-message-alert"
            :type="'info'"
            :message="chartMessage"
            fade-down
        />
        <configure-max
            v-if="chartOption.charttype === 'xview.realtime'"
            v-show="autoMaxInXView === false"
        />
    </div>
</template>

<script>
import {
    registerAfterMakeExternalChartWithChartOption,
    registerAfterMakeInternalChartWithChartOption,
} from '@module/common/DashboardChartHandler';
import Alert from '@vuejs/component/Alert/Alert';
import { positionAndSizeStyle } from '@entry/userdefine/dashboard/component/common';
import ChartUxTopLeft from '@entry/userdefine/dashboard/component/ChartUxTopLeft';
import ChartUxTopRight from '@entry/userdefine/dashboard/component/ChartUxTopRight';
import { ElementManager } from '@common/legacy/ElementManager';
import { METRICS_DRAW_DOMAIN_IN_RUNTIME_LINE } from '@module/chart/config/ChartRenderConst';
import uuidv4 from '@library/uuid';
import { OIDDef } from '@common/definition';
import ConfigureMax from '@entry/analysis/xview/container/ConfigureMax';
import { ChartKeywordInObserver } from '@common/ObserverKeyword';
import { Observer } from '@common/legacy/Observer';

export default {
    name: 'ChartComponent',
    components: {
        Alert,
        ChartUxTopLeft,
        ChartUxTopRight,
        ConfigureMax,
    },
    inject: {
        //TODO 좀 더 고민해보고 필요 없다면 삭제하자.
        useExtendOrOriginInChartPosition: {
            type: Boolean,
            default: true,
            required: false,
        },
    },
    props: {
        chartOption: {
            type: Object,
            required: true,
        },
        originOrExtendInChartPosition: {
            type: String,
            required: false,
            default: undefined,
            validator: type => {
                return type === 'origin' || type === 'extend';
            },
        },
        showInteractionComponent: {
            type: Boolean,
            required: false,
            default: true,
        },
        filterInXview: {
            required: false,
            default: undefined,
        },
    },
    data() {
        return {
            chart: undefined,
            dataKey: undefined,
            chartMessage: undefined,
            autoMaxInXView: false,
        };
    },
    methods: {
        updateAutoMaxInXView(autoMax) {
            this.autoMaxInXView = autoMax;
        },
        paintAfterMakeChart() {
            this.chart =
                this.chartOption.charttype !== 'line.external'
                    ? registerAfterMakeInternalChartWithChartOption(
                          Object.assign(
                              { dataKey: this.dataKey },
                              this.chartOption
                          ),
                          this.$el
                      )
                    : registerAfterMakeExternalChartWithChartOption(
                          Object.assign(
                              { dataKey: this.dataKey },
                              this.chartOption
                          ),
                          this.$el
                      );

            this.$emit('chart-made', this.chart);

            if (this.filterInXview)
                this.chart.xviewFilter.applyFilterMap(this.filterInXview);
            this.chart.paintEveryInterval();
        },

        chartPopup(info) {
            const {
                offsetLeft: grandParentLeft,
                offsetTop: grandParentTop,
            } = this.$el.offsetParent.offsetParent;

            const {
                offsetLeft: parentLeft,
                offsetTop: parentTop,
            } = this.$el.offsetParent;

            const left =
                this.$el.offsetLeft +
                parentLeft +
                grandParentLeft +
                window.screenLeft;

            const top =
                this.$el.offsetTop +
                parentTop +
                grandParentTop +
                window.screenTop;
            const width = this.$el.offsetWidth;
            const height = this.$el.offsetHeight;

            let overwriteProperty = this.chart.getSelectedSidNOid();
            if (this.isRenderLineByDomain()) {
                overwriteProperty.oid = [OIDDef.TOT];
                overwriteProperty.datatype = 'domain';
            }

            //차트 내부에서 추가한 option이 있어서 차트 객체 내부의 값을 사용함.
            const chartOptions = this.chart.chartOptions;
            const tempChartOptions = Object.assign(
                {},
                chartOptions,
                overwriteProperty
            );

            const parmaObj = Object.assign(
                { dataKey: this.dataKey },
                this.CHART_POPUP_CONST.reduce((chartPopupParams, paramKey) => {
                    if (tempChartOptions[paramKey])
                        chartPopupParams[paramKey] =
                            paramKey === 'cellConfigureArray'
                                ? JSON.stringify(tempChartOptions[paramKey])
                                : tempChartOptions[paramKey];

                    return chartPopupParams;
                }, {}),
                this.propertyEmptyOrLineMerge()
            );

            const paramString = new URLSearchParams(
                Object.assign({}, parmaObj)
            ).toString();

            const url = '/popup/chartFromDashboard?' + paramString;
            const pop = window.open(
                url,
                this.dataKey,
                'width=' +
                    width +
                    ',height=' +
                    height +
                    ',left=' +
                    left +
                    ',top=' +
                    top +
                    ',history=no,resizable=yes,status=no,scrollbars=no,menubar=no,location=no'
            );
        },
        chartExport() {
            Observer.emit(ChartKeywordInObserver.EXPORT_CHART(this.dataKey));
        },
        chartShowMessage(message) {
            this.chartMessage = message;

            window.setTimeout(() => {
                this.chartMessage = undefined;
            }, 2000);
        },
        isRenderLineByDomain() {
            return (
                this.chart.getChartTypeName() === 'line.runtime' &&
                this.chart.getModel().cmdMap.domainBarSync &&
                (this.chart.getModel().isDomainType() ||
                    this.chart.getModel().isAgentType()) && // businessType 은 제외
                ElementManager.getCache().hasSelectedInstance === false && // 선택되어진게 하나도 없을 경우
                METRICS_DRAW_DOMAIN_IN_RUNTIME_LINE.includes(
                    this.chartOption.metrics
                ) &&
                this.chart.agentHandler?.selectedAgent() === undefined
            );
        },
        propertyEmptyOrLineMerge() {
            return this.chart.getChartTypeName() === 'line.runtime' &&
                this.chart.isMergedLineMode
                ? { ismergedlinemode: true }
                : {};
        },
        getIds() {
            return this.chart?.getModel().getIds();
        },
    },
    computed: {
        style() {
            const option = this.originOrExtendInChartPosition
                ? this.chartOption[this.originOrExtendInChartPosition]
                : this.chartOption;

            return positionAndSizeStyle(option);
        },
    },
    mounted() {
        this.paintAfterMakeChart();
    },
    watch: {
        originOrExtendInChartPosition() {
            this.$nextTick(() => {
                const option = this.originOrExtendInChartPosition
                    ? this.chartOption[this.originOrExtendInChartPosition]
                    : this.chartOption;
                if (option) this.chart?.paintChart();
            });
        },
    },
    created() {
        this.dataKey = this.chartOption.dataKey ?? uuidv4();

        //실시간 property 도 있다.
        //isListRenderModeForEvent

        this.CHART_POPUP_CONST = [
            'charttype',
            'dataKey',
            'datatype',
            'pkey',
            'ptype',
            'otype',
            'sid',
            'oid',
            'title',
            'metrics',
            'metricsmax',
            'metricsFromJenniferFront',
            'externalChartType',
            'fixedmax',
            'defaultmax',
            'columns',
            'perspective',
            'contentFontSize',
            'dateconditionlist',
            'labeldateconditionlist',
            'rowcount',
            'columncount',
            'cellConfigureArray',
            'isDivideByDomain',
            'isListRenderMode',
            'showDomainNameInSpeedMeter',
            'showInstanceNameInSpeedMeter',
        ];
    },
};
</script>
<style lang="scss" scoped>
.chart-component {
    box-sizing: border-box;
    border-radius: 3px;

    @import '~@vuejs/component/themes.scss';
    @include themify($themes) {
        box-shadow: 0 1px 2px 0 themed('topbar-shadow-color');
        border: solid 1px themed('topbar-border-color');
        background-color: themed('topbar-background-color');

        ::v-deep .xview-time-text {
            background-color: rgba(0, 0, 0, 0.75);
            color: themed('typography-color-white');
            font-size: 11px;
            position: absolute;

            z-index: 12;
            padding: 4px 8px;
            border-radius: 4px;

            right: 45%;
            top: 4px;
        }
    }

    position: absolute;
    > canvas {
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .render {
        z-index: 10;
    }
    .interaction {
        z-index: 11;
    }

    ::v-deep .configure-max {
        position: absolute;
        border-radius: 8px;
        height: 16px;

        font-size: 11px;
        border: solid 1px #e8e8e8;
        color: #616161;
        z-index: 15;
        text-align: right;
    }

    .top-icon {
        position: absolute;
        width: 100%;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 4px 4px 0 4px;
    }

    .info-message-alert {
        position: absolute;
        z-index: 100;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: fit-content !important;
    }
}
</style>
