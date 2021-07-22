<template>
    <div
        class="tool-view"
        :style="{ width: width + 'px', height: height + 'px' }"
    >
        <view-chart :key="chartKey" :json="chartJson"></view-chart>
    </div>
</template>

<script>
import ViewChart from './toolViewChart'
import { mapState } from '../constant'
import lineData from '../data/line'
import pieData from '../data/pie'
import barData from '../data/bar'

const DEFAULT_DATA = {
    line: lineData,
    pie: pieData,
    bar: barData,
}

export default {
    components: {
        ViewChart,
    },
    props: {
        width: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        codeType: {
            type: String,
            required: true,
        },
    },
    watch: {
        editorCode(code) {
            try {
                const chartData = Object.assign(
                    {
                        theme: JSON.parse(code),
                    },
                    DEFAULT_DATA[this.activeTab]
                )

                this.chartKey += 1
                this.chartJson = JSON.stringify(chartData)
            } catch (e) {}
        },
    },
    computed: {
        ...mapState({
            editorCode: state => state.editorCode,
            activeTab(state) {
                return this.codeType != 'all' ? this.codeType : state.activeTab
            },
        }),
    },
    data() {
        return {
            chartKey: 0,
            chartJson: '',
        }
    },
}
</script>

<style lang="scss" scoped>
.tool-view {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px;

    textarea {
        display: none;
    }
}
</style>
