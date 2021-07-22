<template>
    <window
        class="detail-con-window"
        :messages="i18n"
        :open-w="300"
        :open-x="openX"
        :open-y="openY"
        :draggable="false"
        animation-name="fade-down"
        @apply="apply"
        @cancel="cancel"
    >
        <template #subject>
            {{ i18n.targetSpecificCondition }}
        </template>
        <div class="detail-condition-content">
            <div class="switch-item">
                <span class="switch-item-label">{{ i18n.table }}</span>
                <toggle-switch v-model="tableValue" />
            </div>
            <div class="switch-item">
                <span class="switch-item-label">{{ i18n.chart }}</span>
                <toggle-switch v-model="chartValue" />
            </div>
            <list-selector
                style="margin-top: 24px;"
                ref="metricsListSelector"
                multi-select
                title-label="Metrics"
                :list="metricsList"
                @check="checkHandler"
            />
        </div>
    </window>
</template>

<script>
import { MxDef, OTypeDef } from '@common/definition';
import ListSelector from '@vuejs/component/ListSelector/ListSelector.vue';
import { i18n } from '@common/utility';
import { createNamespacedHelpers } from 'vuex';
import {
    COLUMN_CHART_METRICS,
    DEFAULT_CHECKED_METRICS,
    PAGE_TYPE,
} from '@entry/statistics/common/common';
import { loadMetrics } from '@entry/statistics/common/http';

import Window from '@vuejs/component/window/Window';
import ToggleSwitch from '@vuejs/component/Toggle/ToggleSwitch';
import clickOutside from '@vuejs/directive/clickOutside';

const { mapGetters, mapState, mapMutations } = createNamespacedHelpers(
    'statistics'
);

export default {
    name: 'detailConditionBox',
    inject: {
        pageType: {
            default: PAGE_TYPE.DAILY,
        },
        otype: {
            default: OTypeDef.SYSTEM,
        },
    },
    props: {
        openX: {
            type: Number,
            required: true,
        },
        openY: {
            type: Number,
            required: true,
        },
    },
    components: {
        Window,
        ToggleSwitch,
        ListSelector,
    },
    methods: {
        saveCondition() {
            const condition = {
                viewTable: this.tableValue,
                viewChart: this.chartValue,
                viewMetricsArray: this.checkedMetricsList,
            };

            this.configureDetailConditionByTarget(condition);
        },

        cancel() {
            this.clear();
            this.$emit('close');
        },
        apply() {
            this.saveCondition();
            this.$emit('apply');
        },

        checkHandler(list) {
            this.checkedMetricsList = list;
        },

        // onChangeViewTable(data) {
        //     this.tableValue = data.value;
        // },
        //
        // onChangeViewChart(data) {
        //     this.chartValue = data.value;
        // },

        async getMetrics() {
            const removeMxid =
                this.pageType === PAGE_TYPE.DAILY
                    ? MxDef.visit_day
                    : MxDef.visit_hour;
            const metricsData = await loadMetrics(this.otype);
            const list = metricsData.data;

            list.splice(
                list.findIndex(data => Number(data[1]) === removeMxid),
                1
            );

            this.metricsList = list.map(data => {
                return {
                    mxid: Number(data[1]),
                    type: COLUMN_CHART_METRICS.includes(Number(data[1]))
                        ? 'column'
                        : 'line',
                    label: i18n.get('ui.mx.' + data[0])
                        ? i18n.get('ui.mx.' + data[0])
                        : data[0],
                };
            });
        },

        emitDefaultMetrics() {
            DEFAULT_CHECKED_METRICS.forEach(mxid => {
                const index = this.metricsList.findIndex(
                    data => data.mxid === mxid
                );
                if (index > -1) {
                    this.$refs.metricsListSelector.listRowCheckHandler(index);
                }
            });
        },

        clear() {
            this.tableValue = this.detailConditionByTarget.viewTable;
            this.chartValue = this.detailConditionByTarget.viewChart;

            this.$refs.metricsListSelector.uncheckAll();

            //저장된 값을 가지고 선택하게 함.
            const savedMetricsValue = this.detailConditionByTarget.viewMetricsArray.map(
                data => data.mxid
            );
            this.metricsList.forEach((data, index) => {
                if (savedMetricsValue.includes(data.mxid)) {
                    this.$refs.metricsListSelector.listRowCheckHandler(index);
                }
            });
        },

        ...mapMutations(['configureDetailConditionByTarget']),
    },
    data() {
        return {
            // metricsList: (this.pageType === PAGE_TYPE.DAILY)? SEARCH_METRICS_ARRAY_IN_DAYLY: SEARCH_METRICS_ARRAY_IN_PERIOD,
            metricsList: [],
            // defaultCheckedIndexes: [0, 1, 2, 3, 4, 5, 26],
            defaultCheckedIndexes: [],
            checkedMetricsList: [],

            i18n: {
                targetSpecificCondition: i18n.get(
                    'ui.label.targetSpecificCondition'
                ),
                table: i18n.get('ui.label.table'),
                chart: i18n.get('ui.label.chart'),
                cancel: i18n.get('ui.button.cancel'),
                apply: i18n.get('ui.button.apply'),
            },
            tableButtons: [
                { icon: '', text: 'On', value: 'on', style: { width: '50px' } },
                {
                    icon: '',
                    text: 'Off',
                    value: 'off',
                    style: { width: '50px' },
                },
            ],
            chartButtons: [
                { icon: '', text: 'On', value: 'on', style: { width: '50px' } },
                {
                    icon: '',
                    text: 'Off',
                    value: 'off',
                    style: { width: '50px' },
                },
            ],
            tableValue: true,
            chartValue: false,
            PAGE_TYPE: PAGE_TYPE,
        };
    },
    computed: {
        ...mapState({
            detailConditionByTarget: 'detailConditionByTarget',
        }),
    },

    async mounted() {
        await this.getMetrics();
        this.emitDefaultMetrics();
        this.saveCondition();
    },
};
</script>
<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
.detail-con-window {
    @include themify($themes) {
        .switch-item {
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-sizing: border-box;
            border-top: 1px solid themed('border-color');
            &:not(:first-child) {
                border-bottom: 1px solid themed('border-color');
            }

            .switch-item-label {
                font-size: 14px;
                color: themed('typography-color-primary');
            }
        }
    }
}
</style>
