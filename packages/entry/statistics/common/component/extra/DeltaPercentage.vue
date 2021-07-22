<template>
    <span class="delta-percentage">
        <span class="value">
            {{ delta | convertToInteger }}
        </span>
        <svg-icon v-if="delta !== 0"
                  :style="{ color }"
                  :width="16"
                  :height="16"
                  :icon-type="iconType" />
    </span>
</template>

<script>
import SvgIcon from "@vuejs/component/icon/SvgIcon";
import { ICON_TYPE } from "@vuejs/component/icon/iconType";

export default {
    name: "ArrowSvg",
    components: {
        SvgIcon,
    },
    props: {
        delta: {
            type: Number,
            required: true,
        },
    },
    computed: {
        iconType() {
            return this.delta > 0 ? ICON_TYPE.arrowUpward
                : ICON_TYPE.arrowDownward;
        },
        color() {
            return this.delta < 0 ? '#1fa558'
                : '#df2c34';
        },
    },
    filters: {
        convertToInteger(val) {
            return Math.abs(Math.floor(val)) + '%';
        },
    }
}
</script>

<style lang="scss" scoped>
.delta-percentage {
    display: inline-flex;
    align-items: center;
    > .value {
        margin-right: 4px;
    }
}
</style>