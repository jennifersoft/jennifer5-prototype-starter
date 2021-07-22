<template>
    <div id="regression-main">
        <div class="row-new first">
            <div class="title">{{ i18n.r2 }}</div>
            <div class="precision">{{ regression.r2 | percent }}</div>
        </div>
        <div class="splitter"></div>
        <div class="row-new">
            <div class="title">{{ i18n.prediction }}</div>
        </div>
        <div class="row-new xy x">
            <label>{{ xLabel }}</label>
            <input type="text" v-model="xValue" @keyup="calculateYValue" />
        </div>
        <div class="row-new xy y">
            <label>{{ i18n.prediction }} ({{ yLabel }})</label>
            <input type="text" readonly :value="yValue | decimal" />
        </div>
        <div class="row-new">
            <div class="title">{{ i18n.regressionAnalysis }}</div>
        </div>
        <div class="row-new">
            <dot-chart
                :padding-top="30"
                :padding-left="85"
                :padding-right="10"
                :values="points"
                :height="chartHeight"
                :x-min="xMin"
                :x-max="xMax"
                :y-min="yMin"
                :y-max="yMax"
                :b0="regression.b0"
                :b1="regression.b1"
                :theme="theme"
                :styles="{ backgroundColor: 'transparent' }"
            >
                <note
                    :text="intervalStr"
                    :align="'right'"
                    :vertical-align="'top'"
                    :size="10"
                ></note>
                <note
                    :text="xLabel"
                    :align="'center'"
                    :vertical-align="'bottom'"
                    :size="12"
                    :dy="10"
                ></note>
                <note
                    :text="yLabel"
                    :align="'left'"
                    :vertical-align="'middle'"
                    :size="12"
                    :dx="yLabelDx"
                ></note>
            </dot-chart>
        </div>
        <div class="row-new submit">
            <a
                class="btn small"
                style="display:none;"
                @click="showDetailView = true"
                v-if="!showDetailView"
                >{{ i18n.showAnalysis }}</a
            >
            <div v-else class="detailView">
                <div class="row-new">
                    <div class="title" style="text-align: left;">
                        {{ i18n.analysis }}
                    </div>
                </div>
                <div class="row-new">
                    <table class="table simple">
                        <thead>
                            <tr>
                                <th></th>
                                <th>{{ i18n.freedom }}</th>
                                <th>{{ i18n.sumOfSquares }}</th>
                                <th>{{ i18n.averageOfSquares }}</th>
                                <th>{{ i18n.fValue }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td align="left">{{ i18n.regression }}</td>
                                <td align="right">
                                    {{ regression.ssr | decimal }}
                                </td>
                                <td align="right">{{ regression.ssr_free }}</td>
                                <td align="right">
                                    {{ regression.msr | decimal }}
                                </td>
                                <td align="right">
                                    {{ regression.f | decimal }}
                                </td>
                            </tr>
                            <tr>
                                <td align="left">{{ i18n.error }}</td>
                                <td align="right">
                                    {{ regression.sse | decimal }}
                                </td>
                                <td align="right">{{ regression.sse_free }}</td>
                                <td align="right">
                                    {{ regression.mse | decimal }}
                                </td>
                                <td align="right"></td>
                            </tr>
                            <tr>
                                <td align="left">{{ i18n.total }}</td>
                                <td align="right">
                                    {{ regression.sst | decimal }}
                                </td>
                                <td align="right">{{ regression.sst_free }}</td>
                                <td align="right"></td>
                                <td align="right"></td>
                            </tr>
                        </tbody>
                    </table>

                    <table class="table simple">
                        <thead>
                            <tr>
                                <th width="20%">{{ i18n.precision }}</th>
                                <th>b0({{ i18n.intercept }})</th>
                                <th>b1({{ i18n.slope }})</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td align="right">
                                    {{ regression.r2 | decimal }}
                                </td>
                                <td align="right">{{ regression.b0 }}</td>
                                <td align="right">{{ regression.b1 }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="row-new submit">
                    <a class="btn small" @click="showDetailView = false">{{
                        i18n.hideAnalysis
                    }}</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import VueDotChart from './dotChart';
import NoteWidget from 'vue-graph/src/widgets/note';
import FormatNumberInput from '@vuejs/component/Input/FormatNumberInput';
export default {
    components: {
        'format-number-input': FormatNumberInput,
        'dot-chart': VueDotChart,
        note: NoteWidget,
    },
    inject: {
        theme: {
            default: 'classic',
        },
        i18n: {
            default: {
                precision: 'Precision',
                prediction: 'Prediction',
                regressionAnalysis: 'Regression analysis',
                result: 'Result',
                freedom: 'Freedom',
                sumOfSquares: 'Sum of squares',
                averageOfSquares: 'Average of squares',
                fValue: 'F Value',
                intercept: 'Intercept',
                slope: 'Slope',
                sec: 'sec',
                showAnalysis: 'Show analysis',
                hideAnalysis: 'Hide analysis',
                analysis: 'Analysis',
                regression: 'Regression',
                error: 'Error',
                total: 'Total',
            },
        },
    },
    filters: {
        decimal(val) {
            return val.toFixed(2);
        },
        percent(val) {
            return (val * 100).toFixed(val < 0.01 ? 2 : 0);
        },
    },
    props: {
        xIndex: {
            type: Number,
            required: true,
        },
        yIndex: {
            type: Number,
            required: true,
        },
        xLabel: {
            type: String,
            required: true,
        },
        yLabel: {
            type: String,
            required: true,
        },
        xMin: {
            type: Number,
            required: true,
        },
        yMin: {
            type: Number,
            required: true,
        },
        xMax: {
            type: Number,
            required: true,
        },
        yMax: {
            type: Number,
            required: true,
        },
        regression: {
            type: Object,
            required: true,
        },
        points: {
            type: Array,
            required: true,
        },
        interval: {
            type: Number,
            required: true,
        },
    },
    computed: {
        chartHeight() {
            return document.getElementById('popupContentBody').offsetWidth - 40;
        },
        intervalStr() {
            return `(Interval : ${this.interval * 60}${this.i18n.sec})`;
        },
        yLabelDx() {
            const len = this.yLabel.length;
            if (len < 5) return -60;
            else if (len < 10) return -80;
            else if (len < 15) return -100;
            return -120;
        },
    },
    data() {
        return {
            yValue: this.yMax,
            xValue: this.xMax,
            showDetailView: false,
        };
    },
    methods: {
        calculateYValue() {
            this.yValue = this.regression.b0 + this.xValue * this.regression.b1;
        },
    },
    mounted() {
        this.calculateYValue();
    },
};
</script>

<style lang="scss">
#regression-main {
    padding: 18px 24px;
    .row-new {
        .title {
            font-size: 14px;
            font-weight: bold;
        }

        .precision {
            font-size: 16px;
            font-weight: bold;
            text-align: right;
        }

        &.first {
            display: flex;
            > * {
                flex: 1;
            }
        }
        &.xy {
            position: relative;

            > label {
                font-size: 12px;
                position: absolute;
                top: 11px;
                left: 14px;
            }
        }

        &.x {
            margin-top: 16px;
        }

        &.y {
            margin-top: 10px;
            margin-bottom: 24px;
        }

        &.submit {
            margin-top: 20px;
            text-align: center;
        }
    }

    .splitter {
        margin: 16px 0px 24px 0px;
        height: 1px;
    }

    input {
        display: inline-block;
        vertical-align: middle;
        box-sizing: border-box;
        width: 100%;
        text-align: right;
        font-size: 16px !important;
        padding: 9px 10px !important;
        height: 38px !important;
        text-shadow: none;
        border-radius: 4px;
    }
    input[readonly] {
        cursor: not-allowed;
    }

    .detailView {
        margin-bottom: 20px;
    }

    .table {
        margin-top: 16px;
    }
}

body.classic {
    $precisionFontColor: #4c4fcb;
    $lineBorderColor: #ebebeb;
    $inputFontColor: #333;
    $inputBackgroundColor: #fff;
    $inputBorderColor: #c8c8c8;
    $inputReadOnlyBackgroundColor: #fef8b1;
    $inputReadOnlyFontColor: #333;

    @import 'theme.scss';
}

body.dark {
    $precisionFontColor: #7bbae7;
    $lineBorderColor: #303030;
    $inputFontColor: #d5d5d5;
    $inputBackgroundColor: #1a1a1a;
    $inputBorderColor: #606060;
    $inputReadOnlyBackgroundColor: #ffd872;
    $inputReadOnlyFontColor: #000;

    @import 'theme.scss';
}
</style>
