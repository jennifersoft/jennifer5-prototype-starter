<template>
    <div class="app">
        <div class="layout-head">
            <top-bar
                :type="'agent'"
                :use-multi-domain="true"
                :use-multi-instance="false"
                :domain-ids="domainIds"
                :instance-oids="instanceOidKeys"
                @change="onDomainBarClick"
            ></top-bar>
        </div>
        <div class="layout-line"></div>
        <div class="layout-body">
            <tool-bar></tool-bar>
            <detail-table></detail-table>
        </div>
    </div>
</template>

<script>
import { OTypeDef } from '@common/definition';
import TopBar from '@vuejs/container/topbar/TopBar';
import ToolBar from './container/ToolBar';
import DetailTable from './container/DetailTable';
import { mapState, mapMutations, mapActions } from './vuex';

export default {
    components: {
        TopBar,
        ToolBar,
        DetailTable,
    },
    props: {
        domainId: {
            type: Number,
            required: true,
        },
        instanceOid: {
            type: Number,
            required: true,
        },
    },
    computed: {
        ...mapState({
            startDate: state => state.startDate,
            endDate: state => state.endDate,
            domainIds: state => state.domainIds,
            instanceOids: state => state.instanceOids,
            useDefault: state =>
                state.domainIds.length === 1 && state.instanceOids.length === 1,
        }),
        instanceOidKeys() {
            if (this.useDefault)
                return [
                    `/${this.domainIds[0]}/${OTypeDef.SYSTEM}/${this.instanceOids[0]}`,
                ];
            return [];
        },
    },
    methods: {
        ...mapMutations(['loadParameters', 'updateServiceDumpFiles']),
        ...mapActions(['loadServiceDumpFiles']),
        onDomainBarClick({ domainId, instanceOid }) {
            this.updateServiceDumpFiles([]);

            if (
                this.startDate.valueOf() < this.endDate.valueOf() &&
                (!this.domainIds.includes(domainId) ||
                    !this.instanceOids.includes(instanceOid))
            ) {
                this.loadParameters({ domainId, instanceOid });
                this.loadServiceDumpFiles();
            }
        },
    },
    beforeMount() {
        this.loadParameters(this.$props);
        if (this.useDefault) this.loadServiceDumpFiles();
    },
};
</script>

<style lang="scss" scoped>
.app {
    > .layout-body {
        position: fixed;
        padding: 24px;
        height: calc(100% - 148px);
        overflow-y: auto;
    }
}
</style>
