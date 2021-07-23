import Vue from 'vue';
import Btn from '@vuejs/component/button/Btn';
import ListSelector from '@vuejs/component/listSelector/ListSelector';
import SimpleChart from './SimpleChart';
import SideBar from './components/side-bar';
import styled from 'vue-styled-components';
import { metrics } from './sample-data';
import './index.scss';

const Wrapper = styled.div`
    padding: 0;
    display: flex;
    > .contents {
        flex: 1;
        padding: 28px 40px;
        display: flex;
        flex-direction: column;
        > .item {
            margin-bottom: 28px;
        }
    }
`;

new Vue({
    el: '#vue-app',
    provide: {
        theme: 'classic',
    },
    components: {
        Wrapper,
        ListSelector,
        Btn,
        SimpleChart,
        SideBar,
    },
    data() {
        return {
            button1: [{ text: 'left' }, { text: 'right' }],
            button2: [{ text: 'left' }, { text: 'center' }, { text: 'right' }],
            fontSize: 11,
            fontWeight: 'bold',
            chartData: [10, 20, 30, 20, 10]
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
        }
    },
    render() {
        return (
            <Wrapper>
                <SideBar />
                <div class="contents">
                    <div class="item">
                        <h3>JENNIFER5 공통 컴포넌트</h3>
                        <Btn items={this.button1} /> <Btn items={this.button2} />
                        <ListSelector list={metrics}
                                    multiSelect
                                    titleLabel={'Metrics'}
                                    onCheck={this.printMetrics}
                                    style="width: 320px; height: 240px; margin-top: 16px;" />
                    </div>
                    <div class="item">
                        <h3>외부 라이브러리(d3.js) 차트</h3>
                        <simple-chart domain={[0, 50]} r={3} color={"blue"} data={this.chartData} />
                    </div>
                    <div class="item">
                    </div>
                </div>
            </Wrapper>
        )
    }
});
