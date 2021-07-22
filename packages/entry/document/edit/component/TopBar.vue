<template>
    <div class="top-bar">
        <div class="left">
            <btn
                normal
                :class="iconClasses"
                :items="[{ iconType: iconTypes.back }]"
                :tooltip-options="{
                    message: i18n.documentBox,
                    position: 'center-right',
                }"
                @click="onClickDocumentListLink"
            ></btn>
            <span class="title" v-show="false">{{ docTitle }}</span>
        </div>
        <div class="right">
            <btn
                normal
                :items="[{ text: i18n.save }]"
                @click="() => $emit('save', dirKey, docKey)"
            ></btn>

            <span class="blank"></span>

            <btn
                normal
                :class="iconClasses"
                :items="[{ iconType: iconTypes.delete }]"
                :tooltip-options="{
                    message: i18n.delete,
                    position: 'bottom-center',
                }"
                @click="() => $emit('delete', dirKey, docKey)"
            ></btn>

            <btn
                normal
                :class="iconClasses"
                :items="[{ iconType: iconTypes.print }]"
                :tooltip-options="{
                    message: i18n.print,
                    position: 'bottom-center',
                }"
                @click="() => $emit('print')"
            ></btn>

            <span class="line"></span>

            <btn
                normal
                :class="iconClasses"
                :items="[{ iconType: iconTypes.help }]"
                :tooltip-options="{
                    message: i18n.help,
                    position: 'bottom-right',
                }"
                @click="onClickDocumentHelpLink"
            ></btn>
        </div>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { i18n, hashManual } from '@common/utility';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import Btn from '@vuejs/component/button/Btn';

const {
    mapState,
    mapGetters,
    mapMutations,
    mapActions,
} = createNamespacedHelpers('template');

export default {
    components: {
        Btn,
    },
    props: {
        docKey: {
            type: String,
            required: true,
        },
        docTitle: {
            type: String,
            required: true,
        },
        dirKey: {
            type: String,
            required: false,
            default: '',
        },
        dirName: {
            type: String,
            required: false,
            default: '',
        },
    },
    data() {
        return {
            i18n: {
                documentBox: i18n.get('ui.label.document.box'),
                save: i18n.get('ui.button.save'),
                delete: i18n.get('ui.button.delete'),
                print: i18n.get('ui.label.print'),
                help: i18n.get('ui.label.help'),
            },
            iconClasses: ['border-none'],
            iconTypes: {
                back: ICON_TYPE.arrowBack,
                delete: ICON_TYPE.trashcan,
                print: ICON_TYPE.print,
                help: ICON_TYPE.help,
                export: ICON_TYPE.export,
            },
        };
    },
    methods: {
        onClickDocumentListLink() {
            if (this.dirKey !== '' && this.dirKey !== '*')
                location.href =
                    '/report/document/list?directoryKey=' + this.dirKey;
            else location.href = '/report/document/list';
        },
        onClickDocumentHelpLink() {
            hashManual('report_document_edit');
        },
    },
};
</script>

<style lang="scss" scoped>
.top-bar {
    @import '~@entry/template/edit/style/top-bar';
    @include top-bar;
}
</style>
