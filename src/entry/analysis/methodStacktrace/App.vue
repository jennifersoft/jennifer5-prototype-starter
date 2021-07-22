<template>
    <div class="method-stacktrace-wrapper">
        <top-bar @change="onChangeInstance" />

        <div class="main-contents">
            <navigation-bar :show-search-btn="false">
                <template #right>
                    <auto-refresh
                        :interval="5000"
                        paused
                        @run="loadMethodStacktraceData"
                    />
                </template>
            </navigation-bar>
            <method-stacktrace-table
                :list="tableData"
                :height="tableHeight"
                @show-stack="onClickShowStacktrace"
                @receive-stack="receiveStacktrace"
                @remove-stack="removeStacktrace"
            />
        </div>

        <detail-window
            v-if="showDetailPopup"
            :data="stacktraceData"
            @close="showDetailPopup = false"
            @open-popup="openStacktracePopup(stacktraceData)"
            @receive-again="onClickReceiveAgain"
        />
    </div>
</template>

<script>
import _ from '@library/lodash';
import TopBar from '@vuejs/container/topbar/TopBar';
import NavigationBar from '@vuejs/component/NavigationBar/NavigationBar';
import AutoRefresh from '@entry/popup/activeService/component/AutoRefresh';
import MethodStacktraceTable from '@entry/analysis/methodStacktrace/container/MethodStacktraceTable';
import DetailWindow from '@entry/analysis/collection/component/DetailWindow';

import {
    mapState,
    mapMutations,
    mapActions,
    mapMethodTreeMutations,
} from './vuex';

const DEBOUNCE_DELAY = 300;
const TOP_PADDING = 282;

export default {
    name: 'App',
    components: {
        TopBar,
        NavigationBar,
        AutoRefresh,
        MethodStacktraceTable,
        DetailWindow,
    },
    inject: {
        i18n: {
            default: () => ({
                autoRefresh: 'autoRefresh',
                second: 'sec',
            }),
        },
    },
    data() {
        return {
            tableHeight: window.innerHeight - TOP_PADDING,
            showDetailPopup: false,
        };
    },
    watch: {
        showDetailPopup(opened) {
            if (!opened) {
                this.updateSelectedRow();
            }
        },
    },
    computed: {
        ...mapState({
            tableData: state => state.tableData,
            stacktraceData: state => state.selectedRow,
        }),
        onResizeDebounced() {
            return _.debounce(this.onResize, DEBOUNCE_DELAY);
        },
    },
    methods: {
        ...mapMutations(['updateDomain', 'updateSelectedRow']),
        ...mapActions([
            'loadMethodStacktraceData',
            'receiveStacktrace',
            'removeStacktrace',
            'openStacktracePopup',
        ]),
        ...mapMethodTreeMutations(['updateTargetData']),
        onChangeInstance(info = null) {
            const domainId = info ? info.domainId : -1;
            const instanceOid = info ? info.instanceOid : -1;
            this.updateDomain({ sid: domainId, oid: instanceOid });
            this.loadMethodStacktraceData();
            this.updateTargetData({ domainId, instanceOid });
        },
        onResize() {
            this.tableHeight = window.innerHeight - TOP_PADDING;
        },
        onClickShowStacktrace(rowData) {
            this.updateSelectedRow(rowData);
            if (!!this.stacktraceData) this.showDetailPopup = true;
        },
        onClickReceiveAgain() {
            this.showDetailPopup = false;
            this.receiveStacktrace({ key: this.stacktraceData.key });
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
.method-stacktrace-wrapper {
    .aries-ui-navigation-bar {
        margin-bottom: 16px;
    }
    .main-contents {
        padding: 24px 24px 0;
    }
}
</style>
