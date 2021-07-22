<template>
    <monaco-editor
        :language="'sql'"
        :theme="editorTheme"
        :width="width"
        :height="height"
        :code="code"
        :read-only="true"
        @ready="() => $emit('ready')"
    ></monaco-editor>
</template>

<script>
export default {
    inject: ['editorTheme'],
    components: {
        'monaco-editor': () =>
            import(
                /* webpackChunkName: "queryBuilder.editor" */ '@vuejs/component/MonacoEditor/MonacoEditor'
            ),
    },
    props: {
        width: {
            type: Number,
            required: false,
            default: 500,
        },
        height: {
            type: Number,
            required: false,
            default: 500,
        },
        code: {
            type: String,
            required: false,
            default: '',
        },
    },
};
</script>

<style lang="scss" scoped></style>
