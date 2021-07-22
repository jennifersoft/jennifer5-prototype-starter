<template>
    <img
        :style="styleOverride"
        :class="[{ [resourceType]: true }, status]"
        src="//:0"
        :alt="resourceType"
    />
</template>

<script>
import { RESOURCE_TYPES, RESOURCE_STATUS_TYPES } from '../types';

export default {
    props: {
        resourceType: {
            type: String,
            validator: v => RESOURCE_TYPES.includes(v),
            required: true,
        },
        styleOverride: {
            type: String,
            default: '',
        },
        status: {
            type: [String, undefined],
            default: undefined,
            validator(s) {
                return s === undefined
                    || RESOURCE_STATUS_TYPES.includes(s);
            }
        }
    },
};
</script>

<style lang="scss" scoped>
// width = $indent-width (from ../Row.vue)
@import '~@common/scss/themes.scss';

$themes: (
    classic: (
        --domain-svg-path: './classic/domain.svg',
        --instance-svg-path: './classic/instance.svg',
        --business-svg-path: './classic/business.svg',
        --domain-group-svg-path: './classic/domain-group.svg',
        status-default-bg: rgba(0, 0, 0, 0.08),
        status-normal-bd: #497eff,
        status-warning-bd: #ffdd26,
        status-fatal-bd: #ff4f55,
    ),
    dark: (
        --domain-svg-path: './dark/domain.svg',
        --instance-svg-path: './dark/instance.svg',
        --business-svg-path: './dark/business.svg',
        --domain-group-svg-path: './dark/domain-group.svg',
        status-default-bg: rgba(255, 255, 255, 0.08),
        status-normal-bd: #497eff,
        status-warning-bd: #ffdd26,
        status-fatal-bd: #ff4f55,
    ),
);

img {
    @include themify($themes) {
        min-width: 16px;
        height: 16px;
        content: url(themed(--domain-svg-path));
        &.instance {
            content: url(themed(--instance-svg-path));
        }
        &.business {
            content: url(themed(--business-svg-path));
        }
        &.domain-group {
            content: url(themed(--domain-group-svg-path));
        }

        &.default {
            background-color: themed('status-default-bg');
        }

        &.normal {
            border: 2px solid themed('status-normal-bd');
        }

        &.warning {
            border: 2px solid themed('status-warning-bd');
        }

        &.fatal {
            border: 2px solid themed('status-fatal-bd');
        }

        &.default, &.normal, &.warning, &.fatal {
            height: 28px;
            min-width: 28px;
            box-sizing: border-box;
            border-radius: 50%;
            object-position: 50% 50%;
            object-fit: scale-down;
        }
    }
}
</style>
