<template>
    <div class="side-bar-notice-layer">
        <div class="layer-header">
            <span class="title">{{ i18n.information }}</span>
            <btn
                :items="[{ iconType: icons.close }]"
                class="transparent"
                style="margin: -6px 0;"
                @click="$emit('close')"
                normal
            />
        </div>
        <div class="notice-item-wrapper">
            <div class="division">{{ i18n.notice }}</div>
            <transition-group name="list">
                <notice-box
                    v-for="(item, i) in notices"
                    :key="item.uuid"
                    :data="item"
                    type="notice"
                />
            </transition-group>
            <div class="division">SYSTEM</div>
            <notice-box
                v-for="(item, i) in systemEvents"
                :data="item"
                :key="item.uuid"
                type="systemEvent"
            />
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import NoticeBox from '@layout/component/item/NoticeBox';

export default {
    name: 'NoticeLayer',
    components: {
        Btn,
        NoticeBox,
        SvgIcon,
    },
    inject: {
        i18n: {
            default: {
                information: 'Information',
                notice: 'Notice',
            },
        },
    },
    props: {
        notices: {
            type: Array,
            default: () => [],
            validator(list) {
                return list.every(e => 'subject' in e && 'uuid' in e);
            },
        },
        systemEvents: {
            type: Array,
            default: () => [],
            validator(list) {
                return list.every(e => 'subject' in e && 'uuid' in e);
            },
        },
    },
    created() {
        this.icons = {
            close: ICON_TYPE.close,
        };
    },
};
</script>

<style lang="scss" scoped>
@import '~@layout/style/layer-style.scss';
.side-bar-notice-layer {
    @include layer-style;
    > .notice-item-wrapper {
        .notice-box + .notice-box {
            margin-top: 10px;
        }
    }
}
</style>
