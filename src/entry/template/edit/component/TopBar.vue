<template>
    <div class="top-bar">
        <div class="left">
            <btn
                normal
                :class="iconClasses"
                :items="[{ iconType: iconTypes.back }]"
                :tooltip-options="{
                    message: i18n.templateBox,
                    position: 'center-right',
                }"
                @click="() => $emit('go-list')"
            ></btn>

            <span class="title">{{ docTitle }}</span>
        </div>
        <div class="right">
            <btn
                normal
                :loading="buildLoading"
                :items="[{ text: i18n.templateBuild }]"
                @click="() => $emit('build')"
                v-if="docKey"
            ></btn>
            <btn
                normal
                :loading="saveLoading"
                :items="[{ text: i18n.save }]"
                @click="() => $emit('save')"
            ></btn>

            <span class="blank"></span>

            <btn
                normal
                :class="iconClasses"
                :items="[{ iconType: iconTypes.settings }]"
                :tooltip-options="{
                    message: i18n.settings,
                    position: 'bottom-center',
                }"
                @click="() => $emit('toggle-setting')"
            ></btn>
            <btn
                normal
                :class="iconClasses"
                :items="[{ iconType: iconTypes.export }]"
                :tooltip-options="{
                    message: i18n.export,
                    position: 'bottom-center',
                }"
                @click="onClickExportTemplate"
                v-if="docKey"
            ></btn>
            <btn
                normal
                :class="iconClasses"
                :items="[{ iconType: iconTypes.delete }]"
                :tooltip-options="{
                    message: i18n.delete,
                    position: 'bottom-center',
                }"
                @click="showDeleteTemplateConfirm"
                v-if="docKey"
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
                @click="onClickTemplateHelpLink"
            ></btn>
        </div>

        <confirm-window
            :message="confirmMessage"
            @cancel="() => (confirmMessage = '')"
            @apply="applyDeleteTemplateConfirm"
            v-if="confirmMessage !== ''"
        ></confirm-window>
    </div>
</template>

<script>
import $ from '@library/jquery';
import { createNamespacedHelpers } from 'vuex';
import { i18n, hashManual } from '@common/utility';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import Btn from '@vuejs/component/button/Btn';
import ConfirmWindow from '@vuejs/component/window/ConfirmWindow';

const {
    mapState,
    mapGetters,
    mapMutations,
    mapActions,
} = createNamespacedHelpers('template');

export default {
    components: {
        Btn,
        ConfirmWindow,
    },
    props: {
        buildLoading: {
            type: Boolean,
            required: true,
        },
        saveLoading: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            i18n: {
                templateBox: i18n.get('ui.label.template.box'),
                templateBuild: i18n.get('ui.label.template.build'),
                save: i18n.get('ui.button.save'),
                export: i18n.get('ui.button.export'),
                delete: i18n.get('ui.button.delete'),
                help: i18n.get('ui.label.help'),
                settings: i18n.get('ui.label.template.conf'),
                M0011: i18n.get('M0011'),
            },
            iconClasses: ['border-none'],
            iconTypes: {
                back: ICON_TYPE.arrowBack,
                delete: ICON_TYPE.trashcan,
                print: ICON_TYPE.print,
                help: ICON_TYPE.help,
                export: ICON_TYPE.arrowDownward,
                settings: ICON_TYPE.settings,
            },
            confirmMessage: '',
        };
    },
    computed: {
        ...mapState({
            docTitle: state => state.title,
            docKey: state => state.key,
        }),
    },
    methods: {
        showDeleteTemplateConfirm() {
            this.confirmMessage = this.i18n.M0011;
        },
        applyDeleteTemplateConfirm() {
            if (this.docKey === '') {
                this.$emit('go-list');
            } else {
                $.post(
                    '/template/document/delete',
                    { key: this.docKey },
                    () => {
                        this.$emit('go-list');
                    }
                );
            }
        },
        onClickExportTemplate() {
            location.href = '/template/document/export?key=' + this.docKey;
        },
        onClickTemplateHelpLink() {
            hashManual('report_template_edit');
        },
    },
};
</script>

<style lang="scss" scoped>
.top-bar {
    @import '../style/top-bar';
    @include top-bar;

    ::v-deep .confirm-window {
        .message {
            line-height: 20px;
        }
    }
}
</style>
