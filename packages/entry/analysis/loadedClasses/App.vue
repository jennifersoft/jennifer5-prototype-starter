<template>
    <div class="app">
        <div class="layout-head">
            <top-bar
                :type="'agent'"
                :use-multi-domain="true"
                :use-multi-instance="false"
                @change="onChangeTopBar"
            ></top-bar>
        </div>
        <div class="layout-body">
            <tool-bar></tool-bar>
            <detail-table></detail-table>
        </div>
    </div>
</template>

<script>
import _ from '@library/lodash';
import TopBar from '@vuejs/container/topbar/TopBar';
import ToolBar from './container/ToolBar';
import DetailTable from './container/DetailTable';
import { mapMutations } from './store/loadedClasses';
import {
    mapMutations as methodTreeMapMutations,
    mapActions as methodTreeMapActions,
} from './store/methodTree';

export default {
    components: {
        TopBar,
        ToolBar,
        DetailTable,
    },
    props: {
        className: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            resizeHandler: null,
        };
    },
    methods: {
        ...mapMutations([
            'updateClassName',
            'calculateMainHeight',
            'updateTargetData',
        ]),
        ...methodTreeMapMutations({
            updateTargetDataForMethodTree: 'updateTargetData',
        }),
        ...methodTreeMapActions(['loadMethodTreeNodes']),
        onChangeTopBar(target) {
            this.updateTargetData(target);
            this.updateTargetDataForMethodTree(target);
            this.loadMethodTreeNodes();
        },
    },
    created() {
        this.resizeHandler = _.throttle(this.calculateMainHeight, 100);
        this.resizeHandler();
    },
    beforeMount() {
        this.updateClassName(this.className);
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
    > .layout-body {
        padding: 24px 24px 12px;
    }
}
</style>
