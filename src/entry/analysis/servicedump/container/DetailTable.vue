<template>
    <div class="detail-table">
        <table-panel
            :domain-id="domainId"
            :dir-path="dirPath"
            :table-rows="tableRows"
            :memory-dump-loading="memoryDumpLoading"
            :dump-loading="dumpLoading"
            :delete-loading="deleteLoading"
            @delete="deleteServiceDumpFiles"
            @dump="createServiceDumpFile"
            @memory-dump="onClickMemoryDumpBtn"
        ></table-panel>
        <alert-window
            :message="alertMessage"
            @cancel="() => (alertMessage = '')"
            v-if="alertMessage !== ''"
        ></alert-window>
        <confirm-window
            :message="confirmMessage"
            @cancel="() => (confirmMessage = '')"
            @apply="onConfirmMemoryDump"
            v-if="confirmMessage !== ''"
        ></confirm-window>
    </div>
</template>

<script>
import ConfirmWindow from '@vuejs/component/window/ConfirmWindow';
import AlertWindow from '@vuejs/component/window/AlertWindow';
import TablePanel from '../component/TablePanel';
import { mapState, mapMutations, mapActions } from '../vuex';

export default {
    components: {
        TablePanel,
        ConfirmWindow,
        AlertWindow,
    },
    inject: ['i18n'],
    computed: {
        ...mapState({
            domainId: state => state.domainIds[0],
            memoryDumpLoading: state => state.memoryDumpLoading,
            dumpLoading: state => state.dumpLoading,
            deleteLoading: state => state.deleteLoading,
            tableRows: state => state.serviceDumpFiles || [],
        }),
        dirPath() {
            return this.tableRows.length > 0 ? this.tableRows[0].dir : '';
        },
    },
    data() {
        return {
            alertMessage: '',
            confirmMessage: '',
        };
    },
    methods: {
        ...mapMutations(['updateMemoryDumpLoading']),
        ...mapActions([
            'loadServiceDumpFiles',
            'createServiceDumpFile',
            'deleteServiceDumpFiles',
            'applyMemoryDump',
        ]),
        async onClickMemoryDumpBtn() {
            this.confirmMessage = this.i18n.M0485;
        },
        async onConfirmMemoryDump() {
            this.confirmMessage = '';
            this.alertMessage = this.i18n.M0486;

            this.updateMemoryDumpLoading(true);
            const { status } = await this.applyMemoryDump();

            if (status === 200) {
                setTimeout(async () => {
                    this.loadServiceDumpFiles();
                    this.updateMemoryDumpLoading(false);
                }, 30000);
            } else {
                this.updateMemoryDumpLoading(false);
            }
        },
    },
};
</script>

<style lang="scss" scoped></style>
