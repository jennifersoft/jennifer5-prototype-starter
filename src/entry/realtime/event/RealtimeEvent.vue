<template>
    <div class="realtime-event">
        <common-header
            :subject="menuName"
            :description="i18n.help"
            :is-domain-group-page="isDomainGroupUsage"
            :hide-more-button="iframeLayout"
            :hide-domain-tree="true"
            ref="commonHeader"
            v-if="paramSid === null"
            @active:tree="updateDomainTree"
        >
        </common-header>
        <div class="contents">
            <domain-tree-n-event-status
                v-show="showDomainTree"
                class="tree"
                :event-count-data="countData"
                @selected:tree:name="updateSelectedTreeName"
                @selected:showDomainTree="updateShowDomainTree"
            />

            <instance-node-area
                :count-data="countData"
                :selected-instance.sync="selectedInstance"
                :selected-tree-name="selectedTreeName"
                :show-event-list.sync="showEventListSection"
                @selected:instance="updateSelectedInstance"
                @selected:showEventListSection="updateShowEventListSection"
            />
            <event-list
                v-show="showEventListSection"
                :new-list="filterEventList"
                :event-total-count="filterTotalCount"
                :selected-instance-name="selectedInstanceName"
                @selected:showEventListSection="updateShowEventListSection"
                @selected:event="updateSelectedEvent"
            />
        </div>
        <alarm-detail-window
            v-if="!!selectedEvent"
            :content="selectedEvent"
            @close="updateSelectedEvent"
            @link-xview="openXViewPopup"
        />
    </div>
</template>
<script>
import AlarmDetailWindow from '@layout/component/window/AlarmDetailWindow';
import CommonHeader from '@layout/container/header/CommonHeader';
import DomainTreeNEventStatus from '@entry/realtime/event/DomainTreeNEventStatus';
import EventList from '@entry/realtime/event/EventList';
import Btn from '@vuejs/component/button/Btn';
import Tooltip from '@vuejs/component/tooltip/Tooltip';
import { i18n, openXViewPopupForEvent } from '@common/utility';
import InstanceNodeArea from '@entry/realtime/event/InstanceNodeArea';

import { Observer } from '@common/legacy/Observer';
import {
    ErrorTypeDef,
    EventLevelDef,
    MxDef,
    OIDDef,
    OTypeDef,
    PTypeDef,
} from '@common/definition';
import { ElementManager } from '@common/legacy/ElementManager';
import { getDayjs, serverDateFormat } from '@common/base';
import { DashboardSocketHandler } from '@module/common/DashboardSocketHandler';
import uuidv4 from '@library/uuid';
import JSONbig from 'json-bigint';

export default {
    name: 'RealtimeEvent',
    components: {
        AlarmDetailWindow,
        InstanceNodeArea,
        EventList,
        CommonHeader,
        DomainTreeNEventStatus,

        Btn,
        Tooltip,
    },
    inject: {
        menuName: {
            type: String,
            required: false,
            default: undefined,
        },
        isDomainGroupUsage: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            iframeLayout: false,
            lastAlarmList: [],
            i18n: {
                help: i18n.get('ui.label.help'),
            },
            command: {
                key: undefined,
                oid: [OIDDef.ALL_INST],
                otype: OTypeDef.SYSTEM,
                pkey: 'event_count_and_list',
                ptype: PTypeDef.MISC,
            },
            eventList: [],
            countData: {},
            selectedInstance: undefined,
            selectedEvent: undefined,
            selectedTreeName: undefined,
            showDomainTree: false,
            showEventListSection: true,
            paramSid: undefined,
        };
    },
    methods: {
        requestDataAfter2Second() {
            window.setTimeout(() => {
                DashboardSocketHandler.realtimeSend(
                    JSON.stringify(this.command)
                );
            }, 2000);
        },
        updateSelectedTreeName(name) {
            this.selectedTreeName = name;
            this.selectedInstance = undefined;
        },
        updateDomainTree(active) {
            this.showDomainTree = active;
        },
        updateShowDomainTree(active) {
            this.$refs.commonHeader.onActiveDomainTree();
        },

        updateSelectedInstance(selected) {
            if (
                this.selectedInstance?.sid === selected?.sid &&
                this.selectedInstance?.oid === selected?.oid
            ) {
                this.selectedInstance = undefined;
            } else {
                this.selectedInstance = selected;
                this.showEventListSection = true;
            }
        },

        updateShowEventListSection(show) {
            this.showEventListSection = show;
        },
        updateSelectedEvent(item) {
            this.selectedEvent = item;
        },
        openXViewPopup() {
            const { sid, time, txid } = this.selectedEvent;

            openXViewPopupForEvent(sid, getDayjs(time).valueOf(), txid);
        },
    },
    computed: {
        selectedInstanceName() {
            return this.selectedInstance
                ? ElementManager.getValue(
                      ElementManager.id(
                          this.selectedInstance.sid,
                          this.selectedInstance.oid
                      )
                  ).shortName
                : undefined;
        },
        filterTotalCount() {
            const sidList = ElementManager.getSelectedDomainSidList();

            return this.selectedInstance
                ? this.countData[this.selectedInstance.sid]
                    ? this.countData[this.selectedInstance.sid][
                          this.selectedInstance.oid
                      ]
                    : { normal: 0, warning: 0, fatal: 0 }
                : Object.keys(this.countData)
                      .filter(sid => sidList.includes(Number(sid)))
                      .map(sid => Object.values(this.countData[sid]))
                      .flat(2)
                      .reduce(
                          (acc, eventCountData) => {
                              acc.normal += eventCountData.normal;
                              acc.warning += eventCountData.warning;
                              acc.fatal += eventCountData.fatal;
                              return acc;
                          },
                          { normal: 0, warning: 0, fatal: 0 }
                      );
        },
        filterEventList() {
            return this.selectedInstance
                ? this.eventList.filter(
                      row =>
                          row.sid === this.selectedInstance.sid &&
                          row.oid === this.selectedInstance.oid
                  )
                : this.eventList;
        },
    },
    mounted() {
        this.requestDataAfter2Second();
        //도메인 트리가 열려진 상태로 보이게..
        this.updateShowDomainTree();
        //이벤트 데이터
        Observer.on('load.' + this.command.key, data => {
            const { count, recentList } = data[this.command.key];

            this.countData = count;

            const invertOfMxDef = Object.assign(
                ...Object.keys(MxDef).map(key => {
                    const value = MxDef[key];
                    return { [MxDef[key]]: key };
                })
            );

            const invertOfErrorTypeDef = Object.assign(
                ...Object.keys(ErrorTypeDef).map(key => {
                    const value = ErrorTypeDef[key];
                    return { [ErrorTypeDef[key]]: key };
                })
            );

            const sidList = ElementManager.getSelectedDomainSidList();

            this.eventList = Object.keys(recentList)
                .filter(sid => sidList.includes(Number(sid)))
                .map(sid => recentList[sid])
                .flat()
                .map(row => {
                    const { domainId, oid } = row;

                    const domain = ElementManager.getValue(
                        ElementManager.id(domainId)
                    );
                    const agent = ElementManager.getValue(
                        ElementManager.id(domainId, oid)
                    );

                    const subject =
                        row.metricIdOrZero !== 0
                            ? i18n.get(
                                  'ui.mx.' + invertOfMxDef[row.metricIdOrZero]
                              )
                            : invertOfErrorTypeDef[row.errorTypeOrZero];
                    const detailMessage = row.detailMessageOrNull ?? '';
                    const detail =
                        row.simpleMessage + ` value=${row.valueOrN1}`;

                    const time = getDayjs(row.time).format(
                        serverDateFormat.longWithSec
                    );

                    const txid = row.sourceTransactionIdOrZero.toString();
                    return {
                        sid: domainId,
                        oid,
                        name: `${domain.shortName}, ${agent.shortName}`,
                        level:
                            row.level === EventLevelDef.WARNING
                                ? 'warning'
                                : row.level === EventLevelDef.FATAL
                                ? 'fatal'
                                : 'normal',
                        detail,
                        detailMessage,
                        subject,
                        time,
                        txid,
                        uuid: row.key.toString(),
                    };
                })
                .sort((a, b) => b.time - a.time);

            //이벤트 데이터는 모든 도메인걸 요청함. 도메인 트리에서 상태를 표시하기 위함.
            this.command.sid = ElementManager.getAllDomainSidList();
            this.requestDataAfter2Second();
        });
    },
    created() {
        const urlParams = new URLSearchParams(location.search);
        this.paramSid = urlParams.get('sid');

        const initData = this.paramSid
            ? Observer.get('elements').filter(
                  domain => domain.sid === Number(this.paramSid)
              )
            : Observer.get('elements');

        ElementManager.init(initData);
        DashboardSocketHandler.realtimeSocketInit(JSONbig.parse);

        this.command.key = uuidv4();

        this.iframeLayout = urlParams.get('layout') === 'iframe';
    },
};
</script>

<style lang="scss" scoped>
@import 'common.scss';
.realtime-event {
    height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    .contents {
        display: flex;
        flex-direction: row;
        flex-grow: 1;

        @include themify($themes) {
            .tree {
                border-right: 1px solid themed('box-border-color');
            }

            .event-list {
                border-left: 1px solid themed('box-border-color');
                flex: 0 0 385px;
                width: 385px;
            }
        }
    }
}
</style>
