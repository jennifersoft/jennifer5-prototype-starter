<template>
    <div class="message-bar">
        <span>
            <svg-icon
                :icon-type="iconType"
                :width="iconSize"
                :height="iconSize"
            ></svg-icon>
        </span>
        <span>{{ message }}</span>
    </div>
</template>
<script>
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

export default {
    components: {
        SvgIcon,
    },
    props: {
        message: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            iconType: ICON_TYPE.caution3,
            iconSize: 16,
        };
    },
};
</script>
<style lang="scss" scoped>
@import '../../../../themes';

.message-bar {
    @include themify($themes) {
        height: 46px;
        line-height: 46px;
        border-radius: 3px;
        padding: 0px 12px;
        font-size: 12px;
        color: themed('search-config-toolbar-font-color');
        background-color: themed('search-config-toolbar-background-color');

        > span {
            margin-right: 4px;
        }
        ::v-deep svg {
            margin-bottom: -3px;
            > path {
                fill: themed('search-config-toolbar-font-color');
            }
        }
    }
}
</style>
