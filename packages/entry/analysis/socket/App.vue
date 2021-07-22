<template>
    <div class="socket-wrapper">
        <detail-window
            v-if="showDetailWindow"
            @show-stack="openStacktrace"
            @close="closeSocketDetail"
        />
        <div class="layout-head">
            <top-bar @change="onClickInstanceBar" />
        </div>
        <div class="layout-body">
            <navigation-bar style="margin-top: 8px;" :show-search-btn="false">
                <navigation-item class="field-group">
                    <input-field
                        :value="localPort"
                        :placeholder="i18n.localPort"
                        :width="144"
                        type="number"
                        @input="updateLocalPort"
                        @blur="onClickSearch"
                        small
                    />
                    <input-field
                        :value="remoteIpAddress"
                        :placeholder="i18n.remoteIpAddress"
                        :width="144"
                        @input="updateRemoteIpAddress"
                        @keydown.enter.native="onClickSearch"
                        small
                    />
                    <input-field
                        :value="remotePort"
                        :placeholder="i18n.remotePort"
                        :width="144"
                        type="number"
                        @input="updateRemotePort"
                        @blur="onClickSearch"
                        small
                    />
                </navigation-item>
                <template #right>
                    <auto-refresh :interval="5000" @run="onClickSearch(true)" />
                </template>
            </navigation-bar>

            <socket-table
                :list="tableData"
                :gc-permission="gcPermission"
                :agent-status="agentStatus"
                :height="tableHeight"
                @row-click="openSocketDetail"
                @remove-stack="removeStacktrace"
                @receive-stack-all="receiveStacktraceAll"
                @gc="gc"
            />
        </div>
    </div>
</template>

<script>
import _ from '@library/lodash';
import TopBar from '@vuejs/container/topbar/TopBar';
import NavigationBar from '@vuejs/component/NavigationBar/NavigationBar';
import NavigationItem from '@vuejs/component/NavigationBar/NavigationItem';
import InputField from '@vuejs/component/Input/InputField';
import AutoRefresh from '@entry/popup/activeService/component/AutoRefresh';
import SocketTable from '@entry/analysis/socket/container/SocketTable';
import DetailWindow from '@entry/analysis/socket/container/DetailWindow';
import { checkPermission } from '@common/utility';
import { PermissionDef } from '@common/definition';
import { mapState, mapMutations, mapActions } from './store';

const DEBOUNCE_DELAY = 300;
const TOP_PADDING = 281;

export default {
    name: 'App',
    inject: {
        i18n: {
            default: () => ({
                localPort: 'localPort',
                remoteIpAddress: 'remoteIpAddress',
                remotePort: 'remotePort',
                autoRefresh: 'autoRefresh',
                second: 'sec',
            }),
        },
    },
    components: {
        TopBar,
        NavigationBar,
        NavigationItem,
        InputField,
        AutoRefresh,
        SocketTable,
        DetailWindow,
    },
    computed: {
        ...mapState({
            domain: state => state.domain,
            tableData: state => state.tableData,
            agentStatus: state => state.agentStatus,
            localPort: ({ filters }) => filters.localPort,
            remoteIpAddress: ({ filters }) => filters.remoteIpAddress,
            remotePort: ({ filters }) => filters.remotePort,
        }),
        onResizeDebounced() {
            return _.debounce(this.onResize, this.DEBOUNCE_DELAY);
        },
    },
    data() {
        return {
            tableHeight: window.innerHeight - TOP_PADDING,
            showDetailWindow: false,
            showStacktraceWindow: false,
            selectedIndexCache: -1,
        };
    },
    methods: {
        ...mapMutations([
            'updateDomain',
            'updateLocalPort',
            'updateRemoteIpAddress',
            'updateRemotePort',
            'updateInnerTableData',
        ]),
        ...mapActions([
            'loadSocketData',
            'checkAgentSupport',
            'removeStacktrace',
            'receiveStacktraceAll',
            'gc',
        ]),
        onResize() {
            this.tableHeight = window.innerHeight - TOP_PADDING;
        },
        async onClickSearch(isAutoRefresh = false) {
            await this.loadSocketData(!isAutoRefresh);
        },
        async onClickInstanceBar({ domainId = null, instanceOid = null }) {
            this.closeSocketDetail();
            this.updateDomain({ domainId, instanceOid });
            await this.checkAgentSupport();
            await this.loadSocketData();
        },
        openSocketDetail({ data }) {
            const { key, children } = data;
            this.updateInnerTableData({
                key,
                data: children,
            });
            this.showDetailWindow = true;
        },
        closeSocketDetail() {
            if (this.showStacktraceWindow) return;
            this.showDetailWindow = false;
        },
        openStacktrace() {
            this.$emit('open-stacktrace');
        },
    },
    created() {
        this.DEBOUNCE_DELAY = DEBOUNCE_DELAY;
        this.gcPermission = checkPermission(PermissionDef.GC);
    },
    mounted() {
        window.addEventListener('resize', this.onResizeDebounced);
        this.loadSocketData();
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResizeDebounced);
    },
};
</script>

<style lang="scss" scoped>
.socket-wrapper {
    .layout-body {
        padding: 16px 24px 0;

        .field-group > * {
            margin-right: 8px;
        }
        .table-panel {
            margin-top: 16px;
        }
    }
}
</style>
