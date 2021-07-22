<template>
    <div class="condition-list" :style="rootStyle">
        <div class="item" v-for="item in items">
            <span :style="titleStyle" :title="item.title">{{
                item.title
            }}</span>
            <btn
                small
                :class="['border-none']"
                :items="[{ iconType: deleteIcon }]"
                :tooltip-options="{ message: deleteMessage }"
                @click="() => $emit('delete', item.key)"
            ></btn>
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { i18n } from '@common/utility';

export default {
    components: {
        Btn,
    },
    props: {
        width: {
            type: Number,
            required: false,
            default: -1,
        },
        items: {
            type: Array,
            required: true,
        },
    },
    computed: {
        rootStyle() {
            return {
                width: this.width === -1 ? '100%' : `${this.width}px`,
            };
        },
        titleStyle() {
            return {
                width:
                    this.width === -1
                        ? 'calc(100% - 50px)'
                        : `${this.width - 50}px`,
            };
        },
    },
    data() {
        return {
            deleteIcon: ICON_TYPE.close,
            deleteMessage: i18n.get('ui.button.delete'),
        };
    },
};
</script>

<style lang="scss" scoped>
@import '../../../../themes';

.condition-list {
    @include themify($themes) {
        display: inline-block;
        width: 100%;
        height: 100%;
        padding: 16px;
        border-radius: 3px;
        border: 1px solid themed('window-template-setting-side-border-color');
        overflow-y: auto;

        > .item {
            position: relative;
            padding: 10px 16px 6px 16px;
            margin-bottom: 4px;
            border-radius: 3px;
            border: 1px solid
                themed('window-template-setting-side-border-color');

            > span {
                display: inline-block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 12px;
                color: themed('common-font-color');
            }

            ::v-deep .aries-ui-btn {
                position: absolute;
                right: 8px;
                top: 6px;
            }
        }
    }
}
</style>
