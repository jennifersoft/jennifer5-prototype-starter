<template>
    <div>
        <top-bar></top-bar>
        <tool-bar></tool-bar>
        <tab-bar @reload-table="increaseTableKey"></tab-bar>
        <table-bar></table-bar>
    </div>
</template>

<script>
import _ from '@library/lodash';
import TopBar from './container/TopBar';
import ToolBar from './container/ToolBar';
import TabBar from './container/TabBar';
import TableBar from './container/TableBar';
import { mapMutations, mapActions, xviewStoreHelper } from './vuex';

export default {
    inject: ['i18n'],
    components: {
        TopBar,
        ToolBar,
        TabBar,
        TableBar,
    },
    props: {
        defaultTab: {
            type: String,
            required: true,
        },
        domainIds: {
            type: Array,
            required: true,
        },
        instanceOids: {
            type: Array,
            required: true,
        },
        otype: {
            type: Number,
            required: true,
        },
        sourceDomainId: {
            type: Number,
            required: true,
        },
        sourceInstanceOid: {
            type: Number,
            required: true,
        },
        targetDomainId: {
            type: Number,
            required: true,
        },
        targetInstanceOid: {
            type: Number,
            required: true,
        },
        existReverse: {
            type: Boolean,
            required: true,
        },
        targetRemoteCallType: {
            type: Number,
            required: true,
        },
        targetCustomMethodDescHash: {
            type: Number,
            required: true,
        },
        targetIpAddress: {
            type: String,
            required: true,
        },
        targetPort: {
            type: Number,
            required: true,
        },
        sourceInfoList: {
            type: String,
            required: true,
        },
        targetInfoList: {
            type: String,
            required: true,
        },
        isIncoming: {
            type: Boolean,
            required: true,
        },
        isOutgoing: {
            type: Boolean,
            required: true,
        },
        isGroupNode: {
            type: Boolean,
            required: true,
        },
        isFromBatchJobDomain: {
            type: Boolean,
            required: true,
        },
        dataSourceName: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            tableKey: 1,
            resizeHandler: null,
        };
    },
    methods: {
        ...mapMutations([
            'loadParameters',
            'calculateTableHeight',
            'increaseTableKey',
        ]),
        ...mapActions(['loadScoreRanges', 'loadActiveServiceList']),
        ...xviewStoreHelper.mapMutations(['calculateMainSize']),
    },
    created() {
        this.resizeHandler = _.throttle(() => {
            this.calculateTableHeight();
            this.calculateMainSize();
        }, 100);

        this.resizeHandler();
    },
    async beforeMount() {
        this.loadParameters(this.$props);
        await this.loadScoreRanges();
        this.loadActiveServiceList();

        window.addEventListener('resize', this.resizeHandler);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeHandler);
    },
};
</script>

<style lang="scss" scoped></style>
