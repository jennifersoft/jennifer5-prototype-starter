<template>
    <detail-window
        class="class-window"
        :top="windowTop"
        @cancel="() => $emit('cancel')"
    >
        <template #subject>
            <span>{{ className }}</span>
        </template>
        <template #contents>
            <tab
                small
                :tabs="tabList"
                :active-tab="activeTab"
                @change="onChangeTab"
            ></tab>

            <pre class="simple" v-html="activeSourceCode"></pre>
        </template>
    </detail-window>
</template>

<script>
import Tab from '@vuejs/component/tab/Tab';
import DetailWindow from '../component/DetailWindow';
import { server } from '@common/base';
import { checkPermission } from '@common/utility';
import { PermissionDef } from '@common/definition';
import { mapState as baseMapState } from '../store/base';
import { mapState, mapActions } from '../store/timeline';
import { CLASS_CODE_TYPES } from '../constant';

export default {
    inject: {
        i18n: {
            default: {
                decompileCode: 'Decompile code',
                classType: 'Class type',
                disassembleCode: 'Disassemble Code',
            },
        },
    },
    components: {
        Tab,
        DetailWindow,
    },
    props: {
        className: {
            type: String,
            required: true,
        },
    },
    computed: {
        ...baseMapState({
            windowTop: state => state.mainHeight - state.distHeight - 95,
            transactionRow: state => state.transactionRow,
        }),
        ...mapState({
            activeSourceCode: state => state.activeSourceCode,
        }),
        params() {
            return {
                domainId: this.transactionRow.sid,
                instanceOid: this.transactionRow.sysOid,
                className: this.className,
            };
        },
    },
    data() {
        const authDecompile =
            checkPermission(PermissionDef.DECOMPILE_CODE) &&
            server.platform == 'java';
        const authDisassemble = checkPermission(PermissionDef.DISASSEMBLE_CODE);

        return {
            tabList: [
                {
                    key: CLASS_CODE_TYPES.DECOMPILE,
                    value: this.i18n.decompileCode,
                    disabled: !authDecompile,
                },
                { key: CLASS_CODE_TYPES.CLASS, value: this.i18n.classType },
                {
                    key: CLASS_CODE_TYPES.DISASSEMBLE,
                    value: this.i18n.disassembleCode,
                    disabled: !authDisassemble,
                },
            ],
            activeTab: authDecompile
                ? CLASS_CODE_TYPES.DECOMPILE
                : CLASS_CODE_TYPES.CLASS,
        };
    },
    methods: {
        ...mapActions([
            'loadDecompileCode',
            'loadDisassembleCode',
            'loadClassType',
        ]),
        onChangeTab(tab) {
            if (tab === CLASS_CODE_TYPES.DECOMPILE)
                this.loadDecompileCode(this.params);
            else if (tab === CLASS_CODE_TYPES.DISASSEMBLE)
                this.loadDisassembleCode(this.params);
            else if (tab === CLASS_CODE_TYPES.CLASS)
                this.loadClassType(this.params);

            if (this.activeTab !== tab) this.activeTab = tab;
        },
    },
};
</script>

<style lang="scss">
.class-window {
    pre.simple {
        border: 0 !important;
        height: 290px !important;
    }
}
</style>
