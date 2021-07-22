<template>
    <window
        :open-x="'calc(33.33% + 200px)'"
        :open-y="'calc(50% - 85px)'"
        :open-w="400"
        :open-h="190"
        :messages="messages"
        class="cancel-or-apply-window"
        @cancel="cancel"
        @apply="apply"
    >
        <template v-slot:subject>
            {{ i18n.title }}
        </template>
        <div>
            <div style="margin-right: 10px" v-html="message"></div>
        </div>
    </window>
</template>
<script>
import Window from '@vuejs/component/window/Window';
import { i18n } from '@common/utility';
import messages from '@vuejs/component/messages';

export default {
    name: 'cancelOrApplyWindow',
    components: { Window },
    props: {
        message: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            messages,
            i18n: {
                title: i18n.get('ui.label.confirmMessage'),
            },
        };
    },
    methods: {
        cancel() {
            this.$emit('cancel');
        },

        apply() {
            this.$emit('apply');
        },
    },
    computed: {},
};
</script>
<style lang="scss" scoped>
.cancel-or-apply-window {

    .body {
        > div {
            display: flex;
            flex-direction: row;
            margin: 8px 0;
        }
    }
}
</style>
