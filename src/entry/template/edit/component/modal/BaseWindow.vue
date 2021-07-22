<template>
    <window
        :class="['base-window', useFooter ? '' : 'hide-footer']"
        :messages="messages"
        :open-w="width"
        :open-h="height"
        :open-x="left"
        :open-y="top"
        :draggable="draggable"
        @cancel="() => $emit('cancel')"
        @apply="() => $emit('apply')"
    >
        <template #subject>
            <div
                class="back-menu"
                @click="onClickBackMenu"
                v-if="backMenu !== ''"
            >
                <btn
                    small
                    icon-first
                    :class="['border-none']"
                    :items="[{ iconType: backIcon, text: backTitle }]"
                ></btn>
            </div>
            <slot name="subject"></slot>
        </template>
        <slot name="contents"></slot>
    </window>
</template>

<script>
import Window from '@vuejs/component/window/Window';
import Btn from '@vuejs/component/button/Btn';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import messages from '@vuejs/component/messages';
import { i18n } from '@common/utility';

export default {
    components: {
        Btn,
        Window,
    },
    props: {
        draggable: {
            type: Boolean,
            required: false,
            default: true,
        },
        parentWidth: {
            type: Number,
            required: false,
            default: window.innerWidth,
        },
        parentHeight: {
            type: Number,
            required: false,
            default: window.innerHeight,
        },
        width: {
            type: Number,
            required: false,
            default: 610,
        },
        height: {
            type: Number,
            required: false,
            default: 440,
        },
        useFooter: {
            type: Boolean,
            required: false,
            default: true,
        },
        backMenu: {
            type: String,
            required: false,
            default: '',
            validator: val => {
                return ['ChartChoice', 'TableChoice', ''].includes(val);
            },
        },
    },
    data() {
        const TITLE_MAP = {
            ChartChoice: i18n.get('ui.label.chart'),
            TableChoice: i18n.get('ui.label.table'),
        };
        return {
            messages: messages,
            left: this.parentWidth / 2 - this.width / 2,
            top: this.parentHeight / 2 - this.height / 2,
            backIcon: ICON_TYPE.arrowBack,
            backTitle: TITLE_MAP[this.backMenu],
        };
    },
    methods: {
        onClickBackMenu() {
            this.$emit('home', this.backMenu);
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../../themes';

.base-window {
    @include themify($themes) {
        ::v-deep .body {
            padding: 24px !important;

            > .title {
                position: relative;
                font-size: 16px !important;
                font-weight: 500 !important;
                text-align: center;
                color: themed('window-title-font-color');

                > .back-menu {
                    position: absolute;
                    top: -6px;
                }
            }
        }

        &.hide-footer {
            ::v-deep .foot {
                display: none !important;
            }
        }
    }
}
</style>
