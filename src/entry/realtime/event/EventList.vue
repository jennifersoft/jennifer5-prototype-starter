<template>
    <div class="event-list">
        <div class="layer-header">
            <div class="title-n-count">
                <span class="title">{{ title }}</span>
                <div class="event-count">
                    <div class="icon normal " />
                    <div>{{ eventTotalCount.normal }}</div>
                </div>
                <div class="event-count">
                    <div class="icon warning" />
                    <div>{{ eventTotalCount.warning }}</div>
                </div>
                <div class="event-count">
                    <div class="icon fatal" />
                    <div>{{ eventTotalCount.fatal }}</div>
                </div>
            </div>

            <btn
                class="border-none"
                normal
                :items="[
                    {
                        iconType: closeIcon,
                    },
                ]"
                :tooltipOptions="{
                    position: 'top-right',
                    message: i18n.close,
                }"
                @click="onClickCloseBtn"
            />
        </div>
        <div class="item-list">
            <transition-group name="list">
                <alarm-box
                    v-for="(item, i) in newList"
                    :data="item"
                    :key="item.uuid"
                    :message-formatter="messageFormat"
                    @click="onClickAlarmItem(item)"
                />
            </transition-group>
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import AlarmBox from '@layout/component/item/AlarmBox';
import Chip from '@vuejs/component/Label/Chip';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

export default {
    inject: {
        i18n,
        theme: {
            default: 'classic',
        },
    },
    components: {
        Btn,
        AlarmBox,
        Chip,
    },
    props: {
        newList: {
            type: Array,
            default: () => [],
            validator(list) {
                return list.every(
                    e => 'name' in e && 'level' in e && 'uuid' in e
                );
            },
        },
        lastList: {
            type: Array,
            default: () => [],
            validator(list) {
                return list.every(
                    e => 'name' in e && 'level' in e && 'uuid' in e
                );
            },
        },
        eventTotalCount: {
            type: Object,
            validator(data) {
                return (
                    typeof data.normal === 'number' &&
                    typeof data.warning === 'number' &&
                    typeof data.fatal === 'number'
                );
            },
        },
        selectedInstanceName: {
            type: String,
            default: undefined,
        },
    },
    data() {
        return {};
    },
    methods: {
        onClickAlarmItem(item) {
            this.$emit('selected:event', item);
        },
        onClickCloseBtn() {
            this.$emit('selected:showEventListSection', false);
        },
        messageFormat(item) {
            let t = `${item.subject} ${item.detail}`;
            return t.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        },
    },
    computed: {
        title() {
            return this.selectedInstanceName ?? this.i18n.eventList;
        },
    },
    created() {
        this.closeIcon = ICON_TYPE.close;
    },
};
</script>

<style lang="scss" scoped>
@import 'common.scss';

.event-list {
    @include themify($themes) {
        box-sizing: border-box;

        > .layer-header {
            padding: 0 24px;
            display: flex;

            align-items: center;

            margin: 18px 0 24px 0;
            justify-content: space-between;
            > .title-n-count {
                display: flex;
                flex-direction: row;

                > .title {
                    font-size: 14px;
                    color: themed('section-text-color');
                }
                > .event-count {
                    margin-left: 12px;
                    display: flex;
                    justify-items: center;
                    align-items: center;
                    vertical-align: middle;
                    font-size: 12px;
                    .icon {
                        width: 8px;
                        height: 8px;
                        border-radius: 4px;
                        margin-right: 4px;

                        &.normal {
                            background: #497eff;
                        }

                        &.warning {
                            background: #ffdd26;
                        }

                        &.fatal {
                            background: #ff4f55;
                        }
                    }
                }
            }
        }
        > .item-list {
            padding: 0 24px;
            height: calc(100vh - 65px - 78px);
            overflow-y: auto;
            .alarm-box {
                border: 1px solid themed('box-border-color');
            }
        }

        .alarm-box + .alarm-box {
            margin-top: 10px;
        }
    }
}
</style>
