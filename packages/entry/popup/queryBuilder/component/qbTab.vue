<template>
    <div class="tab">
        <div class="left">
            <div
                :class="['menu', tab == 'console' ? 'active' : '']"
                @click="() => $emit('change-tab', 'console')"
            >
                {{ i18n.console }}
            </div>
            <div
                :class="['menu', tab == 'table' ? 'active' : '']"
                @click="() => $emit('change-tab', 'table')"
            >
                {{ i18n.table }}
            </div>
            <div
                :class="['menu', tab == 'json' ? 'active' : '']"
                @click="() => $emit('change-tab', 'json')"
            >
                {{ i18n.json }}
            </div>
        </div>
        <div class="right">
            <svg-icon
                :icon-type="iconTypes.download"
                :width="iconSize"
                :height="iconSize"
                @click.native="() => $emit('download-csv')"
                v-if="tab === 'table'"
            ></svg-icon>

            <svg-icon
                :icon-type="iconTypes.refresh"
                :width="iconSize"
                :height="iconSize"
                @click.native="() => $emit('run-script')"
            ></svg-icon>

            <svg-icon
                :icon-type="iconTypes.drag"
                :width="iconSize"
                :height="iconSize"
                @mousedown.native="e => $emit('resize-height', e)"
                class="resizer"
            ></svg-icon>
        </div>
    </div>
</template>

<script>
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

export default {
    components: {
        SvgIcon,
    },
    inject: {
        i18n: {
            default: {
                console: 'Console',
                table: 'Table',
                json: 'JSON',
            },
        },
    },
    props: {
        tab: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            iconTypes: {
                refresh: ICON_TYPE.refresh,
                download: ICON_TYPE.verticalAlignBottom,
                drag: ICON_TYPE.gripHorizontal,
            },
            iconSize: 16,
        };
    },
};
</script>

<style lang="scss" scoped>
.tab {
    display: flex;
    height: 26px;
    line-height: 26px;
    padding: 0px 16px 0px 0px;

    > div {
        flex: 1;
        &.left {
            > .menu {
                display: inline-block;
                height: 26px;
                padding: 0px 10px;
                &:not(.active) {
                    cursor: pointer;
                }
            }
        }
        &.right {
            text-align: right;
            padding-top: 3px;
            > * {
                cursor: pointer;
                margin-left: 8px;
            }
            > .resizer {
                cursor: n-resize !important;
            }
        }
    }
}
</style>
