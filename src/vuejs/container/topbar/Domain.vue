<template>
    <btn
        :items="[{ text: object.shortName }]"
        class=" border-none edge-pill domain"
        :class="{
            'primary-reverse': selected,
        }"
        :data-tooltip-text="object.statusMsg"
        @click="select"
    ></btn>
</template>

<script>
import { ElementManager } from '@common/legacy/ElementManager';
import Btn from '@vuejs/component/button/Btn';
import VInstanceTooltip from './vInstanceTooltip';

export default {
    name: 'Domain',
    directives: {
        tooltip: VInstanceTooltip,
    },
    components: {
        Btn,
    },
    props: {
        id: {
            type: String,
            required: true,
        },
        selected: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    data() {
        return {};
    },
    methods: {
        select() {
            this.$emit('select');
        },
    },
    computed: {
        object() {
            return ElementManager.getValue(this.id);
        },
    },

    mounted() {},
};
</script>
<style lang="scss" scoped>
.domain {
    margin: 2px 0;
    &.unlicensed,
    &.stopped,
    &.warning {
        //statusMsg를 툴팁으로 표시해야함.

        ::v-deep .item {
            opacity: 0.5;
        }
    }
}
</style>
