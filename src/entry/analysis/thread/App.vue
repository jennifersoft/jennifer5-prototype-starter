<template>
    <div class="thread-wrapper">
        <top-bar @change="onChangeInstance" />

        <div class="main-contents">
            <navigation-bar :show-search-btn="false">
                <template #right>
                    <auto-refresh :interval="5000" @run="loadThreadData" />
                    <btn
                        :items="[{ text: i18n.deltaInit }]"
                        @click="onClickDeltaInit"
                    />
                </template>
            </navigation-bar>
            <thread-table
                :list="tableData"
                :height="tableHeight"
                @row-click="onClickTableRow"
            />
            <stacktrace-window
                v-if="showStacktraceDetail"
                :data="stacktraceDetail"
                @close="showStacktraceDetail = false"
                @refresh="onClickRefreshStacktrace"
                @open-popup="onClickOpenPopup"
            />
        </div>
    </div>
</template>

<script>
import _ from '@library/lodash';
import TopBar from '@vuejs/container/topbar/TopBar';
import NavigationBar from '@vuejs/component/NavigationBar/NavigationBar';
import AutoRefresh from '@entry/popup/activeService/component/AutoRefresh';
import Btn from '@vuejs/component/button/Btn';
import ThreadTable from '@entry/analysis/thread/container/ThreadTable';
import StacktraceWindow from '@entry/analysis/thread/component/StacktraceWindow';
import { mapState, mapMutations, mapActions, mapGetters } from './vuex';

const TOP_PADDING = 284;

export default {
    name: 'App',
    components: {
        TopBar,
        NavigationBar,
        AutoRefresh,
        Btn,
        ThreadTable,
        StacktraceWindow,
    },
    inject: {
        i18n: {
            default: () => ({
                deltaInit: 'deltaInit',
            }),
        },
    },
    computed: {
        ...mapState({
            tmpColList: state => state.tmpColList,
            tableData: state => state.tableData,
            stacktraceDetail: state => state.stacktraceDetail,
        }),
        onResizeDebounced() {
            return _.debounce(this.onResize);
        },
    },
    watch: {
        showStacktraceDetail(next) {
            if (!next) {
                this.detailKeyCache = -1;
            }
        },
    },
    data() {
        return {
            tableHeight: window.innerHeight - TOP_PADDING,
            detailKeyCache: -1,
            showStacktraceDetail: false,
        };
    },
    methods: {
        ...mapMutations([
            'updateDomain',
            'updateTmpColList',
            'updateStacktraceDetail',
        ]),
        ...mapActions([
            'loadThreadData',
            'loadThreadStacktrace',
            'openDetailPopup',
        ]),
        onChangeInstance(payload) {
            if (!payload) return;
            if (this.showStacktraceDetail) this.showStacktraceDetail = false;
            const { domainId, instanceOid } = payload;
            this.updateDomain({ sid: domainId, oid: instanceOid });
            this.updateTmpColList();
            this.loadThreadData();
        },
        onResize() {
            this.tableHeight = window.innerHeight - TOP_PADDING;
        },
        async onClickTableRow(key) {
            await this.loadThreadStacktrace({ key });
            this.detailKeyCache = key;
            if (!!this.stacktraceDetail) {
                this.showStacktraceDetail = true;
            }
        },
        onClickDeltaInit() {
            this.updateTmpColList();
            this.loadThreadData();
        },
        onClickRefreshStacktrace() {
            this.loadThreadStacktrace({ key: this.detailKeyCache });
            if (!this.stacktraceDetail) {
                this.showStacktraceDetail = false;
            }
        },
        onClickOpenPopup() {
            this.openDetailPopup({ key: this.detailKeyCache });
        },
    },
    mounted() {
        window.addEventListener('resize', this.onResizeDebounced);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResizeDebounced);
    },
};
</script>

<style lang="scss" scoped>
.thread-wrapper {
    .aries-ui-navigation-bar {
        margin-bottom: 16px;
    }
    .main-contents {
        padding: 24px;
    }
}
</style>
