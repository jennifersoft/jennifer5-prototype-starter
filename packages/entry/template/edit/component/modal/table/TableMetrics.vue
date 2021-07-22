<template>
    <base-window
        class="table-metrics"
        :width="width"
        :height="height"
        :back-menu="backMenu"
        @home="onClickHomeBtn"
        @cancel="onClickCancelBtn"
        @apply="onClickSubmitBtn"
    >
        <template #subject>
            {{ i18n.table }} - {{ i18n.dbMetrics }} ({{ i18n.searchDB }})
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
                <label-with-dropdown
                    :label="i18n.interval"
                    :items="intervalList"
                    :selected-value="intervalInMinute"
                    :width="100"
                    @change="onChangeInterval"
                ></label-with-dropdown>
                <checkbox
                    :label="i18n.showStartTime"
                    :active="showStartTime"
                    @change="onChangeShowStartTime"
                ></checkbox>
            </config-toolbar>

            <search-condition
                :check-manual-domain="checkManualDomain"
                :resource-list="resourceList"
                :resource-multi-select="true"
                :metrics-map="metricsMap"
                :metrics-multi-select="false"
            ></search-condition>

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
import { BaseTable } from '../base/Base';
import Checkbox from '@vuejs/component/Toggle/Checkbox';
import BaseWindow from '../../modal/BaseWindow';
import BuildConfigWindow from '../base/BuildConfigWindow';
import SearchConfigToolbar from '../base/ui/SearchConfigToolbar';
import ConfigToolbar from '../base/ui/ConfigToolbar';
import LabelWithDropdown from '../base/ui/LabelWithDropdown';
import SearchCondition from '../base/SearchCondition';
import { INTERVALS } from '../../../constant';

const { mapState, mapMutations } = createNamespacedHelpers('template/modal');

export default {
    components: {
        Checkbox,
        BaseWindow,
        BuildConfigWindow,
        SearchConfigToolbar,
        ConfigToolbar,
        LabelWithDropdown,
        SearchCondition,
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

            intervalInMinute: state => state.intervalInMinute || '60',
            showStartTime: state => state.showStartTime || false,
            request: state => state.request || [],
        }),
    },
    data() {
        return {
            i18n: {
                menu: i18n.get('ui.label.menu'),
                dbMetrics: i18n.get('ui.title.dbmetrics'),
                table: i18n.get('ui.label.table'),
                searchDB: i18n.get('ui.label.search.db'),
                cancel: i18n.get('ui.button.cancel'),
                apply: i18n.get('ui.button.apply'),
                showStartTime: i18n.get('ui.label.showStartTime'),
                interval: i18n.get('ui.label.gatheringInterval'),
                M0021: i18n.get('M0021'),
                M0260: i18n.get('M0260'),
            },
            width: 1066,
            height: 488,
            showBuildConfig: false,
            intervalList: INTERVALS,
        };
    },
    methods: {
        ...mapMutations(['setDataImage']),
        beforeSubmit() {
            if (this.request.length == 0) {
                this.alert(this.i18n.M0021);
                return false;
            }

            this.setDataImage({
                type: 'table',
                intervalInMinute: this.intervalInMinute,
                showStartTime: this.showStartTime,
            });

            return true;
        },
        onChangeInterval({ value }) {
            this.setDataImage({ intervalInMinute: value });
        },
        onChangeShowStartTime(active) {
            this.setDataImage({ showStartTime: active });
        },
        onResetRequest() {
            this.alert(this.i18n.M0260);
            this.setDataImage({ request: [] });
        },
        onApplyBuildConfigWindow(config) {
            if (config.checkManualDomain !== this.checkManualDomain)
                this.onResetRequest();

            this.setDataImage(config);
            this.showBuildConfig = false;
        },
    },
};
</script>
<style lang="scss" scoped>
.table-metrics {
    .config-toolbar,
    .search-condition {
        margin-top: 8px;
    }

    ::v-deep .aries-checkbox-wrapper {
        margin-left: 16px;
    }
}
</style>
