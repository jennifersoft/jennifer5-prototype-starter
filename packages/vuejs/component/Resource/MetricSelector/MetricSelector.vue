<template>
    <ListSelector
        ref="r"
        :tooltip-on-left="tooltipOnLeft"
        :title-label="metricsText"
        :list="metrics"
        :active-indexes="activeIndexes"
        @list-select="selectHandler"
    />
</template>

<script>
import ListSelector from '@vuejs/component/ListSelector/ListSelector.vue';

export default {
    components: {
        ListSelector,
    },
    inject: {
        metricsText: {
            default: 'Metrics', // ui.label.metrics
        },
    },
    props: {
        metrics: {
            type: Array,
            required: true,
        },
        activeIndexes: {
            type: Array,
            required: false,
        },
        tooltipOnLeft: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    methods: {
        unselectMetric() {
            this.$refs.r.unselectList();
        },
        selectHandler(m) {
            this.$emit('metricSelect', m);
        },
    },
};
</script>
