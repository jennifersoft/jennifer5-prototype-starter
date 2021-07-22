<template>
    <div class="app">
        <div class="head">
            <tool-bar></tool-bar>
        </div>
        <div class="body">
            <detail-table></detail-table>
        </div>
    </div>
</template>

<script>
import _ from '@library/lodash';
import { createNamespacedHelpers } from 'vuex';
import ToolBar from './container/ToolBar';
import DetailTable from './container/DetailTable';
import { mapState, mapMutations, mapActions } from './vuex';

const domainMap = createNamespacedHelpers('domain');

export default {
    components: {
        ToolBar,
        DetailTable,
    },
    computed: {
        ...domainMap.mapState({
            domainId: state => state.selectedOne.data.sid,
        }),
        ...mapState({}),
    },
    watch: {
        domainId(newVal, oldVal) {
            if (newVal === oldVal) return;
            this.reloadTargetConfig(newVal);
        },
    },
    data() {
        return {
            resizeHandler: null,
        };
    },
    methods: {
        ...mapMutations(['changeDomainId', 'resizePage']),
        ...mapActions(['loadTargetData', 'loadTopStackElements']),
        async reloadTargetConfig(domainId) {
            this.changeDomainId(domainId);
            await this.loadTargetData();
        },
    },
    async created() {
        this.resizeHandler = _.throttle(this.resizePage, 100);
        this.resizeHandler();

        await this.reloadTargetConfig(this.domainId);
        this.loadTopStackElements();
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
