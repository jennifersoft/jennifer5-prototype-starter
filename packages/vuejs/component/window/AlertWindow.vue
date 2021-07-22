<template>
    <window
        class="alert-window"
        :messages="messages"
        :draggable="false"
        :hide-footer="false"
        :hide-cancel-btn="true"
        :open-x="left"
        :open-y="top"
        :open-w="350"
        @cancel="() => $emit('cancel')"
        @apply="() => $emit('cancel')"
    >
        <template #subject>{{ title }}</template>
        <div class="message">{{ message }}</div>
    </window>
</template>

<script>
import Window from './Window';
import messages, { confirm, alertMessage } from '@vuejs/component/messages';

export default {
    components: {
        Window,
    },
    props: {
        message: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: false,
            default: alertMessage,
        },
    },
    data() {
        return {
            messages: {
                ...messages,
                apply: confirm,
            },
            left: window.innerWidth / 2 - 175,
            top: window.innerHeight / 2 - 100,
        };
    },
};
</script>

<style lang="scss" scoped>
.alert-window {
    .message {
        white-space: normal;
        overflow: hidden;
        word-break: break-word;
    }
}
</style>
