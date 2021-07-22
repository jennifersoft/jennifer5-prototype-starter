<template>
    <window class="thread-detail-window"
            :open-w="800"
            :open-h="600"
            :open-x="popupOffset.x"
            :open-y="popupOffset.y"
            @cancel="$emit('close')"
            hide-footer>
        <template #subject>
            <div class="thread-detail-head">
                {{ data.threadName }}
                <div class="btn-group">
                    <btn :items="[{ iconType: icons.refresh }]"
                         :tooltip-options="{
                            message: i18n.refresh,
                            position: 'bottom-center',
                         }"
                         class="transparent"
                         normal
                         @click="$emit('refresh')" />
                    <btn :items="[{ iconType: icons.newWindow }]"
                         :tooltip-options="{ message: i18n.popupView }"
                         class="transparent"
                         normal
                         @click="$emit('open-popup')" />
                </div>
            </div>
        </template>
        <div class="thread-detail-content">
            <pre class="thread-stacktrace" v-html="data.stackTrace" />
            <div class="config-box">
                <div class="config-item">
                    <span>{{ i18n.lockName }}&nbsp;=&nbsp;{{ data.lockName }}</span>
                </div>
                <div class="config-item">
                    <span>{{ i18n.blockedTime }}&nbsp;=&nbsp;{{ data.blockedTime | convertToLocaleString }}</span>
                </div>
                <div class="config-item">
                    <span>{{ i18n.blockedCount }}&nbsp;=&nbsp;{{ data.blockedCount | convertToLocaleString }}</span>
                </div>
                <div class="config-item">
                    <span>{{ i18n.threadUserTime }}&nbsp;=&nbsp;{{ data.threadUserTime | convertToLocaleString }}</span>
                </div>
                <div class="config-item">
                    <span>{{ i18n.lockOwnerId }}&nbsp;=&nbsp;{{ data.lockOwnerId | convertToLocaleString }}</span>
                </div>
                <div class="config-item">
                    <span>{{ i18n.waitedCount }}&nbsp;=&nbsp;{{ data.waitedCount | convertToLocaleString }}</span>
                </div>
                <div class="config-item">
                    <span>{{ i18n.waitedTime }}&nbsp;=&nbsp;{{ data.waitedTime | convertToLocaleString }}</span>
                </div>
            </div>
        </div>
    </window>
</template>

<script>
    import Window from "@vuejs/component/window/Window";
    import Btn from "@vuejs/component/button/Btn";
    import {ICON_TYPE} from "@vuejs/component/icon/iconType";
    export default {
        name: "StacktraceWindow",
        components: {
            Window,
            Btn,
        },
        inject: {
            i18n: {
                default: () => ({
                    lockName: 'lockName',
                    blockedTime: 'blockedTime',
                    blockedCount: 'blockedCount',
                    threadUserTime: 'threadUserTime',
                    lockOwnerId: 'lockOwnerId',
                    waitedCount: 'waitedCount',
                    waitedTime: 'waitedTime',
                })
            }
        },
        props: {
            data: {
                type: Object,
                required: true,
            }
        },
        filters: {
            convertToLocaleString(value) {
                return value.toLocaleForAries();
            }
        },
        created() {
            this.icons = {
                newWindow: ICON_TYPE.newWindow,
                refresh: ICON_TYPE.refresh,
            };
        },
        beforeMount() {
            const sideBarWidth = 72;
            this.popupOffset = {
                x: 24 + sideBarWidth,
                y: window.innerHeight - 600 - 24,
            };
        },
    }
</script>

<style lang="scss" scoped>
@import "~@common/scss/themes.scss";
$themes: (
    classic: (
        config-bg-color: #f6f6f6,
    ),
    dark: (
            config-bg-color: #222,
    ),
);
.thread-detail-window {
    @include themify($themes) {
        .thread-detail-head {
            display: flex;
            justify-content: space-between;

            .btn-group {
                margin: -8px 4px 0 0;

                > * {
                    margin-left: 0;
                }
            }
        }
        .thread-detail-content {
            display: flex;
            flex-direction: column;
            font-size: 12px;
            line-height: 1.5;
            height: 100%;

            .thread-stacktrace {
                height: 330px;
                overflow: auto;
                margin-bottom: 16px;
            }

            .config-box {
                overflow: auto;
                padding: 16px;
                border-radius: 4px;
                background-color: themed('config-bg-color');
                line-height: 1.5;
            }
        }
    }
}
</style>