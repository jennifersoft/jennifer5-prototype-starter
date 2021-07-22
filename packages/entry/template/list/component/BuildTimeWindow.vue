<template>
    <window
        @cancel="() => $emit('cancel')"
        @apply="
            () => $emit('apply', { hour: selectedHour, minute: selectedMinute })
        "
        :open-w="250"
        :open-h="178"
        :draggable="false"
        :messages="{
            apply: i18n.apply,
            cancel: i18n.cancel,
        }"
        animation-name="fade-down"
        class="build-time-window"
    >
        <template #subject>
            <span>{{ i18n.autoBuildTime }}</span>
        </template>
        <div class="dropdown-group">
            <dropdown
                normal
                :width="100"
                :items="hours"
                :selected-value="selectedHour"
                @onchange="onChangeHour"
            ></dropdown>
            <dropdown
                normal
                :width="100"
                :items="minutes"
                :selected-value="selectedMinute"
                @onchange="onChangeMinute"
            ></dropdown>
        </div>
    </window>
</template>

<script>
import Window from '@vuejs/component/window/Window';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';

export default {
    inject: ['i18n'],
    components: {
        Window,
        Dropdown,
    },
    props: {
        hour: {
            type: Number,
            required: false,
            default: 0,
        },
        minute: {
            type: Number,
            required: false,
            default: 0,
        },
    },
    data() {
        return {
            hours: [...Array(24).keys()].map(i => this.createDropdownItem(i)),
            minutes: [...Array(60).keys()].map(i => this.createDropdownItem(i)),
            selectedHour: this.hour,
            selectedMinute: this.minute,
        };
    },
    methods: {
        createDropdownItem(num) {
            return {
                value: num,
                text: num < 10 ? `0${num}` : `${num}`,
            };
        },
        onChangeHour({ value }) {
            this.selectedHour = value;
        },
        onChangeMinute({ value }) {
            this.selectedMinute = value;
        },
    },
};
</script>

<style lang="scss" scoped>
.build-time-window {
    right: 142px;
    top: 120px;

    ::v-deep .aries-ui-dropdown .row-list {
        height: 70px;
    }
}
</style>
