<template>
    <window
        class="confirm-window"
        :animation-name="animationName"
        :messages="messages"
        :draggable="false"
        :open-x="left"
        :open-y="top"
        :open-w="350"
        @cancel="() => $emit('cancel')"
        @apply="() => $emit('apply')"
    >
        <template #subject>{{ title }}</template>
        <div class="message">{{ message }}</div>
    </window>
</template>

<script>
import Window from './Window';
import messages, { confirm, confirmMessage } from '@vuejs/component/messages';

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
            default: confirmMessage,
        },
        animationName: {
            type: String,
            default: 'default',
            validator(name) {
                return ['default', 'fade-down'].includes(name);
            },
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
.confirm-window {
    .message {
        white-space: normal;
        overflow: hidden;
        word-break: break-word;
    }
}
</style>
