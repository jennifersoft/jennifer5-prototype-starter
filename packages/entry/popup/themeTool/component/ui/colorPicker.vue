<template>
    <div class="color-picker-btn">
        <div class="color-buttons">
            <div
                class="block"
                @click="() => (active = !active)"
                :style="{ 'background-color': fontColor }"
            ></div>
        </div>
        <div class="color-picker-layer">
            <color-picker
                v-show="active"
                :color="fontColor"
                @change="color => $emit('change-font-color', color)"
            ></color-picker>
        </div>
    </div>
</template>

<script>
import ColorPicker from '@vuejs/component/ColorPicker/ColorPicker';

export default {
    components: {
        ColorPicker,
    },
    props: {
        fontColor: {
            type: String,
            required: false,
            default: '#000',
        },
    },
    data() {
        return {
            active: false,
        };
    },
};
</script>

<style lang="scss" scoped>
.color-picker-btn {
    display: inline-block;
    position: relative;

    > .color-buttons {
        display: inline-block;
        padding: 4px;
        border-radius: 4px;
        > .block {
            width: 32px;
            height: 18px;
            cursor: pointer;
        }
    }

    > .color-picker-layer {
        position: absolute;
        left: -185px;
        top: 30px;
        z-index: 1;
    }
}
</style>
