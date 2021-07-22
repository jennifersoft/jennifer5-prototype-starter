<template>
    <window
        class="xview-popup-in-topology"
        :open-x="96"
        :open-y="offsetTop"
        :open-w="610"
        :open-h="440"
        :min-top="47"
        hide-footer
        @cancel="$emit('close')"
    >
        <template #subject>{{ i18n.xView }}</template>
        <slot></slot>
    </window>
</template>

<script>
import Window from '@vuejs/component/window/Window';
export default {
    name: 'XViewWindow',
    inject: {
        i18n: {
            default: {
                xView: 'X-View',
            },
        },
    },
    components: {
        Window,
    },
    data() {
        return {
            offsetTop: window.innerHeight - 24 - 440,
        };
    },
};
</script>

<style lang="scss" scoped>
.xview-popup-in-topology {
    z-index: 999;
    .no-data {
        text-align: center;
    }
}
</style>
