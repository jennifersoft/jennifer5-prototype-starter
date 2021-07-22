<template>
    <div class="cics-tab" :style="style">
        <div class="left">
            <div class="head title">
                <div class="left">{{ i18n.cicsTransactionResponseTime }}</div>
                <div class="right">
                    {{ totalResponseTimeFormat }}{{ i18n.ms }}
                </div>
            </div>
            <div class="body">
                <section>
                    <div class="title">
                        <div class="left">{{ i18n.cicsSuspendTime }}</div>
                        <div class="right">
                            {{ suspendTimeFormat }}{{ i18n.ms }}
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">
                            <div class="left">{{ i18n.cicsFirstWaitTime }}</div>
                            <div class="right">
                                {{ firstWaitTimeFormat }}{{ i18n.ms }}
                            </div>
                        </div>
                        <div class="graph">
                            <div
                                class="bar"
                                :style="{ width: firstWaitTimePercent }"
                            ></div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">
                            <div class="left">
                                {{ i18n.cicsRmiSuspendTime }}
                            </div>
                            <div class="right">
                                {{ resourceSuspendTimeFormat }}{{ i18n.ms }}
                            </div>
                        </div>
                        <div class="graph">
                            <div
                                class="bar"
                                :style="{ width: resourceSuspendTimePercent }"
                            ></div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">
                            <div class="left">
                                {{ i18n.cicsJvmSuspendTime }}
                            </div>
                            <div class="right">
                                {{ jvmSuspendTimeFormat }}{{ i18n.ms }}
                            </div>
                        </div>
                        <div class="graph">
                            <div
                                class="bar"
                                :style="{ width: jvmSuspendTimePercent }"
                            ></div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">
                            <div class="left">
                                {{ i18n.cicsJvmThreadWaitTime }}
                            </div>
                            <div class="right">
                                {{ jvmThreadWaitTimeFormat }}{{ i18n.ms }}
                            </div>
                        </div>
                        <div class="graph">
                            <div
                                class="bar"
                                :style="{ width: jvmThreadWaitTimePercent }"
                            ></div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">
                            <div class="left">{{ i18n.cicsStartWaitTime }}</div>
                            <div class="right">
                                {{ startWaitTimeFormat }}{{ i18n.ms }}
                            </div>
                        </div>
                        <div class="graph">
                            <div
                                class="bar"
                                :style="{ width: startWaitTimePercent }"
                            ></div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">
                            <div class="left">{{ i18n.cicsMvsWaitTime }}</div>
                            <div class="right">
                                {{ mroWaitTimeFormat }}{{ i18n.ms }}
                            </div>
                        </div>
                        <div class="graph">
                            <div
                                class="bar"
                                :style="{ width: mroWaitTimePercent }"
                            ></div>
                        </div>
                    </div>
                </section>
                <section>
                    <div class="title">
                        <div class="left">{{ i18n.cicsDispatchTime }}</div>
                        <div class="right purple">
                            {{ dispatchTimeFormat }}{{ i18n.ms }}
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">
                            <div class="left">{{ i18n.cicsMvsWaitTime }}</div>
                            <div class="right">
                                {{ mvsWaitTimeFormat }}{{ i18n.ms }}
                            </div>
                        </div>
                        <div class="graph">
                            <div
                                class="bar purple"
                                :style="{ width: mvsWaitTimePercent }"
                            ></div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">
                            <div class="left">{{ i18n.cicsZiipCpuTime }}</div>
                            <div class="right">
                                {{ javaCpuTimeFormat }}{{ i18n.ms }}
                            </div>
                        </div>
                        <div class="graph">
                            <div
                                class="bar purple"
                                :style="{ width: javaCpuTimePercent }"
                            ></div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">
                            <div class="left">{{ i18n.cicsGcpTime }}</div>
                            <div class="right">
                                {{ generalCpuTimeFormat }}{{ i18n.ms }}
                            </div>
                        </div>
                        <div class="graph">
                            <div
                                class="bar purple"
                                :style="{ width: generalCpuTimePercent }"
                            ></div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        <div class="center">
            <table class="table large vborderless borderless">
                <thead>
                    <tr>
                        <th>{{ i18n.cicsFieldName }}</th>
                        <th width="40%">{{ i18n.cicsMonitoringColumn }}</th>
                        <th width="30%">{{ i18n.value }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>TRAN</td>
                        <td>{{ i18n.cicsTransactionName }}</td>
                        <td>{{ transactionName }}</td>
                    </tr>
                    <tr>
                        <td>TRANNUM</td>
                        <td>{{ i18n.cicsTaskId }}</td>
                        <td>{{ taskId }}</td>
                    </tr>
                    <tr>
                        <td>START</td>
                        <td>{{ i18n.startTime }}</td>
                        <td>{{ startTimeFormat }}</td>
                    </tr>
                    <tr>
                        <td>STOP</td>
                        <td>{{ i18n.endTime }}</td>
                        <td>{{ stopTimeFormat }}</td>
                    </tr>
                    <tr>
                        <td>USERID</td>
                        <td>{{ i18n.userId }}</td>
                        <td>{{ userId }}</td>
                    </tr>
                    <tr>
                        <td>CFCAPICT</td>
                        <td>{{ i18n.cicsJavaClassCount }}</td>
                        <td>{{ javaClassCountFormat }}</td>
                    </tr>
                    <tr>
                        <td>JVMTIME</td>
                        <td>{{ i18n.cicsJvmElapsedTime }}</td>
                        <td>{{ jvmElapsedTimeFormat }}{{ i18n.ms }}</td>
                    </tr>
                    <tr>
                        <td>MAXTTDLY</td>
                        <td>{{ i18n.cicsMaxTcbDelayTime }}</td>
                        <td>{{ maxTcbDelayTimeFormat }}{{ i18n.ms }}</td>
                    </tr>
                    <tr>
                        <td>DSAPTHWT</td>
                        <td>{{ i18n.cicsPthreadWaitTime }}</td>
                        <td>{{ pthreadWaitTimeFormat }}{{ i18n.ms }}</td>
                    </tr>
                    <tr>
                        <td>ABCODEO</td>
                        <td>{{ i18n.cicsOriginalAbend }}</td>
                        <td>{{ originalCicsAbend }}</td>
                    </tr>
                    <tr>
                        <td>ABCODEC</td>
                        <td>{{ i18n.cicsCurrentAbend }}</td>
                        <td>{{ currentCicsAbend }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="right">
            <div class="title">
                <div class="left">{{ i18n.cicsExecutionCount }}</div>
                <div class="right">{{ cicsExecutionCountFormat }}</div>
            </div>
            <div class="title">
                <div class="left">{{ i18n.cicsDb2RequestCount }}</div>
                <div class="right">{{ db2RequestCountFormat }}</div>
            </div>
            <div class="title">
                <div class="left">{{ i18n.cicsLinkCount }}</div>
                <div class="right">{{ cicsLinkCountFormat }}</div>
            </div>
            <div class="title">
                <div class="left">{{ i18n.cicsFileAccessCount }}</div>
                <div class="right">{{ fileAccessCountFormat }}</div>
            </div>
            <div class="title">
                <div class="left">{{ i18n.cicsSyncPointCount }}</div>
                <div class="right">{{ cicsSyncPointCountFormat }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from '../store/cics';
import { mapState as baseMapState } from '../store/base';
import { getDayjs, serverDateFormat } from '@common/base';

const DATETIME_FORMAT = `${serverDateFormat.longWithSec}.SSS`;

export default {
    inject: {
        i18n: {
            default: {
                ms: 'ms',
                cicsTransactionResponseTime: 'Transaction Response Time',
                cicsSuspendTime: 'Suspend Time',
                cicsFirstWaitTime: 'First Wait Time',
                cicsRmiSuspendTime: 'RMI Suspend Time',
                cicsJvmSuspendTime: 'JVM Suspend Time',
                cicsJvmThreadWaitTime: 'JVM Thread Wait Time',
                cicsStartWaitTime: 'Start Wait Time',
                cicsMroWaitTime: 'MRO Wait Time',
                cicsDispatchTime: 'Dispatch Time',
                cicsMvsWaitTime: 'MVS Wait Time',
                cicsZiipCpuTime: 'ZIIP Cpu Time',
                cicsGcpTime: 'GCPTime',
                cicsFieldName: 'Field Name',
                cicsMonitoringColumn: 'Monitoring Column',
                value: 'Value',
                cicsTransactionName: 'Transaction Name',
                cicsTaskId: 'Task ID',
                startTime: 'Start Time',
                endTime: 'End Time',
                userId: 'User ID',
                cicsJavaClassCount: 'Java Class Count',
                cicsJvmElapsedTime: 'JVM Elapsed Time',
                cicsMaxTcbDelayTime: 'Max Tcb Delay Time',
                cicsPthreadWaitTime: 'Pthread Wait Time',
                cicsOriginalAbend: 'Original Abend',
                cicsCurrentAbend: 'Current Abend',
            },
        },
    },
    computed: {
        ...baseMapState({
            mainHeight: state => state.mainHeight,
        }),
        ...mapState({
            totalResponseTimeFormat: state =>
                state.totalResponseTime.toLocaleForAries(),
            dispatchTimeFormat: state => state.dispatchTime.toLocaleForAries(),
            suspendTimeFormat: state => {
                return state.suspendTime.toLocaleForAries();
            },

            firstWaitTimeFormat: state =>
                state.firstWaitTime.toLocaleForAries(),
            firstWaitTimePercent: state => {
                return `${Math.round(
                    (state.firstWaitTime / state.suspendTime) * 100
                )}%`;
            },
            resourceSuspendTimeFormat: state =>
                state.resourceSuspendTime.toLocaleForAries(),
            resourceSuspendTimePercent: state => {
                return `${Math.round(
                    (state.resourceSuspendTime / state.suspendTime) * 100
                )}%`;
            },
            jvmSuspendTimeFormat: state =>
                state.jvmSuspendTime.toLocaleForAries(),
            jvmSuspendTimePercent: state => {
                return `${Math.round(
                    (state.jvmSuspendTime / state.suspendTime) * 100
                )}%`;
            },
            jvmThreadWaitTimeFormat: state =>
                state.jvmThreadWaitTime.toLocaleForAries(),
            jvmThreadWaitTimePercent: state => {
                return `${Math.round(
                    (state.jvmThreadWaitTime / state.suspendTime) * 100
                )}%`;
            },
            startWaitTimeFormat: state =>
                state.startWaitTime.toLocaleForAries(),
            startWaitTimePercent: state => {
                return `${Math.round(
                    (state.startWaitTime / state.suspendTime) * 100
                )}%`;
            },
            mroWaitTimeFormat: state => state.mroWaitTime.toLocaleForAries(),
            mroWaitTimePercent: state => {
                return `${Math.round(
                    (state.mroWaitTime / state.suspendTime) * 100
                )}%`;
            },

            mvsWaitTimeFormat: state =>
                (state.dispatchTime - state.totalCpuTime).toLocaleForAries(),
            mvsWaitTimePercent: state => {
                return `${Math.round(
                    ((state.dispatchTime - state.totalCpuTime) /
                        state.dispatchTime) *
                        100
                )}%`;
            },
            javaCpuTimeFormat: state => state.javaCpuTime.toLocaleForAries(),
            javaCpuTimePercent: state => {
                return `${Math.round(
                    (state.javaCpuTime / state.dispatchTime) * 100
                )}%`;
            },
            generalCpuTimeFormat: state =>
                state.generalCpuTime.toLocaleForAries(),
            generalCpuTimePercent: state => {
                return `${Math.round(
                    (state.generalCpuTime / state.dispatchTime) * 100
                )}%`;
            },

            transactionName: state => state.transactionName,
            taskId: state => state.taskId,
            startTimeFormat: state =>
                getDayjs(state.startTime).format(DATETIME_FORMAT),
            stopTimeFormat: state =>
                getDayjs(state.stopTime).format(DATETIME_FORMAT),
            userId: state => state.userId,
            javaClassCountFormat: state =>
                state.javaClassCount.toLocaleForAries(),
            jvmElapsedTimeFormat: state =>
                state.jvmElapsedTime.toLocaleForAries(),
            maxTcbDelayTimeFormat: state =>
                state.maxTcbDelayTime.toLocaleForAries(),
            pthreadWaitTimeFormat: state =>
                state.pthreadWaitTime.toLocaleForAries(),
            originalCicsAbend: state => state.originalCicsAbend,
            currentCicsAbend: state => state.currentCicsAbend,

            cicsExecutionCountFormat: state =>
                state.cicsExecutionCount.toLocaleForAries(),
            db2RequestCountFormat: state =>
                state.db2RequestCount.toLocaleForAries(),
            cicsLinkCountFormat: state =>
                state.cicsLinkCount.toLocaleForAries(),
            fileAccessCountFormat: state =>
                state.fileAccessCount.toLocaleForAries(),
            cicsSyncPointCountFormat: state =>
                state.cicsSyncPointCount.toLocaleForAries(),
        }),
        style() {
            return {
                'max-height': `${this.mainHeight + 10}px`,
            };
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes.scss';

.cics-tab {
    @include themify($themes) {
        display: flex;
        flex-direction: row;
        overflow-y: auto;
        color: themed('cics-tab-font-color');

        /* 공통 */
        .title {
            display: flex;
            > .left {
                flex: 2;
            }
            > .right {
                flex: 1;
                text-align: right;
                font-weight: bold;
            }
        }

        > .left {
            flex: 2;
            border-radius: 4px;
            border: 1px solid themed('cics-tab-box-border-color');

            > .head {
                font-size: 14px;
                font-weight: bold;
                padding: 0px 24px;
                max-height: 40px;
                line-height: 40px;
                border-bottom: 1px solid themed('cics-tab-box-border-color');
            }

            > .body {
                padding: 16px 24px;
                font-size: 11px;

                > section {
                    &:first-child {
                        margin-bottom: 16px;
                    }

                    > .title {
                        font-weight: bold;
                        margin-bottom: 8px;
                        > .right {
                            font-size: 12px;
                            color: #ff9e4c;
                            &.purple {
                                color: #b041af;
                            }
                        }
                    }
                    > .item {
                        &:not(:last-child) {
                            margin-bottom: 8px;
                        }

                        > .title {
                            line-hegiht: 12px;
                            height: 12px;
                        }

                        > .graph {
                            margin-top: 8px;
                            height: 6px;
                            border-radius: 2px;
                            background-color: rgba(0, 0, 0, 0.06);
                            > .bar {
                                height: 6px;
                                border-radius: 2px;
                                background-color: #ff9e4c;
                                &.purple {
                                    background-color: #b041af;
                                }
                            }
                        }
                    }
                }
            }
        }

        > .center {
            flex: 3;
            padding: 0px 16px;
        }

        > .right {
            flex: 1;
            border-radius: 4px;
            padding: 24px;
            border: 1px solid themed('cics-tab-box-border-color');

            > .title {
                &:first-child {
                    padding-top: 0px;
                }
                &:not(:last-child) {
                    border-bottom: 1px solid themed('cics-tab-box-border-color');
                }
                padding: 16px 0px;
                > .right {
                    font-size: 16px;
                }
            }
        }
    }
}
</style>
