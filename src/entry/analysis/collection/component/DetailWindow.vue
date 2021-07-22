<template>
    <window
        :open-w="800"
        :open-h="600"
        :open-x="popupOffset.x"
        :open-y="popupOffset.y"
        hide-footer
        @cancel="$emit('close')"
    >
        <template #subject>
            <div class="detail-window-head">
                {{ selectedTitle }}
                <btn
                    :items="[{ iconType: popupIcon }]"
                    :tooltip-options="{ message: i18n.popupView }"
                    normal
                    class="transparent"
                    style="margin-top: -8px"
                    @click="$emit('open-popup')"
                />
            </div>
        </template>
        <stacktrace-detail
            :content="selectedContent"
            :height="contentHeight - 48"
            @receive-again="$emit('receive-again')"
        />
    </window>
</template>

<script>
import Window from '@vuejs/component/window/Window';
import {
    CONTENT_WIDTH,
    CONTENT_HEIGHT,
} from '@entry/analysis/socket/container/DetailWindow';
import Btn from '@vuejs/component/button/Btn';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import StacktraceDetail from '@entry/analysis/socket/component/StacktraceDetail';
export default {
    name: 'DetailWindow',
    components: {
        StacktraceDetail,
        Window,
        Btn,
    },
    inject: ['i18n'],
    props: {
        data: {
            type: Object,
            required: true,
        },
        titleKey: {
            type: String,
            default: 'name',
        },
    },
    computed: {
        selectedContent() {
            return this.data?.stack;
        },
        selectedTitle() {
            return this.data?.[this.titleKey];
        },
    },
    created() {
        this.contentHeight = CONTENT_HEIGHT;
        this.contentWidth = CONTENT_WIDTH;
        this.popupIcon = ICON_TYPE.newWindow;
    },
    beforeMount() {
        this.popupOffset = {
            x: 92,
            y: window.innerHeight - 600 - 24,
        };
    },
};
</script>

<style lang="scss" scoped>
.detail-window-head {
    display: flex;
    justify-content: space-between;
}
</style>
