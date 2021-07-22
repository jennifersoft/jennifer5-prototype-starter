<template>
    <div class="metrics-config">
        <oid-config
            :check-manual-domain="checkManualDomain"
            :resource-tab="resourceTab"
            :resource-list="resourceList"
            :resource-multi-select="resourceMultiSelect"
            :active-group-data="activeGroupData"
            @change-tab="onChangeTab"
            @change-resource="data => $emit('change-resource', data)"
        ></oid-config>
        <list-selector
            @list-select="onSelectMetrics"
            @check="onChangeMetrics"
            :list="metricsMap[resourceTab]"
            :multi-select="metricsMultiSelect"
            :title-label="metricsTitle"
            :active-indexes="activeMetricsIndexes"
        ></list-selector>
    </div>
</template>
<script>
import { i18n } from '@common/utility';
import OidConfig from './OidConfig';
import ListSelector from '@vuejs/component/ListSelector/ListSelector';

export default {
    components: {
        ListSelector,
        OidConfig,
    },
    props: {
        checkManualDomain: {
            type: Boolean,
            required: false,
            default: false,
        },
        resourceList: {
            type: Array,
            required: true,
        },
        resourceMultiSelect: {
            type: Boolean,
            required: false,
            default: false,
        },
        resourceTab: {
            type: String,
            required: false,
            default: 'domain',
        },
        activeGroupData: {
            type: String,
            required: false,
            default: '',
        },

        metricsTitle: {
            type: String,
            required: false,
            default: i18n.get('ui.label.metrics'),
        },
        metricsMap: {
            type: Object,
            required: true,
        },
        metricsMultiSelect: {
            type: Boolean,
            required: false,
            default: false,
        },
        activeMetrics: {
            type: Array,
            required: false,
            default: () => [],
        },
    },
    computed: {
        activeMetricsIndexes() {
            const activeIndexes = [];

            const metricsList = this.metricsMap[this.resourceTab];
            if (metricsList) {
                metricsList.map((item, index) => {
                    if (this.activeMetrics.includes(item.value))
                        activeIndexes.push(index);
                });
            }

            return activeIndexes;
        },
    },
    methods: {
        onChangeTab(tab) {
            if (this.resourceTab !== tab) this.$emit('change-tab', tab);
        },
        onSelectMetrics(node) {
            this.$emit('change-metrics', [node]);
        },
        onChangeMetrics(checkedNodes) {
            this.$emit('change-metrics', checkedNodes);
        },
    },
};
</script>
<style lang="scss" scoped>
.metrics-config {
    display: inline-block;
    ::v-deep .list-selector-container {
        display: inline-block;
        width: 250px;
        height: 235px;
    }
}
</style>
