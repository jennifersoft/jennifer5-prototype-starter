<template>
    <div class="result">
        <tab :tabs="tabs" :active-tab="activeTab" @change="onChangeTab"></tab>
        <textarea readonly :style="textareaStyle" v-if="activeTab === 'plan'">{{
            outputPlan
        }}</textarea>
        <sql-editor
            :width="width"
            :height="height"
            :code="editorCode"
            v-else
        ></sql-editor>
    </div>
</template>

<script>
import Tab from '@vuejs/component/tab/Tab';
import SqlEditor from '../component/SqlEditor';
import { mapState } from '../vuex';

const PADDING = 5;

export default {
    inject: ['i18n'],
    components: {
        Tab,
        SqlEditor,
    },
    props: {
        width: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            activeTab: 'inline',
        };
    },
    computed: {
        ...mapState({
            height: state => state.mainHeight - PADDING,
            outputOrigin: state => state.outputOrigin,
            outputAll: state => state.outputAll,
            outputPlan: state => state.outputPlan,
            databaseName: state => state.databaseName,
        }),
        editorCode() {
            return this.activeTab === 'inline'
                ? this.outputOrigin
                : this.outputAll;
        },
        textareaStyle() {
            return {
                width: `${this.width - 32}px`,
                height: `${this.height - 31}px`,
            };
        },
        tabs() {
            return [
                { key: 'inline', value: this.i18n.outputSqlParam1 },
                { key: 'bound', value: this.i18n.outputSqlParam2 },
                {
                    key: 'plan',
                    value: this.i18n.analyzeSqlPlan,
                    disabled: this.databaseName === '',
                },
            ];
        },
    },
    methods: {
        onChangeTab(tab) {
            this.activeTab = tab;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@entry/popup/xviewAnalysis/style/PlainText.scss';

.result {
    --toolbar-height: 46px;
    height: calc(100% - var(--toolbar-height));

    @include plain-text;
}
</style>
