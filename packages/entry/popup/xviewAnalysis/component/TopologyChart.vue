<template>
    <div class="topology-chart">
        <div ref="chart"></div>
    </div>
</template>

<script>
import graph from 'juijs-chart';
import TopologyNode from 'juijs-chart/src/brush/topologynode';
import TopologyTable from 'juijs-chart/src/grid/topologytable';
import TopologyCtrl from 'juijs-chart/src/widget/topologyctrl';
import ClassicIcon from 'juijs-chart/src/icon/classic.js';
import ClassicTheme from '@style/graph/classic';
import DarkTheme from '@style/graph/dark';
import { RemoteCallTypeDef } from '@common/definition';

graph.use(
    TopologyNode,
    TopologyTable,
    TopologyCtrl,
    ClassicIcon,
    ClassicTheme,
    DarkTheme
);

export default {
    inject: {
        theme: {
            type: String,
            default: 'classic',
        },
        i18n: {
            default: {
                ms: 'ms',
                cases: 'cases',
                responseTimeSum: 'response time',
                callCount: 'calls',
            },
        },
    },
    props: {
        data: {
            type: Array,
            required: false,
            default: () => [],
        },
        size: {
            type: Object,
            required: true,
        },
        minimap: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    watch: {
        size(newVal, oldVal) {
            if (
                newVal.width === oldVal.width &&
                newVal.height === oldVal.height
            )
                return;

            this.topology.setSize(newVal.width, newVal.height);
        },
    },
    methods: {
        getIpPortNames(rr) {
            const ipPort = rr.remoteIpPortOrNull
                ? rr.remoteIpPortOrNull.ipAddress +
                  ';' +
                  rr.remoteIpPortOrNull.port
                : 'null';

            const ipPort2 = ipPort.split(';').join(':');

            return [ipPort, ipPort2];
        },
        getRemoteCallName(rr, dd) {
            const ipPort2 = this.getIpPortNames(rr)[1];
            let nn = '';

            if (rr.remoteCallType == RemoteCallTypeDef.HTTP) {
                nn = 'HTTP';
            } else if (rr.remoteCallType == RemoteCallTypeDef.CUSTOM) {
                if (dd.fullMethodDescription != '') {
                    nn = dd.simpleClassName + '.' + dd.methodName;
                } else {
                    nn = ipPort2;
                }
            } else if (rr.remoteCallType == RemoteCallTypeDef.MONGODB) {
                nn = 'MONGODB';
            } else if (
                rr.remoteCallType == RemoteCallTypeDef.UNKNOWN_SQL_DATABASE
            ) {
                nn = ipPort2;
            } else if (rr.remoteCallType == RemoteCallTypeDef.DB2) {
                nn = 'DB2';
            } else if (rr.remoteCallType == RemoteCallTypeDef.ORACLE) {
                nn = 'ORACLE';
            } else if (rr.remoteCallType == RemoteCallTypeDef.MYSQL) {
                nn = 'MYSQL';
            } else if (rr.remoteCallType == RemoteCallTypeDef.MSSQL) {
                nn = 'MSSQL';
            } else if (rr.remoteCallType == RemoteCallTypeDef.CUBRID) {
                nn = 'CUBRID';
            } else if (rr.remoteCallType == RemoteCallTypeDef.DERBY) {
                nn = 'DERBY';
            } else if (rr.remoteCallType == RemoteCallTypeDef.POSTGRESQL) {
                nn = 'POSTGRESQL';
            } else {
                let index = Object.values(RemoteCallTypeDef).indexOf(
                    rr.remoteCallType
                );
                nn = Object.keys(RemoteCallTypeDef)[index];
            }

            return nn;
        },
        getText(time, count) {
            return (
                time.toLocaleForAries() +
                this.i18n.ms +
                ' / ' +
                count.toLocaleForAries() +
                this.i18n.cases
            );
        },
    },
    computed: {
        chartData() {
            const dataList = this.data;
            const nodeData = [];
            const dataKeys = {};
            const edgeData = [];
            const edgeDataKeys = {};
            const callCount = {};

            for (let i = 0; i < dataList.length; i++) {
                const d = dataList[i];
                const k = d.sid + '_' + d.sysOid;

                if (!dataKeys[k]) {
                    dataKeys[k] = {
                        key: k,
                        name: d.instanceName,
                        type: 10,
                        outgoing: [],
                        rowIndex: [i],
                        x: Math.floor(Math.random() * 900) + 15,
                        y: Math.floor(Math.random() * 150) + 15,
                    };

                    nodeData.push(dataKeys[k]);
                }
            }

            for (let i = 0; i < dataList.length; i++) {
                let d = dataList[i],
                    k = d.sid + '_' + d.sysOid,
                    outs = d.piDataList;

                if (outs != null) {
                    for (let j = 0; j < outs.length; j++) {
                        let dd = outs[j],
                            rr = dd.outgoingRemoteCallInfo,
                            kk = '', // key
                            nn = ''; // name

                        // 리모트 콜, 널 체크
                        if (rr == null) continue;

                        // 인스턴스 키/이름 설정
                        if (
                            rr.receiverSidOrZero &&
                            rr.receiverInstanceOidOrZero
                        ) {
                            kk =
                                rr.receiverSidOrZero +
                                '_' +
                                rr.receiverInstanceOidOrZero;

                            if (dataKeys[kk]) {
                                nn = dataKeys[kk].name;
                            } else {
                                continue;
                            }

                            // 리모트 키/이름 설정
                        } else {
                            nn = this.getRemoteCallName(rr, dd);
                            kk =
                                rr.remoteCallType +
                                '_' +
                                this.getIpPortNames(rr)[0] +
                                '_' +
                                rr.fullMethodDescriptionHashKeyOrZero;
                        }

                        // 노드 추가
                        if (!dataKeys[kk]) {
                            dataKeys[kk] = {
                                key: kk,
                                name: nn,
                                type: rr.remoteCallType,
                                isDB: rr.remoteCallTypeIsDB,
                                outgoing: [],
                            };

                            nodeData.push(dataKeys[kk]);
                        }

                        // 노드 아웃고잉 추가
                        if (!dataKeys[k].outgoing.includes(kk)) {
                            dataKeys[k].outgoing.push(kk);
                        }

                        // 엣지 키/데이터 설정
                        let ek = k + ':' + kk;

                        // 호출 개수 설정
                        callCount[ek] = !callCount[ek] ? 1 : callCount[ek] + 1;

                        if (!edgeDataKeys[ek]) {
                            const edge = {
                                key: ek,
                                remoteKey: kk,
                                time: dd.time,
                                count: 0,
                                txid: [dd.txid],
                            };

                            edgeData.push(edge);
                            edgeDataKeys[ek] = edge;
                        } else {
                            const edge = edgeDataKeys[ek];

                            edge.time += dd.time;
                            edge.txid.push(dd.txid);
                        }
                    }
                }
            }

            // Remote Call 개수 처리
            for (let i = 0; i < edgeData.length; i++) {
                edgeData[i].count = callCount[edgeData[i].key];
            }

            return [nodeData, edgeData];
        },
        maxEdge() {
            const maxEdge = { key: 0, time: 0 };

            if (this.edgeData) {
                for (let i = 0; i < this.edgeData.length; i++) {
                    const d = this.edgeData[i];

                    if (d.time > maxEdge.time) {
                        maxEdge.key = d.key;
                        maxEdge.time = d.time;
                    }
                }
            }

            return maxEdge;
        },
    },
    mounted() {
        const brushOpts = {
            type: 'topologynode',
            colors: ['#729ff1'],
            edgeData: this.chartData[1],
            nodeText: data => {
                if (data.type == 10) {
                    return '{was}';
                } else {
                    if (data.isDB) {
                        return '{db}';
                    } else {
                        if (data.type == RemoteCallTypeDef.CUSTOM) {
                            return '{server}';
                        } else if (data.type == RemoteCallTypeDef.HTTP) {
                            return '{ws}';
                        }
                    }
                }
            },
            nodeTitle: data => {
                return data.name;
            },
            tooltipTitle: (data, align) => {
                if (align == 'start') {
                    return data.reverse().join(' ← ');
                }

                return data.join(' → ');
            },
        };

        const brushOpts2 = {
            tooltipText: data => {
                return (
                    this.i18n.responseTimeSum +
                    '/' +
                    this.i18n.callCount +
                    ' : ' +
                    this.getText(data.time, data.count)
                );
            },
            edgeText: (data, align) => {
                var text = this.getText(data.time, data.count);

                if (align == 'end') {
                    text = text + ' →';
                } else {
                    text = '← ' + text;
                }

                return text;
            },
            activeEdge: this.maxEdge.key,
        };

        const brushOpts3 = this.minimap
            ? brushOpts
            : { ...brushOpts, ...brushOpts2 };

        this.topology = graph.create('chart.builder', this.$refs.chart, {
            theme: this.theme,
            width: this.size.width,
            height: this.size.height,
            padding: 5,
            icon: {
                type: 'classic',
            },
            axis: {
                c: {
                    type: 'topologytable',
                },
                data: this.chartData[0],
            },
            brush: brushOpts3,
            widget: this.minimap
                ? []
                : {
                      type: 'topologyctrl',
                      move: true,
                      zoom: true,
                  },
            event: {
                'topology.edgeclick': d => {
                    const result = [];

                    this.data.forEach((row, index) => {
                        if (d.txid.includes(row.txid)) result.push(index);
                    });

                    this.$emit('click-edge', result);
                },
            },
            style: {
                fontFamily: 'Topology Icon',
                backgroundColor: 'transparent',
            },
        });

        if (this.minimap) {
            this.topology.svg.root.css({
                transform: 'scale(0.5)',
                'font-family': 'Topology Icon',
            });
        }
    },
};
</script>

<style lang="scss" scoped>
.topology-chart {
}
</style>
