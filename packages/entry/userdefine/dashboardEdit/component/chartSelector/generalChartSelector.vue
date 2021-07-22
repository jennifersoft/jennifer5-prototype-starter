<template>
    <div class="chart-box">
        <div>
            <div
                @click="onClickChart('equalizer')"
                :data-tooltip-text="i18nMessage.charttype.equalizer"
                :class="{
                    choose: editingChartOptions.charttype === 'equalizer',
                    show: canUseRealtimeData,
                }"
                class="chart-thumbnail"
            >
                <i class="equalizer" />
            </div>
            <div
                @click="onClickChart('line.runtime')"
                :data-tooltip-text="i18nMessage.charttype.lineRuntime"
                :class="{
                    choose: editingChartOptions.charttype === 'line.runtime',
                    show: canUseRealtimeData,
                }"
                class="chart-thumbnail"
            >
                <i class="line-runtime" />
            </div>
            <div
                @click="onClickChart('line')"
                :data-tooltip-text="i18nMessage.charttype.line24Hour"
                :class="{
                    choose: editingChartOptions.charttype === 'line',
                    show: canUseStandardData,
                }"
                class="chart-thumbnail"
            >
                <i class="line" />
            </div>
            <div
                @click="onClickChart('line.rightangle')"
                :data-tooltip-text="i18nMessage.charttype.line24HourPerHour"
                :class="{
                    choose: editingChartOptions.charttype === 'line.rightangle',
                    show: canUseStandardData,
                }"
                class="chart-thumbnail"
            >
                <i class="line-rightangle" />
            </div>
            <div
                @click="onClickChart('column.daily')"
                :data-tooltip-text="i18nMessage.charttype.column"
                :class="{
                    choose: editingChartOptions.charttype === 'column.daily',
                    show: canUseDomainData,
                }"
                class="chart-thumbnail"
            >
                <i class="column-daily" />
            </div>
            <div
                @click="onClickChart('area')"
                :data-tooltip-text="i18nMessage.charttype.area"
                :class="{
                    choose: editingChartOptions.charttype === 'area',
                    show: canUseDomainData,
                }"
                class="chart-thumbnail"
            >
                <i class="area" />
            </div>
        </div>
    </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import { getAccessByMetrics } from '@entry/userdefine/dashboardEdit/http';
import { PTypeDef } from '@common/definition';

const {
    mapGetters,
    mapState,
    mapMutations,
    mapActions,
} = createNamespacedHelpers('userdefine');

export default {
    name: 'generalChartSelector',
    inject: {
        i18nMessage: {
            charttype: {
                area: {
                    default: 'area',
                },
                bar: {
                    default: 'bar',
                },
                equalizer: {
                    default: 'equalizer',
                },
                event: {
                    default: 'event',
                },
                lineBase: {
                    default: 'line.base',
                },
                lineRuntime: {
                    default: 'line.runtime',
                },
                line24Hour: {
                    default: 'line.24Hour',
                },
                line24HourPerHour: {
                    default: 'line.24Hour.per.hour',
                },
                listActiveService: {
                    default: 'list.activeService',
                },
                speedBar: {
                    default: 'speedBar',
                },
                speedMeter: {
                    default: 'speedMeter',
                },
                scoreboard: {
                    default: 'scoreboard',
                },
                xview: {
                    default: 'x-view',
                },
            },
        },
    },
    data() {
        return {
            canUseRealtimeData: true,
            canUseStandardData: true,
            canUseDomainData: true,
        };
    },
    computed: {
        ...mapState(['editingChartOptions']),

        selectedMetrics() {
            return this.editingChartOptions.metrics;
        },
    },
    methods: {
        ...mapMutations(['setPTypeOnEditingChart', 'setPKeyOnEditingChart']),

        ...mapActions(['setChartTypeAndClearValueWhenClickThumnail']),

        onClickChart(type) {
            this.setChartTypeAndClearValueWhenClickThumnail(type);

            if (type === 'equalizer')
                this.setPTypeOnEditingChart(PTypeDef.REALTIME_LAST_SINGLE);
            else if (type === 'column.daily')
                this.setPTypeOnEditingChart(PTypeDef.STANDARD_HOUR_SINGLE);
            else if (type === 'area')
                this.setPTypeOnEditingChart(PTypeDef.STANDARD_5MIN_SINGLE);
            else if (type === 'line')
                this.setPTypeOnEditingChart(PTypeDef.STANDARD_5MIN_SINGLE);
            else if (type === 'line.runtime')
                this.setPTypeOnEditingChart(PTypeDef.REALTIME_LINE_SINGLE);
            else if (type === 'line.rightangle')
                this.setPTypeOnEditingChart(
                    PTypeDef.STANDARD_HOUR_YESTERDAY_TODAY
                );

            this.setPKeyOnEditingChart(undefined);
        },
    },
    watch: {
        async selectedMetrics() {
            if (this.selectedMetrics) {
                const accessData = await getAccessByMetrics(
                    'instance',
                    this.selectedMetrics
                );

                const [
                    canUseRealtimeData,
                    canUseStandardData,
                    canUseDomainData,
                ] = accessData.data;
                this.canUseRealtimeData = canUseRealtimeData;
                this.canUseStandardData = canUseStandardData;
                this.canUseDomainData = canUseDomainData;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
@import '../themes.scss';
.chart-box {
    @include themify($themes) {
        &.inactive {
            opacity: 0.5;
        }

        .chart-thumbnail {
            display: none;
            margin-right: 2px;
            margin-bottom: 6px;
            padding: 11px;
            border-radius: 3px;
            border: solid 1px themed('edit-chart-tab-thumbnail-border-color');
            cursor: pointer;

            &.show {
                display: inline-block;
            }

            > i {
                background-image: url('../../../../../style/aries.png');
                background-repeat: no-repeat;
                background-color: transparent;
                border: 0;
                width: 32px;
                height: 32px;
                display: block;

                &.column-daily {
                    background-position: -528px -338px;
                }

                &.line-runtime {
                    background-position: -496px -306px;
                }

                &.line {
                    background-position: -560px -306px;
                }

                &.line-rightangle {
                    background-position: -592px -306px;
                }

                &.equalizer {
                    background-position: -496px -338px;
                }

                &.area {
                    background-position: -560px -338px;
                }
            }

            > span {
                display: block;
                text-align: center;
            }

            &:hover {
                background-color: rgba(0, 0, 0, 0.05);
            }

            &.choose {
                border: 1px solid #8652ff;
            }
        }

        [data-tooltip-text]:hover {
            position: relative;
        }

        [data-tooltip-text]:hover:after {
            background-color: rgba(0, 0, 0, 0.88);
            border-radius: 3px;

            color: #ffffff;
            font-size: 10px;
            margin-bottom: 10px;
            padding: 7px;
            position: absolute;
            width: max-content;
            min-width: 50px;
            max-width: 300px;
            word-wrap: break-word;

            z-index: 9999;
            bottom: 48px;
            left: 50%;
            transform: translate(-50%, 0);
            opacity: 1;

            content: attr(data-tooltip-text);
        }
    }
}
</style>
