<template>
    <base-window
        class="table-event-top-n"
        :width="width"
        :height="height"
        :back-menu="backMenu"
        @home="onClickHomeBtn"
        @cancel="onClickCancelBtn"
        @apply="onClickSubmitBtn"
    >
        <template #subject>
            {{ i18n.table }} - {{ i18n.event }} ({{ i18n.topn }})
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

            <event-config
                :check-manual-domain="checkManualDomain"
                :resource-list="resourceList"
                :resource-multi-select="true"
                :resource-tab="oidConfigMenu"
                :active-group-data="groupData"
                :active-event="errorTypes"
                :active-level="eventLevelList"
                @change-tab="onChangeResourceTab"
                @change-resource="onChangeResourceGroupData"
                @change-event="onChangeEvent"
                @change-level="onChangeLevel"
            ></event-config>

            <build-config-window
                :parent-key="'maxRow'"
                :parent-width="width"
                :parent-height="height"
                :maxRow="maxRow"
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
import EventConfig from '../base/ui/EventConfig';
import FormatNumberInput from '@vuejs/component/Input/FormatNumberInput';

const { mapState, mapMutations } = createNamespacedHelpers('template/modal');

export default {
    components: {
        BaseWindow,
        BuildConfigWindow,
        SearchConfigToolbar,
        ConfigToolbar,
        EventConfig,
        FormatNumberInput,
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
            oidConfigMenu: state => state.oidConfigMenu || 'domain',
            otype: state => state.otype || OTypeDef.SYSTEM,
            errorTypes: state => state.errorTypes || [],
            eventLevelList: state => state.eventLevelList || [],
            topn: state => state.topn || 5,
        }),
    },
    data() {
        return {
            i18n: {
                event: i18n.get('ui.title.event'),
                table: i18n.get('ui.label.table'),
                topn: i18n.get('ui.label.topn'),
                cancel: i18n.get('ui.button.cancel'),
                apply: i18n.get('ui.button.apply'),
                M0213: i18n.get('M0213'),
                M0015: i18n.get('M0015'),
                M0021: i18n.get('M0021'),
            },
            width: 966,
            height: 482,
            showBuildConfig: false,
        };
    },
    methods: {
        ...mapMutations(['setDataImage']),
        beforeSubmit() {
            if (
                this.errorTypes.length == 0 ||
                this.eventLevelList.length == 0
            ) {
                this.alert(this.i18n.M0021);
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
            });
        },
        onChangeResourceGroupData(groupData) {
            this.setDataImage({
                groupData: groupData,
            });
        },
        onChangeEvent(nodes) {
            this.setDataImage({
                errorTypes: nodes.map(node => node.value),
            });
        },
        onChangeLevel(nodes) {
            this.setDataImage({
                eventLevelList: nodes.map(node => node.value),
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
.table-event-top-n {
    .config-toolbar,
    .event-config {
        margin-top: 8px;
    }
}
</style>
