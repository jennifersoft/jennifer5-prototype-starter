<template>
    <div>
        <dropdown
            :items="typeList"
            :selected-value="editingChartOptions.metricsFromJenniferFront"
            @onchange="onClickType"
            style="width: 100%;"
        />
    </div>
</template>

<script>
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import { createNamespacedHelpers } from 'vuex';

const { mapGetters, mapState, mapMutations } = createNamespacedHelpers(
    'userdefine'
);

export default {
    name: 'jenniferFrontSelector',
    components: {
        Dropdown,
    },
    data: function() {
        return {
            typeList: [
                {
                    text: i18n.get('ui.front.chart.pageLoadTime'),
                    value: 'page-load-time',
                },
                {
                    text: i18n.get(
                        'ui.front.chart.resourceDownloadTimePerHost'
                    ),
                    value: 'resource-download-time',
                },
                {
                    text: i18n.get('ui.front.chart.jsErrorCount'),
                    value: 'js-error-count',
                },
            ],
        };
    },
    methods: {
        ...mapMutations(['setMetricsFromJenniferFrontOnEditingChart']),

        onClickType(item) {
            this.setMetricsFromJenniferFrontOnEditingChart(item.value);
        },
    },
    computed: {
        ...mapState(['editingChartOptions']),

        metrics() {
            return this.editingChartOptions.metricsFromJenniferFront
                ? this.editingChartOptions.metricsFromJenniferFront
                : this.typeList[0].value;
        },
    },
};
</script>
<style scoped></style>
