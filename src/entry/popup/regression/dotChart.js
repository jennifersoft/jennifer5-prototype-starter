import graph from "juijs-chart";
import ClassicTheme from "@style/graph/classic";
import DarkTheme from "@style/graph/dark";
import graph_core from "vue-graph/src/components/core.js";
import watch from "vue-graph/src/base/watch.js";
import created from "vue-graph/src/base/created.js";
import mounted from "vue-graph/src/base/mounted.js";
import props from "vue-graph/src/base/props.js";
import methods from "vue-graph/src/base/methods.js";

graph.use(ClassicTheme, DarkTheme);

graph.define("chart.brush.dot", [ "util.base" ], function() {
    /**
     * @class chart.brush.dot
     * @extends chart.brush.core
     */
    const DotBrush = function() {
        let pointColor = 0,
            lineColor = 2;

        this.createDot = function(data) {
            let color = this.color(pointColor),
                r = this.brush.size / 2,
                x = this.axis.x(data.x),
                y = this.axis.y(data.y);

            return this.svg.circle({
                r: r,
                fill: color,
                "fill-opacity": this.brush.opacity,
                cx: x,
                cy: y
            });
        }

        this.draw = function() {
            let g = this.chart.svg.group(),
                datas = this.listData();

            if(datas.length > 0) {
                let reg = datas[0].reg;

                if(reg != null) {
                    let xMax = this.axis.x.max();

                    g.append(this.svg.line({
                        x1: this.axis.x(0),
                        x2: this.axis.x(xMax),
                        y1: this.axis.y(reg.b0),
                        y2: this.axis.y(reg.b0 + reg.b1 * xMax),
                        stroke: this.color(lineColor)
                    }));
                }

                for (let i = 0; i < datas.length; i++) {
                    g.append(this.createDot(datas[i]));
                }
            }

            return g;
        }
    }

    DotBrush.setup = function() {
        return {
            /** @cfg {Number} [size=7]  Determines the size of a starter. */
            size: 9,
            /** @cfg {Number} [opacity=1]  Stroke opacity.  */
            opacity: 0.4,
            /** @cfg {Boolean} [clip=false] If the brush is drawn outside of the chart, cut the area. */
            clip: false
        };
    }

    return DotBrush;
}, "chart.brush.core");

export default {
    name: 'graph-dot',
    mixins: [ graph_core, watch, created, mounted, props, methods ],
    props: {
        xMin: {
            type: Number,
            required: true
        },
        xMax: {
            type: Number,
            required: true
        },
        yMin: {
            type: Number,
            required: true
        },
        yMax: {
            type: Number,
            required: true
        },
        b0: {
            type: Number,
            required: true
        },
        b1: {
            type: Number,
            required: true
        }
    },
    methods: {
        convertToData: function(values) {
            if(values.length > 0) {
                values[0].reg = {
                    b0: this.b0,
                    b1: this.b1
                };
            }

            return values;
        },
        initGraphAxes: function() {
            return {
                x : {
                    type : "range",
                    domain : [ this.xMin, this.xMax ],
                    line : "solid",
                    step : 4,
                    format : v => v.toLocaleForAries()
                },
                y : {
                    type : "range",
                    domain : [ this.yMin, this.yMax ],
                    line : "solid",
                    step : 4,
                    format : v => v.toLocaleForAries()
                },
                data : this.convertToData(this.values)
            }
        }
    },
    beforeMount: function() {
        this.brushes = [{
            type: 'dot'
        }];
    }
}