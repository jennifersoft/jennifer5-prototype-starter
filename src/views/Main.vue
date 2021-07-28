<template>
    <div class="main">
        <div class="item">
            <h3>JENNIFER5 공통 컴포넌트</h3>
            <btn :items="button1" />
            <btn :items="button2" />
            <list-selector
                :list="metrics"
                multi-select
                title-label="Metrics"
                @check="printMetrics"
                style="width: 320px; height: 240px; margin-top: 16px;"
            />
        </div>
        <div class="item">
            <h3>외부 라이브러리(d3.js) 차트</h3>
            <simple-chart
                :domain="[0, 50]"
                :r="3"
                color="blue"
                :data="chartData"
            />
        </div>
        <div class="item"></div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import ListSelector from '@vuejs/component/listSelector/ListSelector';
import SimpleChart from '../components/SimpleChart';
import { metrics } from '../sample-data';

export default {
    components: {
        Btn,
        ListSelector,
        SimpleChart,
    },
    data() {
        return {
            button1: [{ text: 'left' }, { text: 'right' }],
            button2: [{ text: 'left' }, { text: 'center' }, { text: 'right' }],
            fontSize: 11,
            fontWeight: 'bold',
            chartData: [10, 20, 30, 20, 10],
        };
    },
    methods: {
        onChangeFontSize({ value }) {
            this.fontSize = value;
        },
        onChangeFontWeight({ value }) {
            this.fontWeight = value;
        },
        printMetrics(list) {
            console.log(list);
        },
    },
    created() {
        this.metrics = metrics;
    },
};
</script>

<style lang="scss" scoped>
.contents {
    flex: 1;
    padding: 28px 40px;
    display: flex;
    flex-direction: column;
    > .item {
        margin-bottom: 28px;
    }
}
</style>
