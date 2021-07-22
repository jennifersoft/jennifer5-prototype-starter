<template>
    <btn class="transparent"
         :[size]="true"
         :items="[{ iconType }]"
         :tooltip-options="tooltipOptions"
         @click="$emit('flip')"/>
</template>

<script>
import Btn from "@vuejs/component/button/Btn";
import {ICON_TYPE} from "@vuejs/component/icon/iconType";

export default {
    name: "FlipFlopBtn",
    props: {
        flipped: {
            type: Boolean,
            required: true,
        },
        small: Boolean,
        normal: Boolean,
        large: Boolean,
    },
    components: {
        Btn,
    },
    inject: {
        i18n: {
            default: () => ({
                larger: 'larger',
                smaller: 'smaller',
            })
        }
    },
    computed: {
        iconType() {
            return this.flipped ? this.icons.arrowDown : this.icons.arrowUp;
        },
        size() {
            return this.small ? 'small' : this.large ? 'large' : 'normal';
        },
        tooltipOptions() {
            const ret = {};
            ret.position = 'top-center';
            ret.message = !this.flipped ? this.i18n.larger : this.i18n.smaller;
            return ret;
        }
    },
    created() {
        this.icons = {
            arrowUp: ICON_TYPE.arrowUp,
            arrowDown: ICON_TYPE.arrowDown,
        }
    }
}
</script>

<style scoped>

</style>