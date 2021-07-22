<template>
    <base-window
        class="table-service-top-n"
        :width="width"
        :height="height"
        :back-menu="backMenu"
        @home="onClickHomeBtn"
        @cancel="onClickCancelBtn"
        @apply="onClickSubmitBtn"
    >
        <template #subject>
            {{ i18n.table }} - {{ i18n.dbService }} ({{ i18n.topn }})
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

                <label-with-dropdown
                    class="last"
                    :label="i18n.service"
                    :items="serviceTypeList"
                    :selected-value="serviceType"
                    :width="150"
                    @change="onChangeServiceType"
                ></label-with-dropdown>
            </config-toolbar>

            <div class="search-condition">
                <oid-config
                    :check-manual-domain="checkManualDomain"
                    :resource-list="resourceList"
                    :resource-multi-select="true"
                    :resource-tab="'instance'"
                    :allow-resource-tabs="['instance']"
                    :active-group-data="groupData"
                    @change-resource="onChangeResourceGroupData"
                ></oid-config>
                <list-selector
                    @list-select="onChangeMetricsNodes"
                    :list="metricsMap[serviceType]"
                    :multi-select="false"
                    :title-label="i18n.metricsStandard"
                    :active-indexes="activeOrderFieldIndexes"
                ></list-selector>
                <list-selector
                    @check="onChangeAddMetricsNodes"
                    :list="metricsMap[serviceType]"
                    :multi-select="true"
                    :title-label="i18n.addColumns"
                    :active-indexes="activeColumnIndexes"
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
import {
    APPLICATION_FIELDS,
    SQL_TX_FIELDS,
    SERVICE_TYPES,
} from '../../../constant';
import FormatNumberInput from '@vuejs/component/Input/FormatNumberInput';
import ListSelector from '@vuejs/component/ListSelector/ListSelector';
import BaseWindow from '../../modal/BaseWindow';
import BuildConfigWindow from '../base/BuildConfigWindow';
import SearchConfigToolbar from '../base/ui/SearchConfigToolbar';
import ConfigToolbar from '../base/ui/ConfigToolbar';
import LabelWithDropdown from '../base/ui/LabelWithDropdown';
import OidConfig from '../base/ui/OidConfig';

const { mapState, mapMutations } = createNamespacedHelpers('template/modal');

export default {
    components: {
        FormatNumberInput,
        ListSelector,
        BaseWindow,
        BuildConfigWindow,
        SearchConfigToolbar,
        ConfigToolbar,
        LabelWithDropdown,
        OidConfig,
    },
    mixins: [BaseTable],
    props: {
        resourceList: {
            type: Array,
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
            topn: state => state.topn || 5,
            serviceType: state => state.serviceType || '1',
            orderFieldName: state => state.orderFieldName || '',
            columns: state => state.columns || [],
        }),
        activeOrderFieldIndexes() {
            const activeIndexes = [];
            this.metricsMap[this.serviceType].map((item, index) => {
                if (this.orderFieldName == item.value)
                    activeIndexes.push(index);
            });
            return activeIndexes;
        },
        activeColumnIndexes() {
            const activeIndexes = [];
            this.metricsMap[this.serviceType].map((item, index) => {
                if (this.columns.includes(item.value))
                    activeIndexes.push(index);
            });
            return activeIndexes;
        },
    },
    data() {
        return {
            serviceTypeList: SERVICE_TYPES,
            metricsMap: {
                '1': APPLICATION_FIELDS,
                '2': SQL_TX_FIELDS,
                '3': SQL_TX_FIELDS,
            },
            i18n: {
                menu: i18n.get('ui.label.menu'),
                dbService: i18n.get('ui.title.dbservice'),
                service: i18n.get('ui.label.service'),
                table: i18n.get('ui.label.table'),
                cancel: i18n.get('ui.button.cancel'),
                apply: i18n.get('ui.button.apply'),
                topn: i18n.get('ui.label.topn'),
                metricsStandard: i18n.get('ui.label.metrics.standard'),
                addColumns: i18n.get('ui.label.add.column.condition'),
                M0496: i18n.get('M0496'),
                M0014: i18n.get('M0014'),
                M0015: i18n.get('M0015'),
            },
            width: 1066,
            height: 488,
            showBuildConfig: false,
        };
    },
    methods: {
        ...mapMutations(['setDataImage']),
        beforeSubmit() {
            if (this.orderFieldName === '') {
                this.alert(this.i18n.M0496);
                return false;
            }

            if (this.columns.length === 0) {
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
                oidConfigMenu: 'instance',
                otype: OTypeDef.SYSTEM,
                topn: this.topn,
                serviceType: this.serviceType,
            });

            return true;
        },
        onChangeServiceType({ value }) {
            this.setDataImage({
                serviceType: value,
                orderFieldName: '',
                columns: [],
            });
        },
        onChangeResourceGroupData(groupData) {
            this.setDataImage({
                groupData: groupData,
            });
        },
        onChangeMetricsNodes({ value }) {
            this.setDataImage({
                orderFieldName: value,
            });
        },
        onChangeAddMetricsNodes(nodes) {
            this.setDataImage({
                columns: nodes.map(node => node.value),
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
.table-service-top-n {
    .config-toolbar,
    .search-condition {
        margin-top: 8px;
    }

    ::v-deep .label-with-dropdown.last {
        margin-left: 4px;
    }
    ::v-deep .list-selector-container {
        display: inline-block;
        width: 250px;
        height: 235px;
    }
}
</style>
