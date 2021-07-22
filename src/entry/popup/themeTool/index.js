import Vue from 'vue';
import store from '@vuejs/vuex/store';
import { state } from './store/state';
import { mutations } from './store/mutations';
import { STORE_NAMESPACE } from './constant';
import ToolTitle from './component/toolTitle';
import ToolSide from './component/toolSide';
import ToolView from './component/toolView';
import './index.scss';
import { ariesuser } from '@common/base';
import { i18n } from '@common/utility';
import { mapState, mapMutations } from './constant';
import graph from '@entry/template/edit/graph/main';

const SIDE_WIDTH = 350;

store.registerModule(STORE_NAMESPACE, {
    namespaced: true,
    state,
    mutations,
});

new Vue({
    el: '#app',
    store,
    components: {
        ToolTitle,
        ToolSide,
        ToolView,
    },
    provide: {
        i18n: {
            chartSetting: i18n.get('ui.title.templateChartSetting'),
            cancel: i18n.get('ui.button.cancel'),
            submit: i18n.get('ui.button.save'),
            modifyUI: i18n.get('ui.label.modifyUI'),
            modifyCode: i18n.get('ui.label.modifyCode'),
            align: i18n.get('ui.label.align'),
            textColor: i18n.get('ui.label.text.color'),
            sizeAndWidth: i18n.get('ui.label.sizeAndWidth'),
            chartTitle: i18n.get('ui.label.chartTitle'),
            chartHeight: i18n.get('ui.label.chartHeight'),
            chartPadding: i18n.get('ui.label.chartPadding'),
            chartColor: i18n.get('ui.label.chartColor'),
            chartAxis: i18n.get('ui.label.chartAxis'),
            axisText: i18n.get('ui.label.axisText'),
            axisTextStep: i18n.get('ui.label.axisTextStep'),
            showValue: i18n.get('ui.label.showValue'),
            chartGrid: i18n.get('ui.label.chartGrid'),
            xAxis: i18n.get('ui.label.xAxis'),
            yAxis: i18n.get('ui.label.yAxis'),
            chartLegend: i18n.get('ui.label.legend'),
            legendText: i18n.get('ui.label.legendText'),
            line: 'Line',
            bar: 'Bar',
            pie: 'Pie',
        },
        theme: ariesuser.theme,
    },
    data() {
        return {
            sideWidth: SIDE_WIDTH,
            viewWidth: window.innerWidth - SIDE_WIDTH,
            sideViewHeight: window.innerHeight - 68,
        };
    },
    computed: {
        ...mapState({
            useEditor: state => state.useEditor,
        }),
    },
    watch: {
        useEditor(active) {
            this.sideWidth = active ? SIDE_WIDTH + 70 : SIDE_WIDTH;
            this.onResizeWindow();
        },
    },
    methods: {
        ...mapMutations({
            onLoadChartStyles: 'loadChartStyles',
        }),
        onResizeWindow() {
            this.viewWidth = window.innerWidth - this.sideWidth;
            this.sideViewHeight = window.innerHeight - 68;
        },
    },
    mounted() {
        const chartStyles = {
            line: JSON.parse(this.$refs.lineJson.value),
            pie: JSON.parse(this.$refs.pieJson.value),
            bar: JSON.parse(this.$refs.barJson.value),
        };
        this.onLoadChartStyles(chartStyles);

        graph.define(
            `editor.jui.chart.metadata.json.line`,
            [],
            () => chartStyles.line
        );
        graph.define(
            `editor.jui.chart.metadata.json.bar`,
            [],
            () => chartStyles.bar
        );
        graph.define(
            `editor.jui.chart.metadata.json.pie`,
            [],
            () => chartStyles.pie
        );
        window.addEventListener('resize', this.onResizeWindow);
    },
});
