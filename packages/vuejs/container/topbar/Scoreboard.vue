<template>
    <div class="scoreboard">
        <div
            class="live"
            v-tooltip="{
                content: i18n.live,
                bgColor: tooltip.bgColor,
                color: tooltip.color,
                isScrolling: false,
            }"
        >
            <div class="icon"></div>
            <div class="text">{{ liveCount }}</div>
        </div>
        <div
            class="stopped"
            v-tooltip="{
                content: i18n.stopped,
                bgColor: tooltip.bgColor,
                color: tooltip.color,
                isScrolling: false,
            }"
        >
            <div class="icon"></div>
            <div class="text">{{ stoppedCount }}</div>
        </div>
        <div
            class="unlicenced"
            v-tooltip="{
                content: i18n.unlicensed,
                bgColor: tooltip.bgColor,
                color: tooltip.color,
                isScrolling: false,
            }"
        >
            <div class="icon"></div>
            <div class="text">{{ unlicencedCount }}</div>
        </div>
    </div>
</template>

<script>
import VInstanceTooltip from './vInstanceTooltip';

export default {
    name: 'Scoreboard',
    directives: {
        tooltip: VInstanceTooltip,
    },
    data() {
        return {
            i18n: {
                live: i18n.get('ui.en.live'),
                stopped: i18n.get('ui.en.stopped'),
                unlicensed: i18n.get('ui.en.unlicensed'),
            },
            tooltip: {
                bgColor: 'rgba(0, 0, 0, 0.75)',
                color: '#FFF',
            },
        };
    },
    props: {
        liveCount: {
            type: Number,
            required: true,
        },
        stoppedCount: {
            type: Number,
            required: true,
        },
        unlicencedCount: {
            type: Number,
            required: true,
        },
    },
};
</script>
<style lang="scss" scoped>
.scoreboard {
    @import '~@vuejs/component/themes.scss';
    @include themify($themes) {
        display: inline-flex;
        font-size: 12px;

        > div {
            margin-right: 7px;
        }

        div {
            line-height: 26px;
            display: inline-flex;
        }

        .icon {
            width: 8px;
            height: 8px;
            border-radius: 4px;

            margin: 9px 5px;
        }

        .text {
            color: themed('typography-color-grey1');
        }

        .live .icon {
            background-color: #497eff;
        }
        .stopped .icon {
            background-color: #ff4f55;
        }

        .unlicenced .icon {
            background-color: #8652ff;
        }
    }
}
</style>
