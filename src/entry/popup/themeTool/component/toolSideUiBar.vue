<template>
    <div>
        <chart-subject @sync-editor="onSyncEditor"></chart-subject>
        <chart-size @sync-editor="onSyncEditor"></chart-size>
        <chart-padding @sync-editor="onSyncEditor"></chart-padding>
        <chart-color @sync-editor="onSyncEditor"></chart-color>
        <chart-axis @sync-editor="onSyncEditor"></chart-axis>
        <chart-grid @sync-editor="onSyncEditor"></chart-grid>
    </div>
</template>

<script>
import methods from './mixin/methodsForUI'
import ChartSubject from './ui-editor/chartSubject'
import ChartSize from './ui-editor/chartSize'
import ChartPadding from './ui-editor/chartPadding'
import ChartColor from './ui-editor/chartColor'
import ChartAxis from './ui-editor/chartAxis'
import ChartGrid from './ui-editor/chartGrid'

export default {
    mixins: [methods],
    components: {
        ChartSubject,
        ChartSize,
        ChartPadding,
        ChartColor,
        ChartAxis,
        ChartGrid,
    },
}
</script>

<style scoped></style>
