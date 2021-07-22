<template>
    <div class="text-component" :style="style">
        <span :style="spanStyle">{{ textOption.content }}</span>
    </div>
</template>
<script>
import { positionAndSizeStyle } from '@entry/userdefine/dashboard/component/common';

export default {
    name: 'TextComponent',
    props: {
        textOption: {
            type: Object,
            required: true,
        },
    },
    computed: {
        style() {
            return positionAndSizeStyle(this.textOption);
        },
        spanStyle() {
            return {
                color: this.textOption.color,
                'font-size': this.textOption.fontSize + 'px',
                'text-align': this.textOption.textAlign,
                'align-self': this.textOption.textVerticalAlign,
            };
        },
    },
};
</script>
<style lang="scss" scoped>
.text-component {
    position: absolute;
    box-shadow: none;
    background: none;

    > span {
        position: absolute;
        z-index: 10;
        width: calc(100% - 8px);
    }
}
</style>
