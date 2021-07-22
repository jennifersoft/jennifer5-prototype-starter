<template>
    <detail-window
        class="sql-window"
        :top="windowTop"
        @cancel="() => $emit('cancel')"
    >
        <template #subject>
            <span>{{ i18n.showSql }}</span>
        </template>
        <template #contents>
            <pre class="simple">{{ output }}</pre>
            <div class="tools" style="text-align: right;">
                <btn
                    normal
                    :class="[
                        'primary',
                        'transparent',
                        !existParameters ? 'disabled' : '',
                    ]"
                    :items="[{ text: i18n.runBuildAndPlan }]"
                    @click="onRunBuildAndPlan"
                ></btn>
                <btn
                    normal
                    :class="[
                        'primary',
                        'transparent',
                        sherpaOracleUrl === null ? 'disabled' : '',
                    ]"
                    :items="[{ text: i18n.linkToSherpaOracle }]"
                    @click="onLinkToSherpaOracle"
                ></btn>
            </div>
        </template>
    </detail-window>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import {
    printEscape,
    showDBPlanPopup,
    showSherpaOraclePopup,
} from '@common/utility';
import DetailWindow from '../component/DetailWindow';
import { mapState, mapGetters, mapActions } from '../store/base';

export default {
    inject: {
        i18n: {
            default: {
                showSql: 'Show SQL',
                runBuildAndPlan: 'Run SQL',
                notCollected: 'Not Collected',
                linkToSherpaOracle: 'Link To Sherpa',
            },
        },
    },
    components: {
        DetailWindow,
        Btn,
    },
    props: {
        sql: {
            type: String,
            required: true,
        },
        sqlKey: {
            type: Number,
            required: true,
        },

        inlineParameters: {
            type: Array,
            required: false,
            default: () => [],
        },
        boundParameters: {
            type: Array,
            required: false,
            default: () => [],
        },

        sherpaOracleServerConfig: {
            type: String,
            required: false,
            default: '',
        },
        sherpaOracleInstanceName: {
            type: String,
            required: false,
            default: '',
        },
        sherpaOracleSequence: {
            type: Number,
            required: false,
            default: -1,
        },
        sherpaOracleGuid: {
            type: String,
            required: false,
            default: '',
        },
    },
    computed: {
        ...mapState({
            transactionRow: state => state.transactionRow,
            windowTop: state => state.mainHeight - state.distHeight - 95,
        }),
        ...mapGetters(['transactionToProfileSearchParams']),
        output() {
            const inline = this.inlineParameters || [];
            const bound = this.boundParameters || [];

            return `${this.sql}\n\n${this.getParam1(
                inline,
                inline.length === 0
            )}\n${this.getParam2(bound, bound.length === 0)}`;
        },
        existParameters() {
            return (
                (this.inlineParameters && this.inlineParameters.length > 0) ||
                (this.boundParameters && this.boundParameters.length > 0)
            );
        },
    },
    data() {
        return {
            sherpaOracleUrl: null,
        };
    },
    methods: {
        ...mapActions(['getSherpaOracleURL']),
        getParam1(text, notCollected) {
            const title = this.i18n.inlineParam;

            if (notCollected) {
                return title + ':[' + this.i18n.notCollected + ']';
            }

            if (typeof text == 'object' && text != null) {
                const strArr = [];

                for (let i = 0; i < text.length; i++) {
                    strArr.push(printEscape(text[i].value));
                }

                return strArr.length == 0
                    ? ''
                    : title + ':[' + strArr.join(',') + ']';
            } else {
                let str = typeof text == 'string' ? text : '';

                if (str.length > 0) {
                    str = str.substr(0, str.length - 1);
                }

                return str == '' ? '' : title + ':[' + str + ']';
            }
        },
        getParam2(text, notCollected) {
            const title = this.i18n.boundParam;

            if (notCollected) {
                return title + ':[' + this.i18n.notCollected + ']';
            }

            if (typeof text == 'object' && text != null) {
                const strArr = [];

                for (let i = 0; i < text.length; i++) {
                    strArr.push(printEscape(text[i].value));
                }

                return strArr.length == 0
                    ? ''
                    : title + ':[' + strArr.join(',') + ']';
            } else {
                let result = '',
                    tmpList = typeof text == 'string' ? text.split(',') : [];

                for (let i = 0; i < tmpList.length; i++) {
                    let tmpList2 = tmpList[i].split(':');

                    if (tmpList2[1] != undefined) {
                        result += ',' + tmpList2[1];
                    }
                }

                return result == ''
                    ? ''
                    : title + ':[' + result.substr(1) + ']';
            }
        },

        onRunBuildAndPlan() {
            const { sid, stime, etime } = this.transactionToProfileSearchParams;

            showDBPlanPopup(
                sid,
                stime,
                etime,
                this.sqlKey,
                this.inlineParameters,
                this.boundParameters
            );
        },
        onLinkToSherpaOracle() {
            showSherpaOraclePopup(this.sherpaOracleUrl);
        },
    },
    beforeMount() {
        this.getSherpaOracleURL({
            sherpaOracleServerConfig: this.sherpaOracleServerConfig,
            sherpaOracleInstanceName: this.sherpaOracleInstanceName,
            sherpaOracleSequence: this.sherpaOracleSequence,
            sherpaOracleGuid: this.sherpaOracleGuid,
        }).then(url => {
            if (url !== null && url !== '') {
                this.sherpaOracleUrl = url;
            }
        });
    },
};
</script>

<style lang="scss">
.sql-window {
    pre.simple {
        border: 0 !important;
        height: 294px !important;
    }
    .tools {
        margin-right: -12px;
    }
}
</style>
