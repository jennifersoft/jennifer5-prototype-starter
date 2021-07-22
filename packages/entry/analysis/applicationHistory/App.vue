<template>
    <div class="app">
        <div class="layout-head">
            <tool-bar></tool-bar>
            <top-section></top-section>
        </div>
        <div class="layout-body">
            <table-panel></table-panel>
        </div>
    </div>
</template>

<script>
import _ from '@library/lodash';
import { createNamespacedHelpers } from 'vuex';
import ToolBar from './container/ToolBar';
import TopSection from './container/TopSection';
import TablePanel from './container/TablePanel';
import { mapMutations, mapActions } from './vuex';

const domainMap = createNamespacedHelpers('domain');

export default {
    components: {
        ToolBar,
        TopSection,
        TablePanel,
    },
    data() {
        return {
            resizeHandler: null,
        };
    },
    computed: {
        ...domainMap.mapState({
            domainId: state => {
                return state.selectedOne.data.sid;
            },
        }),
    },
    watch: {
        domainId(newVal) {
            this.reloadTargetData(newVal);
        },
    },
    methods: {
        ...mapMutations([
            'updateDomainId',
            'calculateMainHeight',
            'resetAllData',
            'updateFetching',
        ]),
        ...mapActions([
            'loadTargetData',
            'loadDeployCount',
            'loadDeployData',
            'loadResourceData',
        ]),
        async reloadTargetData(domainId) {
            this.updateFetching();
            this.updateDomainId(domainId);
            await this.loadTargetData();

            this.resetAllData();
            await this.loadDeployCount();
            await this.loadDeployData();
            await this.loadResourceData();
            this.updateFetching(false);
        },
    },
    created() {
        this.resizeHandler = _.throttle(this.calculateMainHeight, 100);
        this.resizeHandler();
        this.reloadTargetData(this.domainId);
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
    padding: 24px;

    .layout-body {
        margin-top: 20px;
    }
}
</style>
