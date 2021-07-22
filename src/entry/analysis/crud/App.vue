<template>
    <div class="app">
        <div class="layout-head">
            <tool-bar></tool-bar>
        </div>
        <div class="layout-body">
            <detail-table></detail-table>
        </div>
    </div>
</template>

<script>
import _ from '@library/lodash';
import { createNamespacedHelpers } from 'vuex';
import ToolBar from './container/ToolBar';
import DetailTable from './container/DetailTable';
import { mapMutations, mapActions } from './vuex';

const domainMap = createNamespacedHelpers('domain');

export default {
    components: {
        ToolBar,
        DetailTable,
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
        ...mapMutations(['updateDomainId', 'calculateMainHeight']),
        ...mapActions(['loadTargetData']),
        reloadTargetData(domainId) {
            this.updateDomainId(domainId);
            this.loadTargetData();
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

    > .layout-body {
        margin-top: 16px;
    }
}
</style>
