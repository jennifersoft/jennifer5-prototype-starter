<template>
    <div class="tool-side-editor">
        <monaco-editor
            :language="'json'"
            :theme="editorTheme"
            :width="width"
            :height="height"
            :code="code"
            @change="onChangeEditorCode"
            @ready="() => $emit('ready')"
        ></monaco-editor>
    </div>
</template>

<script>
import { ariesuser } from '@common/base'
import methods from './mixin/methods';

export default {
    mixins: [ methods ],
    components: {
        'monaco-editor': () =>
            import(
                /* webpackChunkName: "themeTool.editor" */ '@vuejs/component/MonacoEditor/MonacoEditor'
            ),
    },
    props: {
        width: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        activeTab: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            editorTheme: ariesuser.theme == 'classic' ? 'vs' : 'vs-dark',
        }
    }
}
</script>

<style lang="scss" scoped></style>
