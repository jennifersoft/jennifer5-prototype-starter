<template>
    <div class="detail-code">
        <div class="top">
            <tab
                :tabs="tabs"
                :active-tab="activeTab"
                @change="onChangeTab"
            ></tab>
            <div class="layer">
                <btn
                    class="border-none"
                    normal
                    :items="[{ iconType: iconTypes.download }]"
                    :tooltip-options="{ message: i18n.download }"
                    @click.native="onClickDownloadBtn"
                ></btn>
                <btn
                    class="border-none"
                    normal
                    :items="[{ iconType: iconTypes.popup }]"
                    :tooltip-options="{ message: i18n.popup }"
                    @click.native="onClickPopupBtn"
                    v-if="usePopup"
                ></btn>
            </div>
        </div>
        <pre v-html="detailCode" :style="{ 'max-height': scrollHeight }"></pre>
    </div>
</template>

<script>
import Tab from '@vuejs/component/tab/Tab';
import Btn from '@vuejs/component/button/Btn';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { PermissionDef } from '@common/definition';
import { checkPermission } from '@common/utility';
import { UIManager } from '@common/legacy/UIManager';
import { mapState, mapActions } from '../store/loadedClasses';

export default {
    inject: ['i18n'],
    components: {
        Tab,
        Btn,
    },
    props: {
        maxHeight: {
            type: Number,
            required: false,
            default: -1,
        },
        usePopup: {
            type: Boolean,
            required: false,
            default: true,
        },
    },
    data() {
        return {
            tabs: [
                {
                    key: 'decompiledCode',
                    value: this.i18n.decompiledCode,
                    disabled: !checkPermission(PermissionDef.DECOMPILE_CODE),
                },
                {
                    key: 'classTypes',
                    value: this.i18n.classType,
                },
                {
                    key: 'disassembledCode',
                    value: this.i18n.disassembledCode,
                    disabled: !checkPermission(PermissionDef.DISASSEMBLE_CODE),
                },
            ],
            activeTab: checkPermission(PermissionDef.DECOMPILE_CODE)
                ? 'decompiledCode'
                : 'classTypes',
            iconTypes: {
                download: ICON_TYPE.arrowDownward,
                popup: ICON_TYPE.newWindow,
            },
        };
    },
    computed: {
        ...mapState({
            detailName: state => state.detailName,
            detailCode: state => state.detailCode,
            domainId: state => state.domainId,
            instanceOid: state => state.instanceOid,
        }),
        scrollHeight() {
            return this.maxHeight === -1 ? 'auto' : `${this.maxHeight}px`;
        },
    },
    watch: {
        detailName(newVal, oldVal) {
            if (newVal === oldVal) return;
            this.onChangeTab(this.activeTab);
        },
    },
    methods: {
        ...mapActions([
            'loadDisassembleCode',
            'loadClassTypeCode',
            'loadDecompileCode',
        ]),
        onChangeTab(tab) {
            if (tab === 'decompiledCode') this.loadDecompileCode();
            else if (tab === 'classTypes') this.loadClassTypeCode();
            else if (tab === 'disassembledCode') this.loadDisassembleCode();
            this.activeTab = tab;
        },
        onClickDownloadBtn() {
            const urlType =
                this.activeTab === 'decompiledCode'
                    ? 'downloadCode'
                    : 'downloadClass';
            location.href = `/${urlType}?sid=${this.domainId}&agent=${this.instanceOid}&clazz=${this.detailName}`;
        },
        onClickPopupBtn() {
            UIManager.popup(
                `/popup/loadedClasses?sid=${this.domainId}&agent=${this.instanceOid}&clazz=${this.detailName}`,
                1024,
                768
            );
        },
    },
};
</script>

<style lang="scss" scoped>
.detail-code {
    > .top {
        position: relative;
        > .layer {
            position: absolute;
            top: 5px;
            right: 0px;
        }
    }
    > pre {
        font-size: 12px;
        overflow: auto;
    }
}
</style>
