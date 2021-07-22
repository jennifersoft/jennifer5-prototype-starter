<template>
    <div class="error-detail-wrapper">
        <div class="loading" v-if="progress < 1">
            <div class="layer">
                <div class="top">
                    <circle-loading
                        :percent="progress * 100"
                        style="margin-bottom: 65px;"
                    >
                    </circle-loading>
                </div>
                <div class="title">{{ i18n.M0630 }}</div>
            </div>
        </div>
        <div class="main-page" v-else>
            <window
                v-if="showDetailPopup"
                :open-x="popupOptions.offsetX"
                :open-y="popupOptions.offsetY"
                :open-w="440"
                :open-h="320"
                hide-footer
                @cancel="showDetailPopup = false"
            >
                <template #subject>
                    <span>{{ popupOptions.data.subject }}</span>
                </template>
                <template #subtitle>
                    {{ formattedTime(popupOptions.data.time) }}
                </template>
                <div class="text">
                    {{ popupOptions.data.detailMessage }}
                </div>
            </window>
            <div class="popup-header">
                <div class="header-text">
                    {{ dataName }}
                </div>
                <div class="header-btn-group">
                    <btn
                        :items="[{ iconType: icons.download }]"
                        :tooltip-options="{
                            position: 'bottom-right',
                            message: i18n.export,
                        }"
                        class="transparent"
                        normal
                        @click="onClickDownload"
                    >
                    </btn>
                </div>
            </div>
            <div class="popup-body">
                <div class="body-title">
                    <span>{{ i18n.searchCount }}</span>
                    <span class="count">
                        {{ list.length.toLocaleForAries() }}
                        {{ i18n.cases }}
                        <tooltip v-if="list.length >= 100000"
                                 :message="i18n.M0647"
                                 position="top-right"
                                 class="alert-icon">
                        <svg-icon :icon-type="icons.caution3"
                                  :width="14"
                                  :height="14" />
                    </tooltip>
                    </span>
                </div>
                <error-detail-table
                    :rows="list"
                    :height="tableHeight"
                    @click="onClickRow"
                >
                </error-detail-table>
            </div>
        </div>
    </div>
</template>

<script>
import ErrorDetailTable from '@entry/popup/errorDetailForMulti/component/ErrorDetailTable';
import Btn from '@vuejs/component/button/Btn';
import Window from '@vuejs/component/window/Window';
import Tooltip from "@vuejs/component/tooltip/Tooltip";
import SvgIcon from "@vuejs/component/icon/SvgIcon";
import CircleLoading from '@entry/popup/xviewAnalysis/component/CircleLoading';
import {
    mapMutations,
    mapState,
    mapActions,
} from '@entry/popup/errorDetailForMulti/vuex';
import { getDayjs, serverDateFormat } from '@common/base';
import { downloadCsv, openXViewPopupForEvent } from '@common/utility';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import _ from '@library/lodash';

export default {
    name: 'App',
    inject: {
        i18n: {
            default: {},
        },
    },
    props: {
        dataOidsBySid: '',
        dataOtype: '',
        dataErrorType: '',
        dataEtime: '',
        dataStime: '',
        dataHash: '',
        dataName: '',
    },
    components: {
        Btn,
        ErrorDetailTable,
        Window,
        CircleLoading,
        SvgIcon,
        Tooltip,
    },
    computed: {
        ...mapState({
            params: state => state.params,
            list: state => state.list,
            progress: state => state.progress,
        }),
    },
    data() {
        return {
            tableHeight: 0,
            showDetailPopup: false,
            popupOptions: {
                data: {
                    detailMessage: '',
                    domainName: '',
                    name: '',
                    serviceName: '',
                    subject: '',
                    time: '',
                },
                offsetX: 24,
                offsetY: window.innerHeight - 24 - 320,
            },
        };
    },
    methods: {
        ...mapMutations(['updateParams']),
        ...mapActions(['requestList']),
        onClickRow(row, e) {
            const { data } = row;
            const { target } = e;
            if (target.classList.contains('link')) {
                if (target.classList.contains('more')) {
                    this.$set(this.popupOptions, 'data', data);
                    this.showDetailPopup = true;
                } else if (target.classList.contains('transaction')) {
                    openXViewPopupForEvent(
                        data.sid,
                        data.time,
                        data.relevantTxId
                    );
                }
            }
        },
        onClickDownload() {
            const names = [
                this.i18n.time,
                this.i18n.domain,
                this.i18n.target,
                this.i18n.errorType,
                this.i18n.message,
                this.i18n.value,
            ];
            const rows = this.list.map(l => ({
                time: getDayjs(l.time).format(serverDateFormat.long),
                domainName: l.domainName,
                name: l.name,
                errorTypeName: l.errorTypeName,
                detailMessage: l.detailMessage
                    .split(',')
                    .join(' ')
                    .split('\n')
                    .join(' '),
                value: l.value === -1 ? '' : l.value,
            }));

            downloadCsv('dberror_list', {
                fields: [
                    'time',
                    'domainName',
                    'name',
                    'errorTypeName',
                    'detailMessage',
                    'value',
                ],
                names,
                rows,
            });
        },
        onResize: _.debounce(function () {
            this.tableHeight = window.innerHeight - 180;
            this.popupOptions = {
                ...this.popupOptions,
                offsetY: window.innerHeight - 24 - 320,
            };
        }, 0),
        formattedTime(time) {
            return getDayjs(time).format('YYYY-MM-DD HH:mm:ss');
        },
    },
    created() {
        this.icons = {
            caution3: ICON_TYPE.caution3,
            download: ICON_TYPE.arrowDownward,
        };
        this.tableHeight = window.innerHeight - 180;
        this.updateParams({
            oidsBySid: this.dataOidsBySid,
            otype: this.dataOtype,
            errorType: this.dataErrorType,
            etime: this.dataEtime,
            stime: this.dataStime,
            hash: this.dataHash,
        });
    },
    mounted() {
        window.addEventListener('resize', this.onResize);
        this.requestList({});
    },
};
</script>

<style lang="scss" scoped>
.error-detail-wrapper {
    .main-page {
        .text {
            max-height: 208px;
            overflow: auto;
            overflow-wrap: anywhere;
        }
        .popup-body > .body-title > .count {
            display: flex;
            align-items: center;
            .icon {
                margin-left: 6px;
            }
        }
    }
}
</style>
