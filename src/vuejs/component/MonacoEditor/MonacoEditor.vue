<template>
    <div
        class="editor"
        :style="{
            width: !width ? '100%' : width + 'px',
            height: height + 'px',
        }"
    >
        <div ref="editor" style="width: 100%; height: 100%;"></div>
    </div>
</template>

<script>
import * as monaco from 'monaco-editor';

self.MonacoEnvironment = {
    getWorkerUrl: function(moduleId, label) {
        if (label === 'json') {
            return '/bundles/json.worker.js';
        }
        // if (label === 'css') {
        //     return '/bundles/css.worker.js';
        // }
        if (label === 'html') {
            return '/bundles/html.worker.js';
        }
        // if (label === 'typescript' || label === 'javascript') {
        //     return '/bundles/ts.worker.js';
        // }
        return '/bundles/editor.worker.js';
    },
};

export default {
    props: {
        language: {
            type: String,
            required: false,
            default: 'html',
        },
        theme: {
            type: String,
            required: false,
            default: 'vs',
        },
        code: {
            type: String,
            required: false,
            default: '',
        },
        width: {
            type: Number,
            required: false,
            default: 0,
        },
        height: {
            type: Number,
            required: false,
            default: 300,
        },
        readOnly: {
            type: Boolean,
            required: false,
            default: false,
        },
        useMinimap: {
            type: Boolean,
            required: false,
            default: true,
        },
    },
    watch: {
        code(newVal) {
            this.editor.getModel().setValue(newVal);
        },
        width() {
            // TODO: watch가 먼저 실행되고 style이 변경되서 setTimeout을 사용함.
            setTimeout(() => this.editor.layout(), 100);
        },
        height() {
            // TODO: 위와 동일. watch 실행 후, 스타일을 변경함.
            setTimeout(() => this.editor.layout(), 100);
        },
        readOnly(newVal) {
            this.editor.updateOptions({ readOnly: newVal });
        },
    },
    mounted() {
        this.editor = monaco.editor.create(this.$refs.editor, {
            language: this.language,
            readOnly: this.readOnly,
            theme: this.theme,
            value: this.code,
            contextmenu: false,
            wordBasedSuggestions: this.language != 'plaintext',
            minimap: {
                enabled: this.useMinimap,
            },
        });

        this.editor.getModel().onDidChangeContent(() => {
            this.$emit('change', this.editor.getModel().getValue());
        });

        this.$emit('ready');
    },
};
</script>

<style scoped>
.editor {
    padding-bottom: 5px;
}
</style>
