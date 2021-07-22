<template>
    <div class="contents">
        <qb-top
            :active-schema="activeSchema"
            :schema-items="schemaItems"
            :width="contentsWidth"
            :height="editorHeight"
            :code="editorCode"
            @add-tab="(tab, code) => $emit('add-tab', tab, code)"
            @change="code => $emit('update-code', code)"
            @ready="() => $emit('ready-editor')"
        ></qb-top>

        <qb-tab
            :tab="activeOutput"
            @resize-height="onStartResizing"
            @change-tab="tab => $emit('change-output', tab)"
            @run-script="() => $emit('run-script')"
            @download-csv="onDownloadCsvFile"
        ></qb-tab>

        <qb-output
            :tab="activeOutput"
            :columns="outputColumns"
            :rows="outputRows"
            :messages="outputMessages"
            :width="contentsWidth"
            :height="outputHeight"
            :csv-name="csvName"
        ></qb-output>
    </div>
</template>

<script>
import QbTop from './qbTop';
import QbTab from './qbTab';
import QbOutput from './qbOutput';
import { mapState } from '../constant';
import { downloadCsv } from '@common/utility';

export default {
    components: {
        QbTop,
        QbTab,
        QbOutput,
    },
    props: {
        activeOutput: {
            type: String,
            required: true,
        },
        activeSchema: {
            type: Boolean,
            required: true,
        },
        editorCode: {
            type: String,
            required: true,
        },
        csvName: {
            type: String,
            required: true,
        },
    },
    computed: {
        ...mapState({
            outputColumns: state => state.columns,
            outputRows: state => state.rows,
            outputMessages: state => state.messages,
            schemaItems: state => state.schemas,
        }),
    },
    data() {
        const DEFAULT_HEIGHT = 300;

        return {
            editorHeight: DEFAULT_HEIGHT,
            contentsWidth: window.innerWidth,
            outputHeight: this.getOutputHeight(DEFAULT_HEIGHT),
        };
    },
    methods: {
        getOutputHeight(editorHeight) {
            // 헤더: 80, 에디터: 동적으로 변함
            return window.innerHeight - 80 - editorHeight;
        },
        onResizeWindow() {
            this.contentsWidth = window.innerWidth;
            this.outputHeight = this.getOutputHeight(this.editorHeight);
        },
        onStartResizing(e) {
            const splitter = this.$el;
            const startHeight = this.editorHeight;
            const startTop = e.y;

            const moveHandler = e2 => {
                const dist = e2.y - startTop;
                const topHeight = startHeight + dist;

                this.editorHeight = topHeight;
                this.outputHeight = this.getOutputHeight(topHeight);
                e2.preventDefault();
            };

            splitter.addEventListener('mousemove', moveHandler);
            splitter.addEventListener('mouseup', () =>
                splitter.removeEventListener('mousemove', moveHandler)
            );
        },
        onDownloadCsvFile() {
            const keys = this.outputColumns.map(col => col.key);
            const names = this.outputColumns.map(col => col.name);

            downloadCsv(this.csvName, {
                fields: keys,
                names: names,
                rows: this.outputRows,
            });
        },
    },
    beforeDestroy() {
        window.addEventListener('resize', this.onResizeWindow);
    },
    mounted() {
        window.addEventListener('resize', this.onResizeWindow);
    },
};
</script>

<style lang="scss" scoped></style>
