import $ from '@library/jquery';
import _ from '@library/lodash';
import { Observer } from '@common/legacy/Observer';
import { ElementManager } from '@common/legacy/ElementManager.js';
import { DomainGroupManager } from '@common/legacy/DomainGroupManager.js';
import { DashboardChartHandler } from '@module/common/DashboardChartHandler.js';
import { DashboardSocketHandler } from '@module/common/DashboardSocketHandler.js';

import './index.scss';
import '@entry/dashboard/layout';

import {
    commonProvideProperties,
    doChangeLayoutInBuiltInDashboard,
    fixDataForLegacy,
} from '@entry/dashboard/common';

import { dashboardProp } from '@data/topology';
import { registerAfterMakeInternalChartWithChartOption } from '@module/common/DashboardChartHandler';
import { GenerateKey } from '@module/global/GenerateKey';
import Vue from 'vue';
import CommonHeader from '@layout/container/header/CommonHeader';
import TopBar from '@vuejs/container/topbar/TopBar';
import DashboardContentArea from '@entry/userdefine/dashboard/component/DashboardContentArea';
import XViewWindow from '@entry/userdefine/dashboard/component/XViewWindow';
import InputField from '@vuejs/component/Input/InputField';
import Btn from '@vuejs/component/button/Btn';
import Window from '@vuejs/component/window/Window';
import { i18n } from '@common/utility';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import store, { NAMESPACE } from '@entry/dashboard/topology/store';
import { createNamespacedHelpers } from 'vuex';

window.notUseDomainBox = Observer.get('isDomainGroupUsage') === false;

const provideProperties = Object.assign(commonProvideProperties, {
    useExtendOrOriginInChartPosition: true,
});
$(document).ready(function(event) {
    // 도메인그룹을 사용하지 않을때는 전체 도메인 리스트를 다 보여준다.
    if (!Observer.get('isDomainGroupUsage')) {
        DomainGroupManager.setMultiDomain(true); // 전체 도메인을 다 선택한다.
        ElementManager.generateCache();
    }
});

function selectTopologyHandler(nodeOrEdge) {
    const xviewChart = DashboardChartHandler.bigdataCharts()[0];
    const model = xviewChart.getModel();

    model.clear();
    //드래그하여 그룹생성할때도 호출 되는거 같다.
    if (_.isUndefined(nodeOrEdge)) {
        topologyRoot.xviewDataExists = false;
    } else {
        topologyRoot.xviewDataExists = true;

        //여기서 xview데이터를 요청한다.
        //선택된것 기준으로 groupBy하여 보내야할 sid로 요청한다.
        var topologyInfo = {};

        if (nodeOrEdge.isNode() && nodeOrEdge.isGroupNode() == false) {
            topologyInfo[nodeOrEdge.sid] = {};
            topologyInfo[nodeOrEdge.sid].oid = [];

            topologyInfo[nodeOrEdge.sid].oid.push(nodeOrEdge.oid);

            xviewChart.model.topologyInfo = topologyInfo;
            xviewChart.model.requestTopologyXView();
        } else if (nodeOrEdge.isNode() && nodeOrEdge.isGroupNode()) {
            var children = nodeOrEdge.getChildren();
            for (var i = 0; i < children.length; i++) {
                if (children[i].instance) {
                    if (!topologyInfo[children[i].sid]) {
                        topologyInfo[children[i].sid] = {};
                        topologyInfo[children[i].sid].oid = [];
                    }

                    topologyInfo[children[i].sid].oid.push(children[i].oid);
                }
            }

            xviewChart.model.topologyInfo = topologyInfo;
            xviewChart.model.requestTopologyXView();
        } else {
            //source,target에서 개별노드를 얻어온후 instance라면 반대군의 리스트를 가져와서 incoming과 outgoing정보를 넘긴다.
            //incoming,outgoing의 정보는 해당 oid에 붙여서 넘긴다.
            //incoming은 우리 에이젼트, outgoing은 다른 예외 노드라고 가정하고 넘긴다.
            //양방향 모든 산정해서 setting한다.
            settingEdge(topologyInfo, nodeOrEdge.source, nodeOrEdge.target);
            settingEdge(topologyInfo, nodeOrEdge.target, nodeOrEdge.source);

            xviewChart.model.topologyInfo = topologyInfo;
            xviewChart.model.requestTopologyXView();
        }
    }
}

function settingEdge(topologyInfo, source, target) {
    if (source.isGroupNode()) {
        var children = source.getChildren();
        for (var i = 0; i < children.length; i++) {
            if (children[i].instance) {
                var sid = children[i].sid,
                    oid = children[i].oid;

                if (!topologyInfo[sid]) {
                    topologyInfo[sid] = {};
                }

                if (!topologyInfo[sid][oid]) {
                    topologyInfo[sid][oid] = { incoming: [], outgoing: [] };
                }

                settingEdgeDest(topologyInfo, sid, oid, target);
            }
        }
    } else {
        if (source.instance) {
            var sid = source.sid,
                oid = source.oid;

            if (!topologyInfo[sid]) {
                topologyInfo[sid] = {};
            }

            if (!topologyInfo[sid][oid]) {
                topologyInfo[sid][oid] = { incoming: [], outgoing: [] };
            }

            settingEdgeDest(topologyInfo, sid, oid, target);
        }
    }
}

function settingEdgeDest(topologyInfo, sourceSid, sourceOid, target) {
    if (target.isGroupNode()) {
        var targetChildren = target.getChildren();
        for (var j = 0; j < targetChildren.length; j++) {
            if (targetChildren[j].instance) {
                var callerSid = targetChildren[j].sid,
                    callerOid = targetChildren[j].oid;

                //incoming
                topologyInfo[sourceSid][sourceOid].incoming.push({
                    httpCallerSid: callerSid,
                    httpCallerOid: callerOid,
                });
            } else {
                var remoteCallType = targetChildren[j].remoteCallType,
                    customMethodDescHashOrZero =
                        targetChildren[j].customMethodDescHashOrZero,
                    ipAddressOrEmpty = targetChildren[j].ipAddressOrEmpty,
                    portOrZero = targetChildren[j].portOrZero;

                //outgoing
                topologyInfo[sourceSid][sourceOid].outgoing.push({
                    remoteCallType: remoteCallType,
                    customMethodDescHashOrZero: customMethodDescHashOrZero,
                    ipAddressOrEmpty: ipAddressOrEmpty,
                    portOrZero: portOrZero,
                });
            }
        }
    } else {
        if (target.instance) {
            var callerSid = target.sid,
                callerOid = target.oid;

            //incoming
            topologyInfo[sourceSid][sourceOid].incoming.push({
                httpCallerSid: callerSid,
                httpCallerOid: callerOid,
            });
        } else {
            var remoteCallType = target.remoteCallType,
                customMethodDescHashOrZero = target.customMethodDescHashOrZero,
                ipAddressOrEmpty = target.ipAddressOrEmpty,
                portOrZero = target.portOrZero;

            //outgoing
            topologyInfo[sourceSid][sourceOid].outgoing.push({
                remoteCallType: remoteCallType,
                customMethodDescHashOrZero: customMethodDescHashOrZero,
                ipAddressOrEmpty: ipAddressOrEmpty,
                portOrZero: portOrZero,
            });
        }
    }
}

const { mapState, mapMutations, mapActions } = createNamespacedHelpers(
    NAMESPACE
);

const labsOrPlugin =
    location.pathname === '/labs' || location.pathname.includes('/plugin');
const menuName = labsOrPlugin
    ? i18n.get('ui.title.labs')
    : $('input[name=menuName]').val();
const isDomainGroupUsage = $('input[name=isDomainGroupUsage]').val() === 'true';

const topologyRoot = new Vue({
    el: '#vue_app',
    store,
    components: {
        CommonHeader,
        TopBar,
        DashboardContentArea,
        XViewWindow,
        InputField,
        Btn,
        Window,
    },
    provide: {
        ...provideProperties,
        isDomainGroupUsage: isDomainGroupUsage,
        menuName: menuName,
        showRightMenusInHeader: true,
        hideDomainGroupTree: dashboardProp.domainBar === undefined,
        i18n: {
            ...provideProperties.i18n,
            edit: i18n.get('ui.label.edit'),
            delete: i18n.get('ui.button.delete'),
            domainGroup: i18n.get('ui.label.domainGroup'),
            more: i18n.get('ui.label.more'),
            dashboardMenu: i18n.get('ui.label.dashboard.menu'),
            bookmark: i18n.get('ui.label.bookmark'),
            help: i18n.get('ui.label.help'),
            dashboard: i18n.get('ui.en.dashboard'),
            realtime: i18n.get('ui.en.realtime'),
            userdefined: i18n.get('ui.label.userdefineddashboard'),
            userdefinedCreate: i18n.get('ui.label.userdefineddashboard.create'),
            align: i18n.get('ui.label.align'),
            updatedTime: i18n.get('ui.labe.updatedTime'),
            name: i18n.get('ui.label.name'),
            viewAll: i18n.get('ui.label.viewAll'),
            viewMyGroup: i18n.get('ui.label.viewMyGroup'),
            apply: i18n.get('ui.button.apply'),
            cancel: i18n.get('ui.button.cancel'),

            confirmMessage: i18n.get('ui.label.confirmMessage'),
            searchDashboard: i18n.get('ui.label.dashboard.search'),
            M0270: i18n.get('M0270'),
            M0621: i18n.get('M0621'),

            subject: i18n.get('M0270'),
            contents: i18n.get('M0622'),
            save: i18n.get('ui.button.save'),
            M0180: i18n.get('M0180'),
            M0181: i18n.get('M0181'),
            M0185: i18n.get('M0185'),
            M0186: i18n.get('M0186'),
            eventNotification: i18n.get('ui.label.eventNotification'),
            showXviewChart: i18n.get('ui.label.showXview'),
            xView: i18n.get('ui.label.charttype.xview'),
        },
    },
    data() {
        return {
            domainBar: dashboardProp.domainBar,
            xviewIcon: ICON_TYPE.chartScatter,
            closeIcon: ICON_TYPE.close,
            xviewDataExists: true,
            groupName: '',
            showGroupNameField: false,
        };
    },
    computed: {
        ...mapState({
            showXView: state => state.showXView,
        }),
    },
    methods: {
        ...mapMutations(['toggleXView']),
        ...mapActions(['addGroupNode', 'removeGroupNode', 'loadDashboard']),
        onInitGroupNode(name) {
            if (name !== undefined) {
                this.groupName = name;
                this.showGroupNameField = true;
            } else {
                this.groupName = '';
                this.showGroupNameField = false;
            }
        },

        toNonEditGroupNode() {
            const topologyChart = DashboardChartHandler.topologyCharts()[0];
            topologyChart.groupEditNode.name = this.groupName;
            topologyChart.groupEditNode.isEdit = false;

            topologyChart.groupEditNode = undefined;

            this.showGroupNameField = false;
        },
        onRemoveGroupNode() {
            this.showGroupNameField = true;
            this.removeGroupNode();
            this.$nextTick(() => {
                this.showGroupNameField = false;
            });
        },
    },
    created() {
        doChangeLayoutInBuiltInDashboard(this.$store);
        this.$store.commit(
            'dashboard/setComponents',
            fixDataForLegacy(dashboardProp.charts)
        );
        this.$store.commit('dashboard/setTopbar', dashboardProp.domainBar);
    },
    mounted() {
        const topologyChart = DashboardChartHandler.topologyCharts()[0];
        topologyChart.selectHandler(selectTopologyHandler);

        topologyChart.groupNodeEditHandler(this.onInitGroupNode);
        topologyChart.toNonEditGroupNodeHandler(this.toNonEditGroupNode);

        registerAfterMakeInternalChartWithChartOption(
            {
                charttype: 'xview.topology',
                domainBarSync: true,
                dataKey: GenerateKey.makeLongKeyByTime(),
            },
            document.querySelector('#xviewChart')
        ).paintEveryInterval();
        DashboardSocketHandler.bigdataSocketInit();

        // xview에서 사용하는 bigdata 웹소켓이 끊어짐을 방지하기 위해 10초에 한번씩 ping 날림
        const xviewChart = DashboardChartHandler.bigdataCharts()[0];
        window.setInterval(() => {
            xviewChart.model.requestPing();
        }, 10 * 1000);

        //노드 데이터를 받은후에 위치 데이터를 로드해야 적용이 가능하다. 3초면 적당함.
        window.setTimeout(() => {
            this.loadDashboard();
            this.showGroupNameField = false;
        }, 3 * 1000);
    },
});
