<template>
    <div
        class="chart"
        @mousedown.capture="onMousedownComponent"
        @mousemove.capture="eventStopWhenNeed"
        @mouseup.capture.stop
        @dblclick.capture.stop
        :data-chart-type="chartOption.charttype"
        :data-topbar-sync="chartOption.domainBarSync"
        :data-key="chartOption.dataKey"
        :data-target-type="chartOption.datatype"
        :data-external-chart-type="chartOption.externalChartType"
        :data-metrics="chartOption.metrics"
        :data-metrics-from-jennifer-front="chartOption.metricsFromJenniferFront"
        :data-title="chartOption.title"
        :data-pkey="chartOption.pkey"
        :data-ptype="chartOption.ptype"
        :data-startx="chartOption.startx"
        :data-endx="chartOption.endx"
        :data-starty="chartOption.starty"
        :data-endy="chartOption.endy"
        :data-zindex="chartOption.zIndex"
        :charttype="chartOption.charttype"
        :rowcount="chartOption.rowcount"
        :columncount="chartOption.columncount"
        :data-rowcount="chartOption.rowcount"
        :data-columncount="chartOption.columncount"
        :isDivideByDomain="chartOption.isDivideByDomain"
        :showDomainNameInSpeedMeter="chartOption.showDomainNameInSpeedMeter"
        :showInstanceNameInSpeedMeter="chartOption.showInstanceNameInSpeedMeter"
        :columns="chartOption.columns"
        :perspective="chartOption.perspective"
        :contentFontSize="chartOption.contentFontSize"
        :mxid="chartOption.metrics"
        ref="chartWrap"
        :style="style"
    >
        <canvas class="render" :ctitle="chartOption.title" />
        <canvas class="interaction" />
        <div class="button-layer" v-show="isActiveComponent">
            <btn
                v-if="chartOption.charttype === 'line.compare'"
                :items="baselineConfigureItem"
                class="focus"
                @click="emitShowWindowWhenBaselineChartEdit(true)"
            />
            <btn
                v-else-if="chartOption.charttype === 'list.activeservice'"
                :items="columnConfigureItem"
                class="focus"
                @click="emitShowWindowWhenActiveServiceListChartEdit(true)"
            />
        </div>

        <edit-component-template
            :data-key="chartOption.dataKey"
            @onMousedownResizePoint="onMousedownResizePoint"
            @onRemoveComponent="onRemoveComponent"
        >
        </edit-component-template>
    </div>
</template>

<script>
import {
    registerAfterMakeExternalChartWithChartOption,
    registerAfterMakeInternalChartWithChartOption,
    unregisterExternalChart,
    unregisterInternalChart,
} from '@module/common/DashboardChartHandler';

import { createNamespacedHelpers } from 'vuex';
import { COMPONENT_RESIZE } from '@entry/userdefine/dashboardEdit/const';
import EditComponentTemplate from '@entry/userdefine/dashboardEdit/component/template/editComponentTemplate';
import Btn from '@vuejs/component/button/Btn';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

const { mapGetters, mapState, mapMutations } = createNamespacedHelpers(
    'userdefine'
);

export default {
    name: 'chartTemplate',
    components: { EditComponentTemplate, Btn },
    props: {
        chartOption: {
            type: Object,
            required: true,
        },
        areaHeight: {
            type: Number,
            required: true,
        },
        areaWidth: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            COMPONENT_RESIZE: COMPONENT_RESIZE,
            EVENT_CAPTURE_PERMIT_CHARTS: ['scoreboard'],
            chart: undefined,
            baselineConfigureItem: [
                {
                    iconType: ICON_TYPE.edit,
                    text: i18n.get('ui.label.baseline.setting'),
                },
            ],
            columnConfigureItem: [
                {
                    iconType: ICON_TYPE.edit,
                    text: i18n.get('ui.label.manageTableColumns'),
                },
            ],
        };
    },
    methods: {
        ...mapMutations([
            'setEditingChart',
            'setEditingCellOptionOnScoreBoard',
            'removeComponent',
            'emitShowWindowWhenBaselineChartEdit',
            'emitShowWindowWhenActiveServiceListChartEdit',
        ]),

        onMousedownComponent(event) {
            const className = event.target.className;

            this.setEditingChart(this.chartOption.dataKey);

            //컴포넌트 편집 이벤트는 허용한다.
            //Btn.vue 도 허용한다.
            //http://issue.jennifersoft.com/browse/JQA-624?focusedCommentId=105659&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-105659
            if (
                className.includes('edit-resize-point') === false &&
                event.target.parentElement?.className?.includes(
                    'aries-ui-btn'
                ) === false
            ) {
                this.eventStopWhenNeed(event);
                this.$emit('onMousedownComponent', event);
            }
        },

        eventStopWhenNeed(event) {
            if (
                this.EVENT_CAPTURE_PERMIT_CHARTS.includes(
                    this.chartOption.charttype
                ) === false
            )
                event.stopPropagation();
        },

        onMousedownResizePoint(emitData) {
            this.$emit('onMousedownResizePoint', emitData);
        },

        onRemoveComponent(dataKey) {
            this.stopAndUnregisterChart();
        },

        stopAndUnregisterChart() {
            this.chart.stopPaint();
            this.chartOption.charttype !== 'line.external'
                ? unregisterInternalChart(this.chartOption.dataKey)
                : unregisterExternalChart(this.chartOption.dataKey);
        },

        paintAfterMakeChart() {
            this.chart =
                this.chartOption.charttype !== 'line.external'
                    ? registerAfterMakeInternalChartWithChartOption(
                          this.chartOption,
                          this.$refs.chartWrap
                      )
                    : registerAfterMakeExternalChartWithChartOption(
                          this.chartOption,
                          this.$refs.chartWrap
                      );
            //셀별 데이터 설정.
            if (this.chartOption.charttype === 'scoreboard') {
                this.chart.isUserDefinedEditMode = true;
                this.chart.setEditFuncCallback(
                    (chart, cellIndex, left, top) => {
                        this.$nextTick(() => {
                            this.setEditingCellOptionOnScoreBoard({
                                cellIndex: cellIndex,
                                left: left,
                                top: top,
                            });
                        });
                    }
                );
            }

            this.$emit('registeredChartKey', this.chartOption.dataKey);
            this.chart.paintEveryInterval();
        },

        paintChart() {
            this.$nextTick(() => {
                this.chart.paintChart();
            });
        },
    },
    computed: {
        ...mapState([
            'editingChartOptions',
            'editingComponentDataKey',
            'optionsOnScoreboard',
        ]),

        isActiveComponent() {
            return this.chartOption.dataKey === this.editingComponentDataKey;
        },

        style() {
            return {
                'z-index': this.chartOption.zIndex,
                left: this.areaWidth * this.chartOption.startx * 0.01 + 'px',
                top: this.areaHeight * this.chartOption.starty * 0.01 + 'px',
                width:
                    this.areaWidth *
                        (this.chartOption.endx - this.chartOption.startx) *
                        0.01 +
                    'px',
                height:
                    this.areaHeight *
                        (this.chartOption.endy - this.chartOption.starty) *
                        0.01 +
                    'px',
            };
        },

        sid() {
            return this.chartOption.sid.join(',');
        },

        oid() {
            return this.chartOption.oid.join(',');
        },

        cellLength() {
            return this.chartOption.rowcount * this.chartOption.columncount;
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.$nextTick(() => {
                this.paintAfterMakeChart();
            });
        });

        this.$parent.$on('paintChart', this.paintChart);
    },

    watch: {
        chartOption() {
            this.stopAndUnregisterChart();

            this.$nextTick(() => {
                this.paintAfterMakeChart();
            });
        },
    },
};
</script>
<style lang="scss" scoped>
@import '../themes.scss';

div.chart {
    @include themify($themes) {
        position: absolute;
        background-color: transparent;

        canvas {
            margin: 4px;
            position: absolute;
            width: calc(100% - 8px);
            height: calc(100% - 8px);
            //interaction canvas 내부에서 cursor: default로 돌리고 있다.
            cursor: pointer !important;
            border-radius: 5px;

            &.render {
                z-index: 10;
                background-color: themed('area-grid-canvas-background-color');
            }

            &.interaction {
                z-index: 11;
            }
        }

        .button-layer {
            z-index: 10000;
            position: absolute;
            right: 10px;
            top: 10px;

            > div {
                opacity: 0.6;
                &:hover {
                    opacity: 1;
                }
            }
        }
    }
}
</style>
