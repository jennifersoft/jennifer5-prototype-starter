<template>
    <div class="instance-node-area">
        <div class="header">
            <div class="title">
                {{ selectedTreeName }} {{ i18n.instanceStatus }}
            </div>
            <btn
                class="border-none"
                normal
                :items="[
                    {
                        iconType: listIcon,
                    },
                ]"
                :tooltipOptions="{
                    position: 'top-right',
                    message: i18n.showEventList,
                }"
                :pressed="showEventList"
                @click="toggleShowEventList"
            />
        </div>
        <div
            class="area grid-layout"
            :style="gridColumns"
            @click.stop="onClickInstance(undefined)"
        >
            <instance-node-in-grid-layout
                v-for="agent in agents"
                :key="agent.id"
                :agent="agent"
                :icon-state="state(agent)"
                :class="{ selected: isSelected(agent) }"
                @click.native.stop="onClickInstance(agent)"
                @dblclick.native.stop="onDblClickInstance(agent)"
            />
        </div>
    </div>
</template>

<script>
import EventList from '@entry/realtime/event/EventList';
import { DashboardSocketHandler } from '@module/common/DashboardSocketHandler';
import { Observer } from '@common/legacy/Observer';
import { ElementManager } from '@common/legacy/ElementManager';
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import Btn from '@vuejs/component/button/Btn';

import { OTypeDef } from '@common/definition';
import { DataKeywordInObserver } from '@common/ObserverKeyword';
import { DashboardChartHandler } from '@module/common/DashboardChartHandler';
import { ICON_STATE } from '@module/chart/model/EventModel';
import InstanceNodeInGridLayout from '@entry/realtime/event/InstanceNodeInGridLayout';
import { i18n } from '@common/utility';
import { UIManager } from '@common/legacy/UIManager';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

const nodeHeightWithMargin = 104;
const nodeMinWidthWithMargin = 208;

export default {
    name: 'InstanceNodeArea',
    inject: {
        i18n,
        theme: {
            default: 'classic',
        },
    },
    components: {
        InstanceNodeInGridLayout,
        SvgIcon,
        Btn,
    },
    props: {
        countData: {
            type: Object,
            required: true,
        },
        selectedInstance: {
            type: Object,
        },
        selectedTreeName: {
            type: String,
            default: '',
        },
        showEventList: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            gridLayout: true,
            columnCount: 5,

            agents: [],
            newAlarmList: [],
            eventList: [],
        };
    },
    methods: {
        toggleShowEventList() {
            this.$emit('selected:showEventListSection', !this.showEventList);
        },
        isSelected(agent) {
            if (this.selectedInstance) {
                const { sid, oid } = this.selectedInstance;
                return agent.sid === sid && agent.oid() === oid;
            }
            return false;
        },
        onClickInstance(agent) {
            const value = agent
                ? agent.isUnlicensed() || agent.isStopped()
                    ? undefined
                    : {
                          sid: agent.sid,
                          oid: agent.oid(),
                      }
                : undefined;
            this.$emit('selected:instance', value);
        },
        onDblClickInstance(agent) {
            UIManager.getEventList(
                '/popup/eventList',
                agent.sid,
                OTypeDef.SYSTEM,
                agent.oid(),
                agent.name()
            );
        },
        state(agent) {
            // this.countData
            if (agent.isStopped()) {
                return ICON_STATE.STOPPED;
            } else if (agent.isUnlicensed()) {
                return ICON_STATE.UNLICENCED;
            }

            const sid = agent.sid;
            const oid = agent.oid();

            const eventData = this.countData[sid]?.[oid];
            return eventData?.fatal > 0
                ? ICON_STATE.FATAL
                : eventData?.warning > 0
                ? ICON_STATE.WARNING
                : ICON_STATE.NORMAL;
        },
        caculateColumnCount(element) {
            const sideBarWidth = 72;
            const domainTreeWidth = 360;
            const alarmWidth = 385;
            const marginWidth = 24 * 2;

            // const elWidth =
            //     window.innerWidth -
            //     sideBarWidth -
            //     domainTreeWidth -
            //     alarmWidth -
            //     marginWidth;
            const elWidth = this.$el.clientWidth;
            const elHeight = this.$el.clientHeight;

            const rowCount = Math.floor((elHeight - 62) / nodeHeightWithMargin);

            const canViewColumnCount = Math.floor(
                elWidth / nodeMinWidthWithMargin
            );
            const columnCount = Math.ceil(this.agents.length / rowCount);
            this.columnCount = Math.min(canViewColumnCount, columnCount);

            // this.gridLayout = columnCount <= canViewColumnCount;
        },
    },
    computed: {
        gridColumns() {
            return this.gridLayout
                ? {
                      'grid-template-columns': `repeat(${this.columnCount}, 1fr)`,
                  }
                : {
                      'grid-template-columns': `repeat(${this.columnCount}, 1fr)`,
                  };
        },
    },
    watch: {
        countData() {},
    },
    mounted() {
        this.agents = ElementManager.getCache().instanceList.map(id => {
            return ElementManager.getValue(id);
        });
        Observer.on('domain.tree.select', () => {
            this.agents = ElementManager.getCache().instanceList.map(id => {
                return ElementManager.getValue(id);
            });
            this.caculateColumnCount();
        });

        Observer.on(DataKeywordInObserver.INSTANCE_INFO_IN_DOMAIN, () => {
            const info = DashboardChartHandler.domainRequestInfo();
            if (info.length > 0) {
                window.setTimeout(() => {
                    DashboardSocketHandler.realtimeSend(
                        JSON.stringify(info[0])
                    );
                }, 5 * 1000);
            }

            this.agents = ElementManager.getCache().instanceList.map(id => {
                return ElementManager.getValue(id);
            });
        });

        this.caculateColumnCount();
        const resizeObserver = new ResizeObserver(elArray => {
            this.caculateColumnCount(elArray[0]);
        });
        resizeObserver.observe(this.$el);
    },
    created() {
        this.listIcon = ICON_TYPE.listBulleted;
    },
};
</script>
<style lang="scss" scoped>
@import 'common.scss';

.instance-node-area {
    flex-grow: 1;

    @include themify($themes) {
        > .header {
            margin: 18px 0 24px 0;
            padding: 0 24px;
            font-size: 14px;
            color: themed('section-text-color');
            align-items: center;

            display: flex;
            justify-content: space-between;
        }
        > .area {
            padding: 0 24px;
            height: calc(100vh - 65px - 78px);
            overflow-y: auto;
            &.grid-layout {
                display: grid;
                grid-gap: 16px;
                grid-auto-rows: 88px;
            }

            &:not(.grid-layout) {
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
            }

            justify-content: center;
        }
    }
}
</style>
