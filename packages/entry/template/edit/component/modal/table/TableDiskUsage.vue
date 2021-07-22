<template>
    <base-window
        class="table-disk-usage"
        :width="width"
        :height="height"
        :back-menu="backMenu"
        @home="onClickHomeBtn"
        @cancel="onClickCancelBtn"
        @apply="onClickSubmitBtn"
    >
        <template #subject> {{ i18n.table }} - {{ i18n.dbdisk }} </template>
        <template #contents>
            <search-config-toolbar
                :max-row="maxRow"
                :domain-group-title="domainGroupTitle"
                :build-day="buildDay"
                :build-time="buildTime"
                :build-time-value="buildTimeValue"
                :run-time-value="runTimeValue"
                :check-manual-domain="true"
                :check-manual-day="checkManualDay"
                @show-config="() => (showBuildConfig = true)"
            ></search-config-toolbar>

            <div class="search-condition">
                <oid-config
                    :check-manual-domain="true"
                    :resource-list="resourceList"
                    :resource-multi-select="false"
                    :resource-tab="'instance'"
                    :allow-resource-tabs="['instance']"
                    :active-group-data="groupData"
                    @change-resource="onChangeResourceGroupData"
                ></oid-config>
                <list-selector
                    class="last"
                    @list-select="onSelectPartition"
                    :list="newPartitionList"
                    :multi-select="false"
                    :title-label="i18n.partition"
                    :active-indexes="activePartitionIndexes"
                ></list-selector>
            </div>

            <build-config-window
                :parent-key="'maxRow'"
                :parent-width="width"
                :parent-height="height"
                :max-row="maxRow"
                :check-manual-domain="true"
                :check-manual-domain-disabled="true"
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
import ListSelector from '@vuejs/component/ListSelector/ListSelector';
import BaseWindow from '../../modal/BaseWindow';
import BuildConfigWindow from '../base/BuildConfigWindow';
import SearchConfigToolbar from '../base/ui/SearchConfigToolbar';
import OidConfig from '../base/ui/OidConfig';

const { mapState, mapMutations } = createNamespacedHelpers('template/modal');

export default {
    components: {
        ListSelector,
        BaseWindow,
        BuildConfigWindow,
        SearchConfigToolbar,
        OidConfig,
    },
    mixins: [BaseTable],
    props: {
        resourceList: {
            type: Array,
            required: true,
        },
        partitionList: {
            type: Array,
            required: true,
        },
    },
    computed: {
        ...mapState({
            id: state => state.id,
            maxRow: state => state.maxRow,
            // checkManualDomain: state => state.checkManualDomain,
            checkManualDay: state => state.checkManualDay,
            buildTimeValue: state => state.buildTimeValue,
            runTimeValue: state => state.runTimeValue,

            groupData: state => state.groupData || '',
            partition: state => state.partition || '',
            savePartitionList: state => state.partitionList || [],
        }),
        newPartitionList() {
            let partitionList = this.partitionList;
            if (partitionList.length == 0)
                partitionList = this.savePartitionList || [];

            return partitionList.map(item => {
                return {
                    label: item,
                    value: item,
                    description: '',
                };
            });
        },
        activePartitionIndexes() {
            const activeIndexes = [];

            this.newPartitionList.map((item, index) => {
                if (this.partition == item.value) activeIndexes.push(index);
            });

            return activeIndexes;
        },
    },
    data() {
        return {
            i18n: {
                dbdisk: i18n.get('ui.title.dbdisk'),
                partition: i18n.get('ui.label.partition'),
                table: i18n.get('ui.label.table'),
                cancel: i18n.get('ui.button.cancel'),
                apply: i18n.get('ui.button.apply'),
                M0026: i18n.get('M0026'),
                M0567: i18n.get('M0567'),
            },
            width: 966,
            height: 442,
            showBuildConfig: false,
        };
    },
    methods: {
        ...mapMutations(['setDataImage']),
        beforeSubmit() {
            if (this.groupData === '') {
                this.alert(this.i18n.M0026);
                return false;
            }

            if (this.partition === '') {
                this.alert(this.i18n.M0567);
                return false;
            }

            this.setDataImage({
                type: 'table',
                oidConfigMenu: 'instance',
                otype: OTypeDef.SYSTEM,
                partitionList: this.partitionList,
            });

            return true;
        },
        onChangeResourceGroupData(groupData, node) {
            this.setDataImage({
                groupData: groupData,
                partition: '',
            });

            if (groupData === '') {
                this.$emit('update-partition-list');
            } else {
                this.$emit('update-partition-list', {
                    domainId: node.sid,
                    instanceId: node.instId,
                });
            }
        },
        onSelectPartition({ value }) {
            this.setDataImage({
                partition: value,
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
.table-disk-usage {
    .config-toolbar,
    .search-condition {
        margin-top: 8px;
    }

    ::v-deep .list-selector-container.last {
        display: inline-block;
        width: 435px;
        height: 235px;
    }
}
</style>
