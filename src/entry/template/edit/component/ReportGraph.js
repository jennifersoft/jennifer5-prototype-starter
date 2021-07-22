import graph from "../graph/main";

graph.define("editor.jui.chart.metadata.json.line", [], () => {
    return {
        "height" : 255,
        "padding.top" : 50,
        "padding.bottom" : 40,
        "padding.left" : 60,
        "padding.right" : 240,
        "axis.x.type" : "dateblock",
        "axis.x.line" : "solid",
        "axis.y.type" : "range",
        "axis.y.line" : "solid",
        "axis.y.step" : 5,
        "brush.type" : "line",
        "brush.display" : "max",
        "brush.clip" : false,
        "widget.title.align" : "middle",
        "widget.title.orient" : "top",
        "widget.title.dx" : 0,
        "widget.title.dy" : 0,
        "widget.legend.align" : "start",
        "widget.legend.orient" : "right",
        "widget.legend.dx" : -5,
        "widget.legend.dy" : 0,
        "style.colors" : [ "#7977C2", "#7BBAE7", "#FFC000", "#FF7800", "#87BB66", "#1DA8A0", "#929292", "#555D69", "#0298D5", "#FA5559", "#F5A397", "#06D9B6", "#C6A9D9", "#6E6AFC", "#E3E766", "#C57BC3", "#DF328B", "#96D7EB", "#839CB5", "#9228E4" ],
        "style.titleFontSize" : 12,
        "style.titleFontWeight" : "bold",
        "style.titleFontColor" : "#333",
        "style.legendFontSize" : 10,
        "style.legendFontColor" : "#333",
        "style.gridXFontSize" : 10,
        "style.gridXFontColor" : "#333",
        "style.gridYFontSize" : 10,
        "style.gridYFontColor" : "#333",
        "style.tooltipPointFontSize" : 10,
        "style.tooltipPointRadius" : 3,
        "style.lineBorderWidth" : 1.5
    };
});

// 테스트용으로 사용하는 컴포넌트
export default {
    props: {
        code: {
            type: String,
            required: true
        }
    },
    render(createElement) {
        return createElement('div', {}, [
            createElement('textarea', this.code)
        ]);
    },
    mounted() {
        const builder = graph.include("editor.jui.chart.builder");
        const chart = builder(this.$el);
        chart.renderDataURI(null);
    }
}