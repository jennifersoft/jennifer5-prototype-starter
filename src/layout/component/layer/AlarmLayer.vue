<template>
    <div class="side-bar-alarm-layer">
        <div class="layer-header">
            <span class="title">{{ i18n.alarm }}</span>
            <toggle-switch
                :active="activeSound"
                :label="i18n.alarmSound"
                @change="onClickAlarmSoundSwitch"
            />
            <btn
                :items="[{ iconType: closeIcon }]"
                class="transparent"
                style="margin: -6px 0 -6px 8px;"
                @click="$emit('close')"
                normal
            />
        </div>
        <div class="alarm-item-wrapper">
            <div class="division">{{ i18n.new }}</div>
            <transition-group name="list">
                <alarm-box
                    v-for="(item, i) in newList"
                    :key="item.uuid"
                    :data="item"
                    :message-formatter="messageFormat"
                    @click="onClickAlarmItem(item)"
                />
            </transition-group>
            <div class="division">{{ i18n.last }}</div>
            <alarm-box
                v-for="(item, i) in lastList"
                :data="item"
                :key="item.uuid"
                :message-formatter="messageFormat"
                @click="onClickAlarmItem(item)"
            />
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import AlarmBox from '@layout/component/item/AlarmBox';
import Chip from '@vuejs/component/Label/Chip';
import ToggleSwitch from '@vuejs/component/Toggle/ToggleSwitch';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

export default {
    name: 'AlarmLayer',
    inject: {
        i18n: {
            default: {
                alarm: 'Alarm',
                alarmSound: 'Alarm sound',
                new: 'NEW',
                last: 'LAST',
            },
        },
        theme: {
            default: 'classic',
        },
    },
    components: {
        Btn,
        AlarmBox,
        Chip,
        ToggleSwitch,
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
        activeSound: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        onClickAlarmItem(item) {
            this.$emit('select-item', item);
        },
        onClickAlarmSoundSwitch() {
            this.$emit('update:alarm-sound', !this.activeSound);
        },
        messageFormat(item) {
            let t = `${item.subject} ${item.detail}`;
            return t.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        },
    },
    created() {
        this.closeIcon = ICON_TYPE.close;
    },
};
</script>

<style lang="scss" scoped>
@import '~@layout/style/layer-style.scss';
@import '~@vuejs/transition/listing.scss';

.side-bar-alarm-layer {
    @include layer-style;
    @include listing;

    .alarm-box + .alarm-box {
        margin-top: 10px;
    }
}
</style>
