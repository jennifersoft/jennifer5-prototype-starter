<template>
    <window :messages="messages"
            :open-w="1024"
            :open-h="600"
            :open-x="popupOffset.x"
            :open-y="popupOffset.y"
            @cancel="$emit('close')"
            class="socket-detail-window"
            animation-name="fade-down"
            hide-footer>
        <template #subject>
            <div class="detail-window-head" v-if="isDetailView">
                <btn :items="[{ iconType: icons.arrowBack }]"
                     class="transparent"
                     normal
                     @click="restoreTable" />
                <btn :items="[{ iconType: icons.newWindow }]"
                     :tooltip-options="{ message: i18n.popupView }"
                     class="transparent"
                     normal
                     @click="$emit('show-stack')" />
            </div>
        </template>
        <transition tag="div" :name="transitionName">
            <detail-table v-if="!isDetailView"
                          key="table"
                          :list="tableData.data"
                          :height="contentHeight - 40"
                          :width="contentWidth - 40"
                          @show-stack="onClickShowStack"
                          @receive-stack="receiveStacktrace" />
            <stacktrace-detail v-else
                               key="detail"
                               :content="selectedContent"
                               :height="contentHeight - 48"
                               @receive-again="onClickReceiveAgain" />
        </transition>
    </window>
</template>

<script>
import Window from "@vuejs/component/window/Window";
import messages from "@vuejs/component/messages";
import StacktraceDetail from "@entry/analysis/socket/component/StacktraceDetail";
import DetailTable from "@entry/analysis/socket/component/DetailTable";

import { mapActions, mapMutations, mapState } from '../store';
import Btn from "@vuejs/component/button/Btn";
import {ICON_TYPE} from "@vuejs/component/icon/iconType";

export const CONTENT_HEIGHT = 560;
export const CONTENT_WIDTH = 1024;

export default {
    name: "DetailWindow",
    inject: {
        theme: {
            default: 'classic',
        },
        i18n: {
            default: () => ({
                num: 'num',
                openTime: 'openTime',
                localPort: 'localPort',
                ip: 'ip',
                remotePort: 'remotePort',
                mode: 'mode',
                size: 'size',
                bytes: 'bytes',
                stacktrace: 'stacktrace',
            })
        },
    },
    components: {
        Btn,
        Window,
        StacktraceDetail,
        DetailTable,
    },
    computed: {
        ...mapState({
            tableData: state => state.innerTableData,
            selected: state => state.selectedRow,
        }),
        transitionName() {
            const direction = this.isDetailView ? 'left' : 'right';
            return `slide-${direction}`;
        },
        selectedContent() {
            return this.selected?.stack;
        },
        selectedKey() {
            return this.selected?.key;
        },
        isDetailView() {
            return !!this.selected;
        }
    },
    methods: {
        ...mapMutations(['updateSelectedRow']),
        ...mapActions(['receiveStacktrace']),
        onClickShowStack(data) {
            this.updateSelectedRow(data);
        },
        restoreTable() {
            this.updateSelectedRow();
        },
        async onClickReceiveAgain() {
            await this.receiveStacktrace({ key: this.selectedKey });
            this.updateSelectedRow();
        },
    },
    created() {
        this.messages = messages;
        this.icons = {
            arrowBack: ICON_TYPE.arrowBack,
            newWindow: ICON_TYPE.newWindow,
        };
        this.contentHeight = CONTENT_HEIGHT;
        this.contentWidth = CONTENT_WIDTH;
    },
    beforeMount() {
        this.popupOffset = {
            x: (window.innerWidth - 154) / 2 - 512,
            y: window.innerHeight / 2 - 300 + 45,
        };
    },
}
</script>

<style lang="scss" scoped>
@import "~@entry/analysis/socket/styles/slide.transition.scss";

.socket-detail-window {
    overflow-x: hidden;
    .detail-window-head {
        display: flex;
        justify-content: space-between;
        margin: -10px 4px 0 -12px;
    }
}
</style>