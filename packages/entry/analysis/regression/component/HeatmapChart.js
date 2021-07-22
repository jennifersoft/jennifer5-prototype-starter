import graph from "juijs-chart";
import graph_core from "vue-graph/src/components/core.js";
import watch from "vue-graph/src/base/watch.js";
import created from "vue-graph/src/base/created.js";
import mounted from "vue-graph/src/base/mounted.js";
import props from "vue-graph/src/base/props.js";
import methods from "vue-graph/src/base/methods.js";

graph.redefine("chart.brush.heatmap", [ "util.base" ], function(_) {
    const HeatmapBrush = function() {
        const self = this;

        this.draw = function() {
            let bw = this.chart.theme("heatmapBorderWidth"),
                fs = this.chart.theme("heatmapFontSize"),
                g = this.svg.group(),
                w = this.axis.x.rangeBand() - bw,
                h = this.axis.y.rangeBand() - bw;

            // domain이 없을 경우에 대한 처리
            if(w == Infinity || h == Infinity) {
                return g;
            }

            for(let i = 0; i < this.axis.data.length; i++) {
                let group = this.svg.group(),
                    color = this.color(i, null),
                    data = this.axis.data[i],
                    isSameMetrics = data.xIndex == data.yIndex,
                    text = this.getValue(data, "value"),
                    textColor = _.typeCheck("function", this.brush.textColor) ?
                        this.brush.textColor(data) : this.chart.theme("heatmapFontColor"),
                    cx = this.axis.x(i) || 0,
                    cy = this.axis.y(i) || 0;

                if(color == "none") {
                    color = this.chart.theme("heatmapBackgroundColor");
                }

                let r = this.svg.rect({
                    x: cx - w/2,
                    y: cy - h/2,
                    width: w,
                    height: h,
                    fill: color,
                    "fill-opacity": this.chart.theme("heatmapBackgroundOpacity"),
                    stroke: this.chart.theme("heatmapBorderColor"),
                    "stroke-opacity": this.chart.theme("heatmapBorderOpacity"),
                    "stroke-width": bw,
                    visibility: isSameMetrics ? "hidden" : "visible"
                });

                group.append(r);

                if(!isSameMetrics) {
                    let t = this.chart.text({
                        "text-anchor": "middle",
                        "fill": textColor,
                        "font-size": fs,
                        width: w,
                        height: h,
                        x: cx,
                        y: cy + fs/2
                    }).text(_.typeCheck("function", this.brush.format) ? this.format(data) : text);

                    group.append(t);
                    this.addEvent(group, i, null);

                    // Hover effects
                    (function(rr, cc) {
                        group.hover(function() {
                            rr.attr({
                                fill: self.chart.theme("heatmapHoverBackgroundColor")
                            });
                        }, function() {
                            rr.attr({
                                fill: cc
                            });
                        })
                    })(r, color);
                } else {
                    let l = this.svg.line({
                        x1: cx - w/2,
                        y1: cy - h/2,
                        x2: cx + w/2,
                        y2: cy + h/2,
                        stroke: this.chart.theme("heatmapBorderColor"),
                        "stroke-width": 1
                    });

                    group.append(l);
                }

                g.append(group);
            }

            return g;
        }
    }

    HeatmapBrush.setup = function() {
        return {
            format: null,
            textColor: null
        };
    }

    return HeatmapBrush;
}, "chart.brush.core");

export default {
    name: 'graph-heatmap',
    mixins: [ graph_core, watch, created, mounted, props, methods ],
    props: {
        names: {
            type: Array,
            required: true
        }
    },
    watch: {
        names: function(newVal, oldVal) {
            this.chart.axis(0).set('x', { domain: newVal });
            this.chart.axis(0).set('y', { domain: newVal });
            this.chart.render();
        }
    },
    methods: {
        convertToData: function(values) {
            let util = graph.include('util.base');
            let rows = [];

            for(let i = 0; i < values.length; i++) {
                let val = values[i];

                if(util.typeCheck('array', val)) {
                    rows.push({
                        xIndex: val[0],
                        yIndex: val[1],
                        xLabel: val[2],
                        yLabel: val[3],
                        value: val[4],
                        result: val[5]
                    });
                }
            }

            return rows;
        },
        initGraphAxes: function() {
            return {
                x : {
                    type : "block",
                    domain : this.names,
                    line : "solid",
                    key : "xIndex",
                    orient : "top",
                    textRotate : function(elem) {
                        elem.attr({ "text-anchor": "start" });
                        return -45;
                    }
                },
                y : {
                    type : "block",
                    domain : this.names,
                    line : "solid",
                    key : "yIndex"
                },
                data : this.convertToData(this.values)
            }
        }
    },
    beforeMount: function() {
        const color = graph.include('util.color');

        const colorMap = {
            classic: color.map([ '#262b38', '#7c4dff', '#c3aaff', '#cfd3dc', '#eceff1', '#ffffff' ], 20),
            dark: color.map([ '#a863ff', '#6c41a2', '#503576', '#3d3d3d', '#2d2d2d', '#000000' ], 20)
        }[this.theme];

        const textColorMap = {
            classic: [ '#ffffff', '#333333' ],
            dark: [ '#ffffff', '#868686' ]
        }[this.theme];

        this.brushes = [{
            type: 'heatmap',
            clip: this.clip,
            target: [ 'value' ],
            colors : function(d) {
                if(d.value == 0) {
                    return "transparent";
                }

                let count = colorMap.length - 1,
                    value = (d.value > 1) ? 1 : d.value,
                    index = Math.ceil(value * count);

                return colorMap[count - index];
            },
            textColor : function(d) {
                return textColorMap[d.value > 0.6 ? 0 : 1];
            },
            format : function(d) {
                if(d.value > 0) {
                    return (d.value * 100).toFixed(d.value < 0.01 ? 2 : 0);
                }

                return "";
            }
        }];
    }
}