<template>
    <div>
        <chart-subject @sync-editor="onSyncEditor"></chart-subject>
        <chart-size @sync-editor="onSyncEditor"></chart-size>
        <chart-padding @sync-editor="onSyncEditor"></chart-padding>
        <chart-color @sync-editor="onSyncEditor"></chart-color>
        <chart-legend @sync-editor="onSyncEditor"></chart-legend>
    </div>
</template>

<script>
import methods from './mixin/methodsForUI'
import ChartSubject from './ui-editor/chartSubject'
import ChartSize from './ui-editor/chartSize'
import ChartPadding from './ui-editor/chartPadding'
import ChartColor from './ui-editor/chartColor'
import ChartLegend from './ui-editor/chartLegend'

export default {
    mixins: [methods],
    components: {
        ChartSubject,
        ChartSize,
        ChartPadding,
        ChartColor,
        ChartLegend,
    },
}
</script>

<style scoped></style>
