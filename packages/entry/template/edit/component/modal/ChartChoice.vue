<template>
    <base-window
        class="chart-choice"
        :width="1066"
        :height="448"
        :use-footer="false"
        @cancel="onClickHideBtn"
    >
        <template #subject>{{ i18n.chart }}</template>
        <template #contents>
            <div class="contents">
                <div>
                    <div class="icon">
                        <div class="line">
                            <svg-icon
                                :icon-type="iconTypes.lineChart"
                                :width="iconSize"
                                :height="iconSize"
                            ></svg-icon>
                        </div>
                    </div>
                    <div class="category">{{ i18n.linechart }}</div>
                    <div class="menu">
                        <span>{{ i18n.dbmetrics }}</span>
                        <btn
                            ref="test-btn"
                            :items="[{ text: i18n.insert }]"
                            @click="onClickShowBtn('LineChartMetrics')"
                        ></btn>
                    </div>
                    <div class="menu">
                        <span>{{ i18n.multiDomain }}</span>
                        <btn
                            :items="[{ text: i18n.insert }]"
                            @click="
                                onClickShowBtn('LineChartMetricsSummary')
                            "
                        ></btn>
                    </div>
                    <div class="menu">
                        <span>{{ i18n.compareMetrics }}</span>
                        <btn
                            :items="[{ text: i18n.insert }]"
                            @click="
                                onClickShowBtn('LineChartMetricsComparison')
                            "
                        ></btn>
                    </div>
                </div>
                <div>
                    <div class="icon">
                        <div class="bar">
                            <svg-icon
                                :icon-type="iconTypes.barChart"
                                :width="iconSize"
                                :height="iconSize"
                            ></svg-icon>
                        </div>
                    </div>
                    <div class="category">{{ i18n.barchart }}</div>
                    <div class="menu">
                        <span>{{ i18n.dbmetrics }}</span>
                        <btn
                            :items="[{ text: i18n.insert }]"
                            @click="onClickShowBtn('BarChartMetrics')"
                        ></btn>
                    </div>
                    <div class="menu">
                        <span>{{ i18n.dbevent }}</span>
                        <btn
                            :items="[{ text: i18n.insert }]"
                            @click="onClickShowBtn('BarChartEvent')"
                        ></btn>
                    </div>
                    <div class="menu">
                        <span>{{ i18n.dberror }}</span>
                        <btn
                            :items="[{ text: i18n.insert }]"
                            @click="onClickShowBtn('BarChartError')"
                        ></btn>
                    </div>
                </div>
                <div>
                    <div class="icon">
                        <div class="pie">
                            <svg-icon
                                :icon-type="iconTypes.pieChart"
                                :width="iconSize"
                                :height="iconSize"
                            ></svg-icon>
                        </div>
                    </div>
                    <div class="category">{{ i18n.piechart }}</div>
                    <div class="menu">
                        <span>{{ i18n.dbmetrics }} ({{ i18n.summary }})</span>
                        <btn
                            :items="[{ text: i18n.insert }]"
                            @click="onClickShowBtn('PieChartMetrics')"
                        ></btn>
                    </div>
                    <div class="menu">
                        <span>{{ i18n.dbevent }} ({{ i18n.summary }})</span>
                        <btn
                            :items="[{ text: i18n.insert }]"
                            @click="onClickShowBtn('PieChartEvent')"
                        ></btn>
                    </div>
                    <div class="menu">
                        <span>{{ i18n.dberror }} ({{ i18n.summary }})</span>
                        <btn
                            :items="[{ text: i18n.insert }]"
                            @click="onClickShowBtn('PieChartError')"
                        ></btn>
                    </div>
                </div>
            </div>
        </template>
    </base-window>
</template>
<script>
import BaseWindow from './BaseWindow';
import Btn from '@vuejs/component/button/Btn';
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { i18n } from '@common/utility';

export default {
    components: {
        BaseWindow,
        Btn,
        SvgIcon,
    },
    data() {
        return {
            i18n: {
                chart: i18n.get('ui.label.chart'),
                multiDomain: i18n.get('ui.title.multiDomain'),
                linechart: i18n.get('ui.title.report.linechart'),
                barchart: i18n.get('ui.title.report.barchart'),
                period: i18n.get('ui.label.period'),
                piechart: i18n.get('ui.title.report.piechart'),
                summary: i18n.get('ui.label.summary'),
                dbmetrics: i18n.get('ui.title.dbmetrics'),
                dbevent: i18n.get('ui.title.dbevent'),
                dberror: i18n.get('ui.title.dberror'),
                compareMetrics: i18n.get(
                    'ui.title.report.linechart.metrics.compare'
                ),
                insert: i18n.get('ui.label.insert'),
            },
            iconTypes: {
                lineChart: ICON_TYPE.chartLine,
                barChart: ICON_TYPE.chartBar,
                pieChart: ICON_TYPE.chartPie,
            },
            iconSize: 24,
        };
    },
    methods: {
        onClickHideBtn() {
            this.$emit('hide-layer');
        },
        onClickShowBtn(id) {
            this.$emit('show-layer', id);
        },
    },
};
</script>
<style lang="scss" scoped>
@import '../../themes';
.chart-choice {
    @include themify($themes) {
        ::v-deep .head {
            > .title {
                color: themed('common-font-color') !important;
            }
        }

        .contents {
            padding-top: 0px !important;
            .icon {
                text-align: center;
                > div {
                    display: inline-block;
                    padding: 20px;
                    margin-bottom: 24px;
                    border-radius: 24px;
                    max-height: 24px;
                    &.line {
                        background-color: themed(
                            'window-chart-choice-line-icon-color'
                        );
                    }
                    &.bar {
                        background-color: themed(
                            'window-chart-choice-bar-icon-color'
                        );
                    }
                    &.pie {
                        background-color: themed(
                            'window-chart-choice-pie-icon-color'
                        );
                    }
                    ::v-deep path {
                        fill: themed('window-chart-choice-icon-color');
                    }
                }
            }
        }
    }

    @import '../../style/table-choice';
    @include table-choice;
}
</style>
