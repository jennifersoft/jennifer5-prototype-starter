<template>
    <div>
        <div v-if="!!dataThreadName">
            <window
                v-if="activeProfileTerminated"
                :messages="messages"
                :draggable="false"
                :open-x="popupOptions.left"
                :open-y="popupOptions.top"
                :open-w="popupOptions.width"
                @cancel="$emit('close-service-terminated-popup')"
                @apply="onClickRedirect(true)"
            >
                <template #subject>
                    {{ i18n.confirmMessage }}
                </template>
                <div>{{ i18n.M0443 }}</div>
            </window>
            <window
                v-if="showExportedMessage"
                :messages="messages"
                :draggable="false"
                hide-cancel-btn
                :open-x="popupOptions.left"
                :open-y="popupOptions.top"
                :open-w="popupOptions.width"
                @apply="closeExportSuccessWindow"
                @cancel="closeExportSuccessWindow"
            >
                <template #subject>{{ i18n.alertMessage }}</template>
                <div>{{ i18n.M0378 }}</div>
            </window>
            <window
                v-if="threadUncontrollable"
                :messages="messages"
                :draggable="false"
                hide-cancel-btn
                :open-x="popupOptions.left"
                :open-y="popupOptions.top"
                :open-w="popupOptions.width"
                @apply="closeThreadUncontrollableWindow"
                @cancel="closeThreadUncontrollableWindow"
            >
                <template #subject>
                    {{ i18n.alertMessage }}
                </template>
                <div>{{ i18n.M0037 }}</div>
            </window>
            <window
                v-if="showKillWarningMessage"
                apply-btn-type="danger"
                :messages="{ ...messages, apply: i18n.end }"
                :draggable="false"
                :open-x="popupOptions.left"
                :open-y="popupOptions.top"
                :open-w="popupOptions.width"
                @apply="onClickThreadKill"
                @cancel="showKillWarningMessage = false"
            >
                <template #subject>
                    {{ i18n.alertMessage }}
                </template>
                <div>{{ i18n.M0633 }}</div>
            </window>
            <div class="popup-header">
                <div class="header-text">{{ i18n.pageTitle }}</div>
                <div class="header-btn-group">
                    <btn
                        class="transparent"
                        normal
                        :items="[{ iconType: icons.edit }]"
                        :tooltip-options="{
                            message: i18n.shareToTalk,
                            position: 'bottom-right',
                        }"
                        @click="onClickShareToTalk"
                    ></btn>
                    <btn
                        class="transparent"
                        normal
                        :items="[{ iconType: icons.help }]"
                        :tooltip-options="{
                            message: i18n.help,
                            position: 'bottom-right',
                        }"
                        @click="onClickManual"
                    ></btn>
                </div>
            </div>
            <div class="popup-body">
                <div>
                    <table class="active-service-detail-table" ref="table">
                        <tbody>
                            <tr>
                                <td>
                                    <b>{{ i18n.thread }}</b>
                                </td>
                                <td>{{ dataThreadName }}</td>
                            </tr>
                            <tr>
                                <td>
                                    <b>{{ i18n.application }}</b>
                                </td>
                                <td>{{ dataServiceName }}</td>
                            </tr>
                            <tr>
                                <td>
                                    <b>{{ i18n.httpMethod }}</b>
                                </td>
                                <td>{{ dataHttpMethod }}</td>
                            </tr>
                            <tr>
                                <td>
                                    <b>{{ i18n.httpQuery }}</b>
                                </td>
                                <td>{{ dataHttpQuery }}</td>
                            </tr>
                            <tr>
                                <td>
                                    <b>{{ i18n.callTime }}</b>
                                </td>
                                <td>{{ dataCallTime }}</td>
                            </tr>
                            <tr>
                                <td>
                                    <b>{{ i18n.performTime }}</b>
                                </td>
                                <td>{{ dataElapsed }} {{ i18n.sec }}</td>
                            </tr>
                            <tr>
                                <td>
                                    <b>{{ i18n.cpuTime }}</b>
                                </td>
                                <td>{{ dataCpuTime }} {{ i18n.sec }}</td>
                            </tr>
                            <tr>
                                <td>
                                    <b>{{ i18n.sqlWithTxCount }}</b>
                                </td>
                                <td>
                                    {{ dataSqlCount }}/{{ dataTxCallCount }}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <b>{{ i18n.sqlWithTxTime }}</b>
                                </td>
                                <td>
                                    {{ dataSqlTime }}/{{ dataTxCallTime }}
                                    {{ i18n.sec }}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <b
                                        >({{ i18n.performTime }})
                                        {{ i18n.runningSql }}</b
                                    >
                                </td>
                                <td class="overflow-content">
                                    <pre v-if="dataSqlCurTime > '0'">{{
                                        dataSqlText
                                    }}</pre>
                                    <div v-if="dataDbSessionId > '0'">
                                        <br />DB Session ID:[{{
                                            dataDbSessionId
                                        }}]
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <b>{{ i18n.advancedFilterSQLParam }}</b>
                                </td>
                                <td class="overflow-content">
                                    <pre>{{ dataSqlParams }}</pre>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <b
                                        >({{ i18n.performTime }})
                                        {{ i18n.runningExternalCall }}</b
                                    >
                                </td>
                                <td class="overflow-content">
                                    <pre v-if="dataTxCallCurTime > '0'">
                                   {{ txCallContent }}
                                </pre
                                    >
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <b>{{ i18n.fetchedCount }}</b>
                                </td>
                                <td>{{ dataFetchCount }}</td>
                            </tr>
                            <tr>
                                <td>
                                    <b>{{ i18n.batchCount }}</b>
                                </td>
                                <td>{{ dataBatchCount }}</td>
                            </tr>
                            <tr>
                                <td>
                                    <b>{{ i18n.batchTime }}</b>
                                </td>
                                <td>{{ dataBatchTime }} {{ i18n.sec }}</td>
                            </tr>
                            <tr>
                                <td>
                                    <b>{{ i18n.threadState }}</b>
                                </td>
                                <td>{{ dataState }}</td>
                            </tr>
                            <tr>
                                <td>
                                    <b>{{ i18n.userId }}</b>
                                </td>
                                <td>{{ dataLogin }}</td>
                            </tr>
                            <tr>
                                <td>
                                    <b>{{ i18n.guid }}</b>
                                </td>
                                <td>{{ dataGuid }}</td>
                            </tr>
                            <tr>
                                <td>
                                    <b>{{ i18n.browser }}</b>
                                </td>
                                <td>{{ dataBrowser }}</td>
                            </tr>
                            <tr>
                                <td>
                                    <b>{{ i18n.clientIp }}</b>
                                </td>
                                <td>{{ dataIpAddr }}</td>
                            </tr>
                            <tr>
                                <td>
                                    <b>{{ i18n.txid }}</b>
                                </td>
                                <td>{{ txid }}</td>
                            </tr>
                            <tr>
                                <td>
                                    <b>{{ i18n.asyncCallerId }}</b>
                                </td>
                                <td>
                                    <span
                                        class="async-link"
                                        @click="onClickAsyncCallerId"
                                        v-if="dataAsyncCallerId !== ''"
                                        >{{ dataAsyncCallerId }}</span
                                    >
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="stacktrace-wrapper">
                        <div class="title">
                            <b>{{ i18n.stacktrace }}</b>
                        </div>
                        <pre v-html="dataStack"></pre>
                    </div>
                    <div
                        v-if="platform === 'java' || platform === 'net'"
                        class="active-profile-wrapper"
                    >
                        <btn
                            :items="[
                                {
                                    iconType: icons.refresh,
                                    text: i18n.activeProfile,
                                },
                            ]"
                            icon-first
                            class="size-medium active-profile-btn"
                            :disabled="profileStatus !== 'Supported'"
                            :tooltip-options="activeProfileBtnTooltip"
                            @click="onClickActiveProfile"
                        />
                        <pre
                            v-if="
                                activeProfileActive === 'true' &&
                                    activeProfileTextComputed !== ''
                            "
                            style="font-family: monospace !important;"
                            >{{ activeProfileTextComputed }}</pre
                        >
                        <div
                            v-if="permThreadControl === 'true'"
                            class="popup-footer"
                        >
                            <btn
                                :items="[{ text: i18n.interrupt }]"
                                @click="onClickInterrupt"
                            />
                            <btn
                                :items="[{ text: i18n.agentPause }]"
                                @click="onClickSuspend"
                            />
                            <btn
                                :items="[{ text: i18n.play }]"
                                @click="onClickResume"
                            />
                            <btn
                                :items="[{ text: i18n.stop }]"
                                class="outlined danger"
                                style="margin-left: 8px;"
                                @click="showKillWarningMessage = true"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <page-tx-terminated v-else @click="onClickRedirect" />
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import PageTxTerminated from '@entry/popup/activeServiceDetail/PageTxTerminated';
import Window from '@vuejs/component/window/Window';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { Exporter } from '@common/legacy/Exporter';
import { hashManual } from '@common/utility';
import { UIManager } from '@common/legacy/UIManager';

export default {
    name: 'App',
    props: [
        'sid',
        'txid',
        'stime',
        'etime',
        'dataThreadName',
        'dataThreadSuspended',
        'dataServiceName',
        'dataHttpMethod',
        'dataHttpQuery',
        'dataCallTime',
        'dataElapsed',
        'dataCpuTime',
        'dataSqlCount',
        'dataTxCallCount',
        'dataSqlTime',
        'dataTxCallTime',
        'dataSqlCurTime',
        'dataDbSessionId',
        'dataTxCallCurTime',
        'dataFetchCount',
        'dataState',
        'dataLogin',
        'dataGuid',
        'dataIpAddr',
        'dataTxid',
        'dataStime',
        'dataEtime',
        'dataBatchCount',
        'dataBatchTime',
        'dataAsyncCallerId',
        'platform',
        'profileStatus',
        'activeProfileActive',
        'session',
        'thread',
        'permThreadControl',
        'activeProfileTextUpdatedRaw',
        'activeProfileTerminated',
        'threadUncontrollable',
    ],
    inject: {
        i18n: {
            default: () => ({
                pageTitle: 'pageTitle',
                thread: 'thread',
                application: 'application',
                httpMethod: 'httpMethod',
                httpQuery: 'httpQuery',
                callTime: 'callTime',
                performTime: 'performTime',
                sec: 'sec',
                cpuTime: 'cpuTime',
                sqlWithTxCount: 'sqlWithTxCount',
                sqlWithTxTime: 'sqlWithTxTime',
                runningSql: 'runningSql',
                advancedFilterSQLParam: 'advancedFilterSQLParam',
                runningExternalCall: 'runningExternalCall',
                fetchedCount: 'fetchedCount',
                threadState: 'threadState',
                userId: 'userId',
                guid: 'guid',
                browser: 'browser',
                stacktrace: 'stacktrace',
                clientIp: 'clientIp',
                activeServiceEnd: 'activeServiceEnd',
                M0285: 'M0285',
                activeProfile: 'activeProfile',
                interrupt: 'interrupt',
                shareToTalk: 'shareToTalk',
                threadPriority: 'threadPriority',
                agentPause: 'agentPause',
                play: 'play',
                stop: 'stop',
                watchProfilePopup: 'watchProfilePopup',
                watchSharedProfile: 'watchSharedProfile',
                M0378: 'M0378',
                apply: 'confirm',
                cancel: 'cancel',
                confirmMessage: 'confirmMessage',
                M0443: 'M0443',
                alertMessage: 'alertMessage',
                M0037: 'M0037',
                help: 'help',
                M0633: 'M0633',
                end: 'end',
            }),
        },
    },
    components: { Btn, PageTxTerminated, Window },
    data() {
        return {
            isProfileUpdated: false,
            showExportedMessage: false,
            showKillWarningMessage: false,
            dataSqlText: '',
            dataSqlParams: '',
            dataTxCallHash: '',
            dataBrowser: '',
            dataStack: '',
            activeProfileText: '',
        };
    },
    computed: {
        txCallContent() {
            return `(${this.dataTxCallCurTime} ${this.i18n.sec}) ${this.dataTxCallHash}`;
        },
        activeProfileTextComputed() {
            return this.isProfileUpdated
                ? this.activeProfileTextUpdatedRaw
                : this.activeProfileText;
        },
        activeProfileBtnTooltip() {
            return this.profileStatus === 'Supported'
                ? null
                : { message: this.profileStatus };
        },
    },
    methods: {
        onClickRedirect(isProfiled = false) {
            const { sid } = this;
            let { txid, stime, etime } = this;

            if (isProfiled) {
                txid = this.dataTxid;
                stime = this.dataStime - 60 * 60 * 1000;
                etime = this.dataEtime + 60 * 60 * 1000;
            }
            this.$emit('redirect', {
                sid,
                txid,
                stime,
                etime,
            });
        },
        onClickShareToTalk() {
            const {
                dataServiceName,
                sid,
                dataTxid,
                dataStime,
                dataEtime,
            } = this;
            const title = '[' + this.i18n.pageTitle + '] ' + dataServiceName;
            let html = this.$refs.table.outerHTML + '<br />';

            // JQA-649: html 컨텐츠 양을 줄이기 위해
            // vuejs의 scoped style로 인해 생성된 data-v-* 식별자와 불필요한 주석 필터링
            html = html.replace(/ data-v-[a-zA-Z0-9]{4,10}=""/g, '');
            html = html.replace(/<!--(.*?)-->/g, '');

            let link =
                '/xview/profile/text?sid=' +
                sid +
                '&txid=' +
                dataTxid +
                '&stime=' +
                dataStime +
                '&etime=' +
                dataEtime;

            html +=
                "<br /><a data-profile-sid='" +
                sid +
                "' data-profile-txid='" +
                dataTxid +
                "' data-profile-stime='" +
                dataStime +
                "' data-profile-etime='" +
                dataEtime +
                "' class='profile-popup-view'><i class='icon-link'></i> " +
                this.i18n.watchProfilePopup +
                '</a>';
            html +=
                "<br /><a href='" +
                link +
                "' target='_blank' class='profile-link'><i class='icon-link'></i> " +
                this.i18n.watchSharedProfile +
                '</a>';

            Exporter.text(title, html, _ => {
                this.showExportedMessage = true;
            });
        },
        onClickManual() {
            hashManual('popup_activeServiceDetail');
        },
        onClickActiveProfile() {
            const {
                sid,
                session,
                thread,
                dataTxid,
                dataStime,
                dataEtime,
            } = this;
            this.isProfileUpdated = true;
            this.$emit('active-profile', {
                sid,
                session,
                thread,
                txid: dataTxid,
                stime: dataStime,
                etime: dataEtime,
            });
        },
        onClickInterrupt() {
            const { sid, session, thread, dataTxid } = this;
            this.$emit('interrupt', { sid, session, thread, txid: dataTxid });
        },
        onClickSuspend() {
            const { sid, session, thread, dataTxid } = this;
            this.$emit('suspend', { sid, session, thread, txid: dataTxid });
        },
        onClickResume() {
            const { sid, session, thread, dataTxid } = this;
            this.$emit('resume', { sid, session, thread, txid: dataTxid });
        },
        onClickThreadKill() {
            const { sid, session, thread, dataTxid } = this;
            this.$emit('thread-kill', { sid, session, thread, txid: dataTxid });
        },
        onClickAsyncCallerId() {
            const { sid, dataStime, dataEtime } = this;
            const searchRange = 1000 * 60 * 60;

            UIManager.getXViewPointList(
                sid,
                [this.dataAsyncCallerId],
                dataStime - searchRange,
                dataEtime + searchRange,
                this.dataAsyncCallerId,
                undefined,
                undefined,
                'xviewAnalysisForAsync'
            );
        },
        closeExportSuccessWindow() {
            this.showExportedMessage = false;
        },
        closeThreadUncontrollableWindow() {
            this.$emit('close-thread-uncontrollable-popup');
        },
    },
    created() {
        this.icons = {
            edit: ICON_TYPE.edit,
            help: ICON_TYPE.help,
            refresh: ICON_TYPE.refresh,
        };
        this.messages = { apply: this.i18n.apply, cancel: this.i18n.cancel };
        this.popupOptions = {
            width: 350,
            left: window.innerWidth / 2 - 175,
            top: window.innerHeight / 2 - 100,
        };

        const getRawValueFromTextarea = selector => document.querySelector(selector).innerText;

        // quote가 포함되어 props로 받을 수 없는 데이터를 textarea에서 바인딩
        document.addEventListener('DOMContentLoaded', () => {
            this.dataSqlText = `(${this.dataSqlCurTime} ${
                this.i18n.sec
            }) ${getRawValueFromTextarea('#sql-text').replace(/ ,/g, ',\n')}`;
            this.dataSqlParams = getRawValueFromTextarea('#sql-param');
            this.dataTxCallHash = getRawValueFromTextarea('#tx-call-hash');
            this.dataBrowser = getRawValueFromTextarea('#browser');
            this.dataStack = getRawValueFromTextarea('#stacktrace');
            this.activeProfileText = getRawValueFromTextarea('#active-profile');
        });
    },
};
</script>

<style lang="scss" scoped>
@import '~@common/scss/themes.scss';
@import '~@entry/popup/activeServiceDetail/active-service-detail-table.scss';

$themes: (
    classic: (
        code-block-border: #e8e8e8,
        active-profile-border: #999,
        table-row-background-odd: #f9f9f9,
        table-row-data: #212121,
    ),
    dark: (
        code-block-border: #4e4e4e,
        active-profile-border: #616161,
        table-row-background-odd: #222,
        table-row-data: #e8e8e8,
    ),
);

.popup-body {
    .active-service-detail-table {
        @include table-style;
    }
    @include themify($themes) {
        width: 100%;
        pre {
            margin: 0;
        }

        .stacktrace-wrapper {
            .title {
                margin-bottom: 12px;
            }

            pre {
                padding: 20px;
                border: 1px solid themed('code-block-border');
                border-radius: 4px;
                overflow-x: auto;
            }
        }
        .active-profile-wrapper {
            margin-top: 72px;
            padding-bottom: 18px;
            position: relative;

            .active-profile-btn {
                position: absolute;
                top: -48px;
                right: 0;
                margin-bottom: 12px;
                outline: none !important;
            }

            pre {
                padding: 20px;
                border-radius: 4px;
                border: solid 2px themed('active-profile-border');
                height: 240px;
                overflow: auto;
            }
        }
        .popup-footer {
            margin-top: 12px;
            border-radius: 4px;
            border: 1px solid themed('code-block-border');
            padding: 8px;
            display: flex;
            justify-content: flex-end;
            > * {
                margin-left: 8px;
            }
        }

        .async-link {
            cursor: pointer;
            text-decoration: underline;
        }
    }
}
</style>
