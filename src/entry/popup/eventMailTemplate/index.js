import Vue from 'vue';
import { ariesuser } from '@common/base';
import { i18n } from '@common/utility';
import ConfirmWindow from '@vuejs/component/window/ConfirmWindow';
import Tab from '@vuejs/component/tab/Tab';
import Btn from '@vuejs/component/button/Btn';
import TemplateOutput from './templateOutput';
import './index.scss';

new Vue({
    el: '#app',
    components: {
        'monaco-editor': () =>
            import(
                /* webpackChunkName: "eventMailTemplate.editor" */ '@vuejs/component/MonacoEditor/MonacoEditor'
            ),
        TemplateOutput,
        Tab,
        Btn,
        ConfirmWindow,
    },
    data() {
        const DEFAULT_HEIGHT = 300;

        return {
            activeTab: 'custom',
            editorReadOnly: false,
            editorCode: '',
            editorTheme: ariesuser.theme == 'classic' ? 'vs' : 'vs-dark',
            outputCode: '',
            editorWidth: 0,
            editorHeight: DEFAULT_HEIGHT,
            outputHeight: this.getOutputHeight(DEFAULT_HEIGHT),
            alertMessage: '',
        };
    },
    methods: {
        getOutputHeight(editorHeight) {
            // 헤더: 37, 탭: 52, 에디터: 동적으로 변함
            return window.innerHeight - 37 - 52 - editorHeight;
        },
        onChangeEditorTab(activeTab) {
            this.activeTab = activeTab;
            this.editorCode = this.getEditorCode();
            this.editorReadOnly = this.activeTab == 'default';
        },
        onChangeEditorCode(code) {
            this.outputCode = code;
            if (this.activeTab == 'custom') this.$refs.newTpl.value = code;
        },
        onStartResizing(e) {
            const splitter = this.$el;
            const startHeight = this.editorHeight;
            const startTop = e.y;

            const moveHandler = e2 => {
                const dist = e2.y - startTop;
                this.editorHeight = startHeight + dist;
                this.outputHeight = this.getOutputHeight(this.editorHeight);
                e2.preventDefault();
            };

            splitter.addEventListener('mousemove', moveHandler);
            splitter.addEventListener('mouseup', () =>
                splitter.removeEventListener('mousemove', moveHandler)
            );
        },
        onReadyMonacoEditor() {
            this.editorCode = this.$refs.newTpl.value;
        },
        onReadyTemplateOutput() {
            this.outputCode = this.$refs.newTpl.value;
        },
        getEditorCode() {
            return this.activeTab == 'default'
                ? this.$refs.defTpl.value
                : this.$refs.newTpl.value;
        },
        saveEditorCode() {
            this.alertMessage = i18n.get(opener ? 'M0606' : 'M0607');
        },
        applyConfirm() {
            if (opener)
                opener.$('#mng_contentsFormat').val(this.getEditorCode());
            window.close();
        },
        resizeWindow() {
            this.editorWidth = window.innerWidth;
            this.outputHeight = this.getOutputHeight(this.editorHeight);
        },
    },
    beforeDestroy() {
        window.addEventListener('resize', this.resizeWindow);
    },
    mounted() {
        window.addEventListener('resize', this.resizeWindow);
    },
});
