<template>
    <div class="profile-level-text">
        <div>
            <svg-icon
                :icon-type="iconOptions.type"
                :width="iconOptions.size"
                :height="iconOptions.size"
            ></svg-icon>
            <b>{{ i18n.minResponseTime }}</b> :
            <span>{{ minResponseTimeText }}</span>
        </div>
        <div>
            <svg-icon
                :icon-type="iconOptions.type"
                :width="iconOptions.size"
                :height="iconOptions.size"
            ></svg-icon>
            <b>{{ i18n.samplingCycle }}</b> :
            <span>{{ samplingCycleText }}</span>
        </div>
    </div>
</template>

<script>
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

export default {
    inject: ['i18n'],
    components: {
        SvgIcon,
    },
    props: {
        minResponseTime: {
            type: Number,
            required: true,
        },
        samplingCycle: {
            type: Number,
            required: true,
        },
    },
    computed: {
        minResponseTimeText() {
            return `${this.minResponseTime} ${this.i18n.ms}`;
        },
        samplingCycleText() {
            return `${this.samplingCycle} ${this.i18n.ms}`;
        },
    },
    data() {
        return {
            iconOptions: {
                type: ICON_TYPE.check,
                size: 14,
            },
        };
    },
};
</script>

<style lang="scss" scoped>
@import '../themes';

.profile-level-text {
    @include themify($themes) {
        color: themed('common-description-font-color');
        margin-top: 16px;
        > div:first-child {
            margin-bottom: 12px;
        }
        svg {
            margin-bottom: -2px;
            margin-right: 6px;
        }
    }
}
</style>
