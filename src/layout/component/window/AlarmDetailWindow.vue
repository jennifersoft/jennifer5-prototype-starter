<template>
    <window class="alarm-detail-window"
            :class="{ [content.level]: true }"
            :open-x="500"
            :open-y="380"
            :open-w="440"
            :hide-footer="!hasTxData"
            :messages="{ apply: i18n.txAnalysis, cancel: '' }"
            animation-name="fade-down"
            @apply="$emit('link-xview', content)"
            @cancel="$emit('close')"
            hide-cancel-btn>
        <template #subject>
            <span v-html="title"></span>
        </template>
        <template #subtitle>
            <span>{{ timestamp }}</span>
        </template>
        <div class="detail-msg">
            {{ detailMsg }}
        </div>
    </window>
</template>

<script>
import Window from "@vuejs/component/window/Window";
import { printBrText } from "@common/utility";

export default {
    name: "AlarmDetailWindow",
    components: {
        Window,
    },
    inject: {
        i18n: {
            default: () => ({
                txAnalysis: 'Transaction Analysis',
            })
        }
    },
    props: {
        content: {
            type: Object,
            default: null,
        }
    },
    computed: {
        title() {
            return this.content && `[${this.content.name}]\n${this.content.subject}  ${this.content.detail}`;
        },
        timestamp() {
            return this.content?.time;
        },
        detailMsg() {
            return this.content && printBrText(this.content.detailMessage);
        },
        hasTxData() {
            return this.content.txid !== '0';
        }
    }
}
</script>

<style lang="scss" scoped>
.alarm-detail-window {

    &.normal {
        ::v-deep > .head {
            border-top: 8px solid #497eff;
        }
    }

    &.warning {
        ::v-deep > .head {
            border-top: 8px solid #ffdd26;
        }
    }

    &.fatal {
        ::v-deep > .head {
            border-top: 8px solid #ff4f55;
        }
    }

    .detail-msg {
        max-height: 480px;
        overflow: auto;
    }
}
</style>