<template>
    <div class="app">
        <div class="head" v-show="!headerFold">
            <tool-bar @alert="onShowAlertMessage"></tool-bar>
            <chart-section @alert="onShowAlertMessage"></chart-section>
        </div>
        <div class="body">
            <tab-bar></tab-bar>
            <table-panel></table-panel>
        </div>
        <expand-window v-if="showExpandWindow"></expand-window>

        <alert-window
            :message="alertMessage"
            @cancel="() => (alertMessage = '')"
            v-if="alertMessage !== ''"
        ></alert-window>
    </div>
</template>

<script>
import _ from '@library/lodash';
import { createNamespacedHelpers } from 'vuex';
import AlertWindow from '@vuejs/component/window/AlertWindow';
import ToolBar from './container/ToolBar';
import ChartSection from './container/ChartSection';
import TabBar from './container/TabBar';
import TablePanel from './container/TablePanel';
import ExpandWindow from './container/ExpandWindow';
import { mapState, mapMutations, mapActions } from './vuex';

const domainMap = createNamespacedHelpers('domain');

export default {
    components: {
        TablePanel,
        ToolBar,
        ChartSection,
        TabBar,
        ExpandWindow,
        AlertWindow,
    },
    data() {
        return {
            resizeHandler: null,
            alertMessage: '',
        };
    },
    computed: {
        ...domainMap.mapGetters({
            domainIds: 'sidList',
        }),
        ...mapState({
            headerFold: state => state.headerFold,
            showExpandWindow: state =>
                state.expandName !== '' && state.expandHash !== -1,
        }),
    },
    watch: {
        domainIds(newVal) {
            this.reloadTargetData(newVal);
        },
    },
    methods: {
        ...mapMutations(['updateDomainIds', 'resizePage']),
        ...mapActions(['loadTargetData']),
        async reloadTargetData(domainIds) {
            this.updateDomainIds(domainIds);
            await this.loadTargetData();
        },
        onShowAlertMessage(message) {
            this.alertMessage = message;
        },
    },
    created() {
        this.resizeHandler = _.throttle(this.resizePage, 100);
        this.resizeHandler();
        this.reloadTargetData(this.domainIds);
    },
    mounted() {
        window.addEventListener('resize', this.resizeHandler);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeHandler);
    },
};
</script>

<style lang="scss" scoped>
.app {
    padding: 0px 24px;
    > .head {
        margin-top: 24px;
    }
    > .body {
        margin-top: 16px;
    }
}
</style>
