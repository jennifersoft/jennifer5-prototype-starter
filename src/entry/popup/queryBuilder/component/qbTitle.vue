<template>
    <div class="title">
        <div class="top">
            <div class="left">
                {{ i18n.queryBuilder }}
            </div>
            <div class="right">
                <btn
                    class="border-none"
                    :items="[{ text: i18n.execute }]"
                    :loading="isLoading"
                    @click="() => $emit('run-script')"
                ></btn>
                <btn
                    class="border-none"
                    :items="[{ iconType: iconTypes.refresh }]"
                    :tooltip-options="{ message: i18n.reset }"
                    @click="() => $emit('reset-script')"
                ></btn>
                <btn
                    class="border-none"
                    :items="[{ iconType: iconTypes.menu }]"
                    :tooltip-options="{ message: i18n.tableSchema }"
                    :pressed="activeSchema"
                    @click="() => $emit('toggle-schema')"
                    v-if="!disableSchema"
                ></btn>
            </div>
        </div>
        <div class="bottom">
            <btn
                class="border-none"
                :items="[{ iconType: iconTypes.add }]"
                @click="() => $emit('add-tab')"
            ></btn>

            <div class="tabs">
                <div
                    v-for="tab in tabs"
                    :class="['menu', activeTab == tab ? 'active' : '']"
                >
                    <span @click="() => $emit('change-tab', tab)">{{
                        tab
                    }}</span>
                    <svg-icon
                        :icon-type="iconTypes.close"
                        :width="10"
                        :height="10"
                        @click.native="() => $emit('delete-tab', tab)"
                        v-if="activeTab != tab"
                    ></svg-icon>
                </div>
            </div>

            <div class="limit">
                <format-number-input
                    small
                    :width="160"
                    :step="100"
                    :min="100"
                    :max="100000"
                    :label="i18n.maxRows"
                    :value="limitCount"
                    @input="count => $emit('change-limit-count', count)"
                ></format-number-input>
                <format-number-input
                    small
                    :width="140"
                    :step="10"
                    :min="10"
                    :max="3600"
                    :label="`${i18n.timeout} (${i18n.sec})`"
                    :value="limitTimeout"
                    @input="count => $emit('change-limit-timeout', count)"
                ></format-number-input>
            </div>
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import FormatNumberInput from '@vuejs/component/Input/FormatNumberInput';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { mapState } from '../constant';

export default {
    inject: {
        i18n: {
            default: {
                queryBuilder: 'Query Builder',
                execute: 'Execute',
                reset: 'Reset',
                tableSchema: 'Tables',
                maxRows: 'Max Rows',
            },
        },
    },
    components: {
        Btn,
        SvgIcon,
        FormatNumberInput,
    },
    props: {
        activeTab: {
            type: String,
            required: true,
        },
        activeSchema: {
            type: Boolean,
            required: true,
        },
        disableSchema: {
            type: Boolean,
            required: true,
        },
        isLoading: {
            type: Boolean,
            required: true,
        },
        limitCount: {
            type: Number,
            required: true,
        },
        limitTimeout: {
            type: Number,
            required: true,
        },
    },
    computed: {
        ...mapState({
            tabs: state => Object.keys(state.tabs),
        }),
    },
    data() {
        return {
            iconTypes: {
                refresh: ICON_TYPE.refresh,
                menu: ICON_TYPE.hamburger,
                add: ICON_TYPE.add,
                close: ICON_TYPE.close,
            },
        };
    },
};
</script>

<style lang="scss" scoped>
.title {
    position: relative;
    width: 100%;

    > .top {
        display: flex;
        height: 50px;
        line-height: 50px;
        padding: 0px 24px;
        > * {
            flex: 1;
        }
        > .left {
            font-size: 16px;
            font-weight: bold;
        }
        > .right {
            text-align: right;
        }
    }

    > .bottom {
        position: relative;
        height: 32px;
        line-height: 32px;

        ::v-deep .aries-ui-btn {
            margin-top: -3px;
            margin-left: 2px;
        }

        > .tabs {
            display: inline-block;
            > .menu {
                display: inline-block;
                height: 31px;
                padding: 0px 10px;
                &:not(.active) {
                    cursor: pointer;
                }
                ::v-deep .icon {
                    cursor: pointer;
                }
            }
        }

        > .text {
            position: absolute;
            width: 242px;
            right: 0px;
            top: 0px;
            padding-left: 8px;
        }

        > .limit {
            position: absolute;
            top: 0px;
            right: 2px;
        }
    }
}
</style>
