<template>
    <window
        class="move-talk-window-when-export-chart"
        @cancel="cancel"
        @apply="apply"
        :class="{ hide: hideWindow }"
        :messages="messages"
        :open-w="358"
        :open-h="144"
        :open-x="'calc(50% - 179px)'"
        :open-y="'calc(50% - 72px)'"
    >
        <div v-html="i18n.message"></div>
    </window>
</template>
<script>
import Window from '@vuejs/component/window/Window';
import { i18n } from '@common/utility';
import { vuebus } from '@common/base';
import { keywordInVuebus } from '@common/ObserverKeyword';

export default {
    name: 'MoveTalkWindowWhenExportChart',
    components: { Window },
    data() {
        return {
            messages: {
                cancel: i18n.get('ui.label.close'),
                apply: i18n.get('ui.button.confirm'),
            },
            hideWindow: true,
            i18n: {
                message: i18n.get('M0617'),
            },
            key: undefined,
        };
    },
    methods: {
        cancel() {
            this.hideWindow = true;
        },

        apply() {
            this.hideWindow = true;
            document.location = `/report/board?key=${this.key}`;
        },
    },
    created() {
        vuebus.$on(keywordInVuebus.MOVE_TO_TALK_WHEN_EXPORT_CHART, key => {
            this.key = key;
            this.hideWindow = false;
        });
    },
};
</script>
<style lang="scss" scoped>
.move-talk-window-when-export-chart {

    &.hide {
        display: none;
    }

    /deep/ .head {
        display: none;
    }
    .body {
        > div {
            display: flex;
            flex-direction: column;
            margin: 8px 0;
        }
    }
}
</style>
