<template>
    <span
        class="aries-ui-chip"
        :style="{ backgroundColor, color: textColor }"
        :class="[{ clickable }, { removable }]"
    >
        <span class="chip-text" @click="onClickText">{{ value }}</span>
        <span class="chip-icon" v-if="removable" @click="onClickIcon">
            <svg-icon :icon-type="closeIcon" :width="16" :height="16" />
        </span>
    </span>
</template>

<script>
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

export default {
    name: 'Chip',
    components: { SvgIcon },
    props: {
        backgroundColor: {
            type: String,
            default: () => '#d7d7d5',
        },
        textColor: {
            type: String,
            default: () => '#212121',
        },
        value: {
            type: String,
            required: true,
        },
        clickable: {
            type: Boolean,
            default: false,
        },
        removable: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        onClickText() {
            if (!this.clickable) return;
            this.$emit('click');
        },
        onClickIcon() {
            this.$emit('remove');
        },
    },
    created() {
        this.closeIcon = ICON_TYPE.close;
    },
};
</script>

<style lang="scss" scoped>
.aries-ui-chip {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    height: 18px;
    font-size: 12px;
    user-select: none;
    border-radius: 3px;
    .chip-text {
        padding: 0 4px;
    }
    .chip-text,
    .chip-icon {
        display: inline-flex;
        position: relative;
        border-radius: inherit;
    }
    &.clickable .chip-text {
        cursor: pointer;

        &:hover {
            &::before {
                position: absolute;
                content: '';
                height: 100%;
                width: 100%;
                margin-left: -4px;
                border-radius: inherit;
                background-color: rgba(0, 0, 0, 0.05);
            }
        }
        &:active {
            &::before {
                position: absolute;
                content: '';
                height: 100%;
                width: 100%;
                margin-left: -4px;
                border-radius: inherit;
                background-color: rgba(0, 0, 0, 0.16);
            }
        }
    }
    &.removable .chip-icon {
        cursor: pointer;
        &:hover {
            &::before {
                position: absolute;
                content: '';
                height: 100%;
                width: 100%;
                border-radius: inherit;
                background-color: rgba(0, 0, 0, 0.05);
            }
        }
        &:active {
            &::before {
                position: absolute;
                content: '';
                height: 100%;
                width: 100%;
                border-radius: inherit;
                background-color: rgba(0, 0, 0, 0.16);
            }
        }
    }
}
</style>
