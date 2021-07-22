<template>
    <base-window
        class="table-metrics-top-n"
        :width="width"
        :height="height"
        :back-menu="backMenu"
        @home="onClickHomeBtn"
        @cancel="onClickCancelBtn"
        @apply="onClickSubmitBtn"
    >
        <template #subject>
            {{ i18n.table }} - {{ i18n.dbMetrics }} ({{ i18n.topn }})
        </template>
        <template #contents>
            <search-config-toolbar
                :max-row="maxRow"
                :domain-group-title="domainGroupTitle"
                :build-day="buildDay"
                :build-time="buildTime"
                :build-time-value="buildTimeValue"
                :run-time-value="runTimeValue"
                :check-manual-domain="checkManualDomain"
                :check-manual-day="checkManualDay"
                @show-config="() => (showBuildConfig = true)"
            ></search-config-toolbar>

            <config-toolbar :is-chart="false">
                <format-number-input
                    small
                    :label="i18n.topn"
                    :value="topn"
                    :width="100"
                    :min="5"
                    :max="100"
                    :step="5"
                    @input="onChangeTopN"
                ></format-number-input>
            </config-toolbar>

            <div class="search-condition">
                <metrics-config
                    :check-manual-domain="checkManualDomain"
                    :resource-list="resourceList"
                    :resource-multi-select="true"
                    :resource-tab="oidConfigMenu"
                    :metrics-title="i18n.metricsStandard"
                    :metrics-map="metricsMap"
                    :metrics-multi-select="false"
                    :active-group-data="groupData"
                    :active-metrics="[metrics]"
                    @change-tab="onChangeResourceTab"
                    @change-resource="onChangeResourceGroupData"
                    @change-metrics="onChangeMetricsNodes"
                ></metrics-config>

                <list-selector
                    @check="onChangeAddMetricsNodes"
                    :list="metricsMap[oidConfigMenu]"
                    :multi-select="true"
                    :title-label="i18n.addColumns"
                    :active-indexes="activeMetricsIndexes"
                ></list-selector>
            </div>

            <build-config-window
                :parent-key="'maxRow'"
                :parent-width="width"
                :parent-height="height"
                :max-row="maxRow"
                :check-manual-domain="checkManualDomain"
                :check-manual-day="checkManualDay"
                :build-time-value="buildTimeValue"
                :run-time-value="runTimeValue"
                @cancel="() => (showBuildConfig = false)"
                @apply="onApplyBuildConfigWindow"
                v-if="showBuildConfig"
            ></build-config-window>
        </template>
    </base-window>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import { i18n } from '@common/utility';
import { OTypeDef } from '@common/definition';
import { BaseTable } from '../base/Base';
import FormatNumberInput from '@vuejs/component/Input/FormatNumberInput';
import ListSelector from '@vuejs/component/ListSelector/ListSelector';
import BaseWindow from '../../modal/BaseWindow';
import BuildConfigWindow from '../base/BuildConfigWindow';
import SearchConfigToolbar from '../base/ui/SearchConfigToolbar';
import ConfigToolbar from '../base/ui/ConfigToolbar';
import MetricsConfig from '../base/ui/MetricsConfig';

const { mapState, mapMutations } = createNamespacedHelpers('template/modal');

export default {
    components: {
        FormatNumberInput,
        ListSelector,
        BaseWindow,
        BuildConfigWindow,
        SearchConfigToolbar,
        ConfigToolbar,
        MetricsConfig,
    },
    mixins: [BaseTable],
    props: {
        resourceList: {
            type: Array,
            required: true,
        },
        metricsMap: {
            type: Object,
            required: true,
        },
    },
    computed: {
        ...mapState({
            id: state => state.id,
            maxRow: state => state.maxRow,
            checkManualDomain: state => state.checkManualDomain,
            checkManualDay: state => state.checkManualDay,
            buildTimeValue: state => state.buildTimeValue,
            runTimeValue: state => state.runTimeValue,

            groupData: state => state.groupData || '',
            oidConfigMenu: state => state.oidConfigMenu || 'domain',
            otype: state => state.otype || OTypeDef.SYSTEM,
            metrics: state => state.metrics || '',
            addMetrics: state => state.addMetrics || [],
            topn: state => state.topn || 5,
        }),
        activeMetricsIndexes() {
            const activeIndexes = [];
            this.metricsMap[this.oidConfigMenu].map((item, index) => {
                if (this.addMetrics.includes(item.value))
                    activeIndexes.push(index);
            });
            return activeIndexes;
        },
    },
    data() {
        return {
            i18n: {
                menu: i18n.get('ui.label.menu'),
                dbMetrics: i18n.get('ui.title.dbmetrics'),
                table: i18n.get('ui.label.table'),
                cancel: i18n.get('ui.button.cancel'),
                apply: i18n.get('ui.button.apply'),
                topn: i18n.get('ui.label.topn'),
                metricsStandard: i18n.get('ui.label.metrics.standard'),
                addColumns: i18n.get('ui.label.add.column.condition'),
                M0014: i18n.get('M0014'),
                M0015: i18n.get('M0015'),
                M0496: i18n.get('M0496'),
            },
            width: 1066,
            height: 488,
            showBuildConfig: false,
        };
    },
    methods: {
        ...mapMutations(['setDataImage']),
        beforeSubmit() {
            if (this.metrics === '') {
                this.alert(this.i18n.M0496);
                return false;
            }

            if (this.addMetrics.length === 0) {
                this.alert(this.i18n.M0014);
                return false;
            }

            if (
                this.checkManualDomain &&
                (this.groupData === '' || this.groupData === '{}')
            ) {
                this.alert(this.i18n.M0015);
                return false;
            }

            this.setDataImage({
                type: 'table',
                oidConfigMenu: this.oidConfigMenu,
                otype: this.otype,
                topn: this.topn,
            });

            return true;
        },
        onChangeResourceTab(tab) {
            this.setDataImage({
                oidConfigMenu: tab,
                otype: tab == 'business' ? OTypeDef.BUSINESS : OTypeDef.SYSTEM,
                metrics: '',
                addMetrics: [],
            });
        },
        onChangeResourceGroupData(groupData) {
            this.setDataImage({
                groupData: groupData,
            });
        },
        onChangeMetricsNodes(nodes) {
            this.setDataImage({
                metrics: nodes[0].value,
            });
        },
        onChangeAddMetricsNodes(nodes) {
            this.setDataImage({
                addMetrics: nodes.map(node => node.value),
            });
        },
        onChangeTopN(value) {
            this.setDataImage({
                topn: value,
            });
        },
        onApplyBuildConfigWindow(config) {
            this.setDataImage(config);
            this.showBuildConfig = false;
        },
    },
};
</script>
<style lang="scss" scoped>
.table-metrics-top-n {
    .config-toolbar,
    .search-condition {
        margin-top: 8px;
    }

    ::v-deep .list-selector-container {
        display: inline-block;
        width: 250px;
        height: 235px;
    }
}
</style>
