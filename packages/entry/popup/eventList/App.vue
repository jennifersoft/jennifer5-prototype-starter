<template>
    <div class="event-list-wrapper">
        <div class="popup-header">
            <div class="header-text">
                {{ title }}
            </div>
            <div class="header-btn-group">
                <btn
                    class="transparent"
                    normal
                    :items="[{ iconType: toolIcon }]"
                    :disabled="!onlyUnrecovered"
                    :tooltip-options="{ message: i18n.recoveryAll }"
                    @click="recoveryEvents"
                >
                </btn>
                <btn
                    :items="[{ iconType: helpIcon }]"
                    @click="openManualPopup"
                    class="transparent"
                    normal
                ></btn>
            </div>
        </div>
        <div class="popup-body" style="padding-left: 0px; padding-right: 0px;">
            <window
                v-if="showDetailPopup"
                :open-x="24"
                :open-w="440"
                :open-h="320"
                :open-y="popupOptions.offsetY"
                hide-footer
                @cancel="showDetailPopup = false"
            >
                <template #subject>
                    <span>{{ popupOptions.data.subject }}</span>
                </template>
                <template #subtitle>
                    {{ formattedTime(popupOptions.data.time) }}
                </template>
                <div
                    style="overflow: auto; overflow-wrap: anywhere; height: 208px;"
                >
                    {{ popupOptions.data.detailMessage }}
                </div>
            </window>
            <div class="body-title">
                <div>
                    {{ i18n.searchCount }}
                    <span class="count"
                        >({{ tableData.length.toLocaleString() }})</span
                    >
                </div>
                <div>
                    <checkbox
                        :active="onlyUnrecovered"
                        @change="toggleOnlyUnrecovered"
                        :label="i18n.showOnlyUnrecovered"
                    >
                    </checkbox>
                </div>
            </div>
            <event-list-table
                :rows="tableData"
                :height="tableHeight"
                @click="onClickRow"
            >
            </event-list-table>
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import Checkbox from '@vuejs/component/Toggle/Checkbox';
import EventListTable from '@entry/popup/eventList/EventListTable';
import Window from '@vuejs/component/window/Window';
import {
    getEventData,
    hashManual,
    openXViewPopupForEvent,
} from '@common/utility';
import { getDayjs } from '@common/base';
import { OTypeDef } from '@common/definition';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import {
    mapMutations,
    mapState,
    mapActions,
} from '@entry/popup/eventList/store';

export default {
    name: 'App',
    inject: {
        i18n: {
            default: {
                recoveryAll: 'Recover all',
                searchCount: 'Search count',
                showOnlyUnrecovered: 'Show only unrecovered',
            },
        },
    },
    components: {
        Btn,
        Checkbox,
        EventListTable,
        Window,
    },
    props: {
        title: {
            type: String,
            required: true,
        },
        dataDomainJson: '',
        dataSid: '',
        dataOid: '',
        dataOtype: '',
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
    watch: {
        onlyUnrecovered(next, prev) {
            if (next !== prev) {
                this.requestList({});
            }
        },
    },
    computed: {
        ...mapState({
            tableData: state => state.tableData,
            onlyUnrecovered: state => state.onlyUnrecovered,
        }),
    },
    methods: {
        ...mapMutations(['updateParams', 'toggleOnlyUnrecovered']),
        ...mapActions(['requestList', 'recoveryEvents']),
        openManualPopup() {
            hashManual('popup_eventList');
        },
        onClickRow({ data }, { target }) {
            if (target.classList.contains('link')) {
                if (target.classList.contains('more')) {
                    this.$set(this.popupOptions, 'data', getEventData(data));
                    this.popupOptions = {
                        ...this.popupOptions,
                    };
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
        onResize() {
            this.tableHeight = window.innerHeight - 180;
            this.popupOptions = {
                ...this.popupOptions,
                offsetY: window.innerHeight - 24 - 320,
            };
        },
        formattedTime(time) {
            return getDayjs(time).format('YYYY-MM-DD HH:mm:ss');
        },
    },
    created() {
        this.toolIcon = ICON_TYPE.tool;
        this.helpIcon = ICON_TYPE.help;
        this.tableHeight = window.innerHeight - 180;
    },
    mounted() {
        window.addEventListener('resize', this.onResize);
        this.updateParams({
            domainJson: this.dataDomainJson || null,
            sid: this.dataSid,
            oid: this.dataOid,
            otype: this.dataOtype,
            isBiz:
                this.dataOtype !== '' &&
                parseInt(this.dataOtype) === OTypeDef.BUSINESS,
        });
        this.requestList({});
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
    },
};
</script>

<style scoped></style>
