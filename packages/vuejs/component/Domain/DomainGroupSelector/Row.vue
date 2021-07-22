<template>
    <div
        :class="[{ hasChildren, active, noInteraction }]"
        class="breadcrumb-row"
        @click.stop="clickHandler"
    >
        <Icon :resource-type="resourceType" />
        <span class="breadcrumb-row-label">{{ label }}</span> <slot />
        <img v-if="hasChildren" class="children-arrow" src="//:0" />
    </div>
</template>

<script>
import Icon from '../../Resource/Icon/ResourceIcon.vue';
export default {
    components: {
        Icon,
    },
    props: {
        resourceType: {
            required: true,
            type: String,
        },
        label: {
            required: true,
            type: String,
        },
        hasChildren: {
            default: false,
            type: Boolean,
        },
        active: {
            default: false,
            type: Boolean,
        },
        noInteraction: {
            default: false,
            type: Boolean,
        },
    },
    methods: {
        clickHandler() {
            if (this.noInteraction) {
                return;
            }
            this.$emit('elementSelected');
        },
    },
};
</script>

<style lang="scss" scoped>
@import './var';
@import '~@common/scss/themes.scss';

$themes: (
    classic: (
        bg-color-hover: rgba(0, 0, 0, 0.05),
        bg-color-no-interaction: white,
        label-color: #333333,
        --arrow-svg-path: './assets/arrow-right-classic.svg',
    ),
    dark: (
        bg-color-hover: rgba(255, 255, 255, 0.05),
        bg-color-no-interaction: black,
        label-color: #d5d5d5,
        --arrow-svg-path: './assets/arrow-right-dark.svg',
    ),
);

.breadcrumb-row {
    @include themify($themes) {
        display: flex;
        align-items: center;
        min-width: $breadcrumb-min-width;
        max-width: $breadcrumb-max-width;
        width: auto;
        height: 24px;
        padding: 4px 8px;
        box-sizing: border-box;
        border-radius: 4px;
        position: relative;
        background-color: transparent;

        &:not(.noInteraction) {
            cursor: pointer;

            &:hover {
                background-color: themed('bg-color-hover');
            }

            &.active {
                background-color: #aa8bc5;

                .breadcrumb-row-label {
                    color: white;
                }
            }
        }

        transition: background-color 0.2s ease;
        padding-right: 18px;
        &.hasChildren {
            padding-right: 22px;
        }

        &.noInteraction {
            &:after {
                content: '';
                border-radius: 4px;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: themed('bg-color-no-interaction');
                opacity: 0.3;
            }
        }

        > .breadcrumb-row-label {
            -webkit-font-smoothing: antialiased;
            font-size: 12px;
            margin-left: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: themed('label-color');
        }

        > .children-arrow {
            position: absolute;
            right: 6px;
            content: url(themed('--arrow-svg-path'));
        }
    }
}
</style>
