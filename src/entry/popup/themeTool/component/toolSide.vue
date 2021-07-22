<template>
    <div class="tool-side">
        <side-tab
            v-if="codeType == 'all'"
            :active-tab="activeTab"
            @change-tab="onChangeTab"
        ></side-tab>

        <side-editor
            :width="getContentWidth()"
            :height="getContentHeight()"
            :code="activeCode"
            :active-tab="activeTab"
            @ready="onReadyEditor"
            v-show="useEditor"
        ></side-editor>
        <side-ui
            v-show="!useEditor"
            :width="getContentWidth()"
            :height="getContentHeight()"
            :active-tab="activeTab"
            @ready="onReadyEditor"
            @sync-editor="onSyncEditor"
        ></side-ui>
    </div>
</template>

<script>
import { mapState, mapMutations } from '../constant'
import SideTab from './toolSideTab'
import SideEditor from './toolSideEditor'
import SideUi from './toolSideUi'

export default {
    components: {
        SideTab,
        SideEditor,
        SideUi,
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
        codeType: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            activeCode: '',
        }
    },
    computed: {
        ...mapState({
            useEditor: state => state.useEditor,
            chartStyles: state => state.chartStyles,
            activeTab(state) {
                return this.codeType != 'all' ? this.codeType : state.activeTab
            },
        }),
    },
    methods: {
        ...mapMutations({
            changeActiveTab: 'changeActiveTab',
            updateEditorCode: 'updateEditorCode',
        }),
        onReadyEditor() {
            this.changeActiveTab(this.activeTab)
            this.activeCode = this.getActiveCode()
            this.updateEditorCode(this.activeCode)
        },
        onSyncEditor(code) {
            this.activeCode = code
        },
        onChangeTab(tab) {
            this.changeActiveTab(tab)
            this.activeCode = this.getActiveCode()
            this.updateEditorCode(this.activeCode)
        },
        getActiveCode() {
            return this.printPrettyJson(this.chartStyles[this.activeTab])
        },
        getContentWidth() {
            return this.width
        },
        getContentHeight() {
            return this.height + (this.codeType == 'all' ? -42 : 0)
        },
        printPrettyJson(code) {
            if (typeof code != 'object') return ''
            return JSON.stringify(code, null, 2)
        },
    },
}
</script>

<style lang="scss" scoped></style>
