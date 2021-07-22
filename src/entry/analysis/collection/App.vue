<template>
    <div class="collection-wrapper">
        <detail-window
            v-if="showDetailWindow"
            :data="selectedRow"
            title-key="nameWithType"
            @receive-again="onClickReceiveAgain"
            @open-popup="openStacktraceDetail"
            @close="showDetailWindow = false"
        />
        <top-bar @change="onChangeInstance" />

        <div class="main-contents">
            <navigation-bar :show-search-btn="false">
                <template #right>
                    <navigation-item>
                        <auto-refresh
                            :interval="5000"
                            @run="loadCollectionData"
                        />
                        <btn
                            :items="[{ text: i18n.deltaInit }]"
                            @click="onClickDeltaInit"
                        />
                    </navigation-item>
                </template>
            </navigation-bar>
            <collection-table
                :list="tableData"
                :height="tableHeight"
                :gc-permission="gcPermission"
                :agent-status="agentStatus"
                @receive-stack="receiveStacktrace"
                @show-stack="onClickShowStack"
            />
        </div>
    </div>
</template>

<script>
import _ from '@library/lodash';
import TopBar from '@vuejs/container/topbar/TopBar';
import NavigationBar from '@vuejs/component/NavigationBar/NavigationBar';
import NavigationItem from '@vuejs/component/NavigationBar/NavigationItem';
import Btn from '@vuejs/component/button/Btn';
import AutoRefresh from '@entry/popup/activeService/component/AutoRefresh';
import CollectionTable from '@entry/analysis/collection/container/CollectionTable';
import DetailWindow from '@entry/analysis/collection/component/DetailWindow';
import { mapState, mapMutations, mapActions } from './vuex';

const DEBOUNCE_DELAY = 300;
const TOP_PADDING = 285;

export default {
    name: 'App',
    components: {
        TopBar,
        NavigationBar,
        NavigationItem,
        Btn,
        AutoRefresh,
        CollectionTable,
        DetailWindow,
    },
    inject: {
        i18n: {
            default: () => ({
                deltaInit: 'Delta initialization',
            }),
        },
    },
    props: {
        gcPermission: {
            type: Boolean,
            required: true,
        },
    },
    computed: {
        ...mapState({
            tableData: state => state.tableData,
            selectedRow: state => state.selectedRow,
            agentStatus: state => state.agentStatus,
        }),
        onResizeDebounced() {
            return _.debounce(this.onResize, DEBOUNCE_DELAY);
        },
    },
    data() {
        return {
            tableHeight: window.innerHeight - TOP_PADDING,
            showDetailWindow: false,
        };
    },
    methods: {
        ...mapMutations([
            'updateDomain',
            'updateSelectedRow',
            'updateTmpColList',
        ]),
        ...mapActions([
            'checkAgentSupport',
            'loadCollectionData',
            'receiveStacktrace',
            'openStacktraceDetail',
        ]),
        async onChangeInstance(payload) {
            if (!payload) return;

            const { domainId, instanceOid } = payload;
            this.updateDomain({ sid: domainId, oid: instanceOid });
            this.updateTmpColList();

            await this.checkAgentSupport();
            this.loadCollectionData(true);
        },
        onResize() {
            this.tableHeight = window.innerHeight - TOP_PADDING;
        },
        onClickShowStack(data) {
            this.updateSelectedRow(data);
            this.showDetailWindow = true;
        },
        async onClickReceiveAgain() {
            await this.receiveStacktrace(this.selectedRow);
            this.showDetailWindow = false;
        },
        onClickDeltaInit() {
            this.updateTmpColList();
            this.loadCollectionData();
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
.collection-wrapper {
    .topbar {
        margin: 0 0 8px 0;
    }
    .aries-ui-navigation-bar {
        margin-bottom: 16px;
        .auto-refresh {
            margin-right: 8px;
        }
    }
    .main-contents {
        padding: 16px 24px 0;
    }
}
</style>
