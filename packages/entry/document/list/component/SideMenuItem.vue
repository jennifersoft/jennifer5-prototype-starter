<template>
    <div :class="['side-menu-item', active ? 'active' : '']">
        <div class="left" @click="() => $emit('click#title')">
            <svg-icon
                :icon-type="iconType"
                :width="iconSize"
                :height="iconSize"
            />
            <tooltip :message="title" :position="'bottom-center'" :offset="-4">
                <span v-html="title"></span>
            </tooltip>
        </div>
        <div class="right">
            <svg-icon
                :icon-type="moreIcon"
                :width="iconSize"
                :height="iconSize"
                @click.native="e => $emit('click#more', e)"
                v-if="useMore"
            />
        </div>
    </div>
</template>

<script>
import Tooltip from '@vuejs/component/tooltip/Tooltip';
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

export default {
    components: {
        SvgIcon,
        Tooltip,
    },
    props: {
        iconType: {
            type: String,
            required: true,
        },
        useMore: {
            type: Boolean,
            required: false,
            default: false,
        },
        active: {
            type: Boolean,
            required: false,
            default: false,
        },
        title: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            iconSize: 16,
            moreIcon: ICON_TYPE.moreHorizon,
        };
    },
};
</script>

<style lang="scss" scoped>
@import '../themes.scss';

.side-menu-item {
    @include themify($themes) {
        display: flex;
        height: 28px;
        padding: 0px 16px;
        cursor: pointer;
        color: themed('side-menu-font-color');

        &:hover {
            background-color: themed('side-menu-hover-background-color');
            .right {
                svg {
                    visibility: visible;
                }
            }
        }
        &.active {
            background-color: themed('side-menu-active-background-color');
            cursor: default;
            > * {
                color: themed('side-menu-active-font-color');
            }
        }

        > div {
            &:first-child {
                flex: 3;
                display: flex;
                align-items: center;
            }
            &:last-child {
                flex: 1;
                text-align: right;
                padding-top: 6px;
                > svg {
                    visibility: hidden;
                    cursor: pointer;
                }
            }
        }

        span {
            display: inline-block;
            font-size: 14px;
            max-width: 160px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-left: 4px;
        }
    }
}
</style>
