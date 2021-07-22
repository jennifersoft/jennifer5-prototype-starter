<template>
    <div class="instance-node" :key="agent.id" :icon-state="iconState">
        <div class="icon" :icon-state="iconState">
            <tooltip
                v-if="
                    iconState === iconStateWhenStopped ||
                        iconState === iconStateWhenLicenseExpired
                "
                :message="tooltipMessage"
                :position="'bottom-center'"
                :background-color="tooltipBgColor"
            >
                <svg-icon
                    :icon-type="stoppedIcon"
                    :width="iconSize"
                    :height="iconSize"
                />
            </tooltip>
            <span v-else>{{ char(agent.shortName) }}</span>
        </div>
        <div class="name">{{ agent.shortName }}</div>
    </div>
</template>

<script>
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import Tooltip from '@vuejs/component/tooltip/Tooltip';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { ICON_STATE } from '@module/chart/model/EventModel';

export default {
    name: 'InstanceNodeInGridLayout',
    inject: {
        i18n,
    },
    components: {
        SvgIcon,
        Tooltip,
    },
    props: {
        agent: {
            type: Object,
            required: true,
        },
        iconState: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            iconSize: 20,
            stoppedIcon: ICON_TYPE.stopped,

            iconStateWhenStopped: ICON_STATE.STOPPED,
            iconStateWhenLicenseExpired: ICON_STATE.UNLICENCED,
        };
    },
    methods: {
        char(name) {
            return name.substring(0, 1);
        },
    },
    computed: {
        tooltipMessage() {
            if (this.iconState === this.iconStateWhenStopped) {
                return this.i18n.stopped;
            }

            if (this.iconState === this.iconStateWhenLicenseExpired) {
                return this.i18n.licenseExpired;
            }
            return '';
        },
        tooltipBgColor() {
            return this.iconState === this.iconStateWhenStopped
                ? '#ff4f55'
                : '#8652ff';
        },
    },
};
</script>

<style lang="scss" scoped>
@import 'common.scss';

.instance-node {
    box-sizing: border-box;

    &[icon-state='0'],
    &[icon-state='1'],
    &[icon-state='2'] {
        cursor: pointer;
    }

    border-radius: 4px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    position: relative;
    &::before {
        position: absolute;
        content: '';
        height: 100%;
        width: 100%;
        border-radius: inherit;
        top: 0;
        left: 0;
        transition: background-color 0.18s, color 0.18s;
    }
    @include themify($themes) {
        &:hover {
            &::before {
                background-color: themed('behaviors-hover-color');
            }
        }
        &:active {
            &::before {
                background-color: themed('behaviors-press-color');
            }
        }
        &.selected {
            background: themed('background-color-lightpurple');
        }

        border: solid 1px themed('box-border-color');

        display: inline-flex;
        padding: 20px 16px;
        > .icon {
            position: relative;
            width: 48px;
            height: 48px;
            border-radius: 24px;

            font-size: 24px;

            text-align: center;
            line-height: 48px;

            //NORMAL: 0,
            //WARNING: 1,
            //FATAL: 2,
            //STOPPED: 3,
            //UNLICENCED: 4,
            &[icon-state='0'] {
                background: themed('normal-bg-color');
                color: themed('normal-text-color');
            }
            &[icon-state='1'] {
                background: themed('warning-bg-color');
                color: themed('warning-text-color');
            }
            &[icon-state='2'] {
                background: themed('fatal-bg-color');
                color: themed('fatal-text-color');
            }
            &[icon-state='3'] {
                background: themed('stopped-bg-color');
                color: themed('stopped-text-color');
            }
            &[icon-state='4'] {
                background: themed('licenseexpired-bg-color');
                color: themed('licenseexpired-text-color');
            }
        }
        > .name {
            margin-left: 16px;
            line-height: 48px;
        }
    }
}
</style>
