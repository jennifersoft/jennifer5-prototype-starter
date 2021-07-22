<template>
    <div>
        <textarea>{{ json }}</textarea>
    </div>
</template>

<script>
import graph from '@entry/template/edit/graph/main'

const builder = graph.include('editor.jui.chart.builder')

export default {
    props: {
        json: {
            type: String,
            required: true,
        },
    },
    mounted() {
        if (this.json != '') {
            builder(this.$el)
        }
    },
}
</script>

<style scoped>
textarea {
    display: none;
}
</style>
