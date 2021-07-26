<template>
    <div class="auto-refresh">
        <label>{{ i18n.autoRefresh }}</label>
        <dropdown
            :items="intervalList"
            :selected-value="selectedInterval"
            @onchange="onChangeInterval"
        ></dropdown>
        <label class="second" @click="onChangePause">
            <svg-icon
                :icon-type="intervalPause ? iconTypes.play : iconTypes.pause"
                :width="iconSize"
                :height="iconSize"
            />
        </label>
        <label class="third" @click="onEmittedEvent">
            <svg-icon
                :icon-type="iconTypes.refresh"
                :width="iconSize"
                :height="iconSize"
            />
        </label>
    </div>
</template>

<script>
import Dropdown from '@vuejs/component/dropdown/Dropdown';
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

export default {
    inject: ['i18n'],
    components: {
        SvgIcon,
        Dropdown,
    },
    props: {
        min: {
            type: Number,
            required: false,
            default: 1,
            validator(val) {
                if (val < 1) return false;
                return true;
            },
        },
        max: {
            type: Number,
            required: false,
            default: 10,
            validator(val) {
                if (val > 10) return false;
                return true;
            },
        },
        interval: {
            // initial interval
            type: Number,
            required: false,
            default: 1000,
        },
        paused: {
            // initial pause state
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            iconSize: 16,
            iconTypes: {
                play: ICON_TYPE.play,
                pause: ICON_TYPE.pause,
                refresh: ICON_TYPE.refresh,
            },
            intervalList: [...Array(10).keys()].map(val => {
                return {
                    text: `${val + 1}${this.i18n.second}`,
                    value: (val + 1) * 1000,
                };
            }),
            selectedInterval: this.interval,
            intervalHandler: null,
            intervalPause: this.paused,
        };
    },
    methods: {
        clearIntervalHandler() {
            if (this.intervalHandler !== null) {
                clearTimeout(this.intervalHandler);
                this.intervalHandler = null;
            }
        },
        createIntervalHandler() {
            if (this.intervalHandler === null) {
                this.intervalHandler = setTimeout(
                    this.onIntervalEvent,
                    this.selectedInterval
                );
            }
        },
        onChangeInterval({ value }) {
            this.selectedInterval = value;
        },
        onIntervalEvent() {
            this.clearIntervalHandler();
            this.$emit('run');
            this.createIntervalHandler();
        },
        onChangePause() {
            if (this.intervalPause) this.onIntervalEvent();
            else this.clearIntervalHandler();
            this.intervalPause = !this.intervalPause;
        },
        onEmittedEvent() {
            if (this.intervalPause) this.$emit('run');
            else this.onIntervalEvent();
        },
    },
    beforeMount() {
        if (!this.paused) this.createIntervalHandler();
    },
    beforeDestroy() {
        this.clearIntervalHandler();
    },
};
</script>

<style lang="scss" scoped>
@import '../themes.scss';

.auto-refresh {
    font-size: 12px;
    font-weight: 400;

    @include themify($themes) {
        display: inline-block;

        > label {
            display: inline-block;
            height: 18px;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
            padding: 3px 8px;
            border: 1px solid themed('auto-refresh-label-border-color');
            background-color: themed('auto-refresh-label-background-color');
            color: themed('auto-refresh-label-font-color');

            &:first-child {
                border-right: none;
            }

            &.second,
            &.third {
                padding: 3px 5px !important;
                cursor: pointer;
                background-color: themed(
                    'auto-refresh-label-button-background-color'
                );

                > svg {
                    margin-bottom: -3px;
                }
            }

            &.second {
                border-radius: 0px !important;
                border-right-width: 0px !important;
                margin-left: -5px;
            }

            &.third {
                border-radius: 0px 4px 4px 0px;
                margin-left: -5px;
            }
        }

        ::v-deep .aries-ui-dropdown {
            width: 90px;
            margin-left: -4px;
            border-radius: 0px !important;
            text-align: left;
        }
    }

    @import '~@vuejs/style/hover-and-active.scss';
    > label {
        &.second,
        &.third {
            position: relative;
            @include hover-and-active;
        }
    }
}
</style>
