<template>
    <base-window
        class="table-metrics-compare-pivot"
        :width="width"
        :height="height"
        :back-menu="backMenu"
        @home="onClickHomeBtn"
        @cancel="onClickCancelBtn"
        @apply="onClickSubmitBtn"
    >
        <template #subject>
            {{ i18n.table }} - {{ i18n.dailyDomainInstance }} ({{
                i18n.searchDB
            }})
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

            <metrics-config
                :check-manual-domain="checkManualDomain"
                :resource-list="resourceList"
                :resource-multi-select="true"
                :resource-tab="oidConfigMenu"
                :metrics-map="metricsMap"
                :metrics-multi-select="true"
                :active-group-data="groupData"
                :active-metrics="metrics"
                @change-tab="onChangeResourceTab"
                @change-resource="onChangeResourceGroupData"
                @change-metrics="onChangeMetricsNodes"
            ></metrics-config>

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
import BaseWindow from '../../modal/BaseWindow';
import BuildConfigWindow from '../base/BuildConfigWindow';
import SearchConfigToolbar from '../base/ui/SearchConfigToolbar';
import ConfigToolbar from '../base/ui/ConfigToolbar';
import MetricsConfig from '../base/ui/MetricsConfig';

const { mapState, mapMutations } = createNamespacedHelpers('template/modal');

export default {
    components: {
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
            metrics: state => state.metrics || [],
        }),
    },
    data() {
        return {
            i18n: {
                menu: i18n.get('ui.label.menu'),
                dailyDomainInstance: i18n.get('ui.title.dailyDomainInstance'),
                table: i18n.get('ui.label.table'),
                searchDB: i18n.get('ui.label.search.db'),
                cancel: i18n.get('ui.button.cancel'),
                apply: i18n.get('ui.button.apply'),
                M0014: i18n.get('M0014'),
                M0015: i18n.get('M0015'),
            },
            width: 866,
            height: 444,
            showBuildConfig: false,
        };
    },
    methods: {
        ...mapMutations(['setDataImage']),
        beforeSubmit() {
            if (this.metrics.length == 0) {
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
                intervalInMinute: 1440,
                oidConfigMenu: this.oidConfigMenu,
                otype: this.otype,
            });

            return true;
        },
        onChangeResourceTab(tab) {
            this.setDataImage({
                oidConfigMenu: tab,
                otype: tab == 'business' ? OTypeDef.BUSINESS : OTypeDef.SYSTEM,
            });
        },
        onChangeResourceGroupData(groupData) {
            this.setDataImage({
                groupData: groupData,
            });
        },
        onChangeMetricsNodes(nodes) {
            this.setDataImage({
                metrics: nodes.map(node => node.value),
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
.table-metrics-compare-pivot {
    .config-toolbar,
    .metrics-config {
        margin-top: 8px;
    }
}
</style>
