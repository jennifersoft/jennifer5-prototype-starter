import $ from '@library/jquery';
import jui from 'juijs-chart';
import classicTheme from 'juijs-chart/src/theme/classic';
import lineBrush from 'juijs-chart/src/brush/line';
import columnBrush from 'juijs-chart/src/brush/column';
import pieBrush from 'juijs-chart/src/brush/pie';
import titleWidget from 'juijs-chart/src/widget/title';
import legendWidget from 'juijs-chart/src/widget/legend';
import { getChartTarget } from '@common/utility';
import '@module/util/legacy.js';
import gridGenerator from './grid.js';

jui.use(
    classicTheme,
    lineBrush,
    columnBrush,
    pieBrush,
    titleWidget,
    legendWidget
);

jui.define('editor.jui.chart.metadata.parser', [], function() {
    function getOptions(name, index, json) {
        var obj = {};

        for (var key in json) {
            if (key.startsWith(name)) {
                var tokens = key.split('.');
                obj[tokens[index]] = json[key];
            }
        }

        return obj;
    }

    return function(type) {
        var json = jui.include('editor.jui.chart.metadata.json.' + type);

        this.getHeight = function() {
            return json['height'];
        };

        this.getAxisX = function() {
            return getOptions('axis.x.', 2, json);
        };

        this.getAxisY = function() {
            return getOptions('axis.y.', 2, json);
        };

        this.getPadding = function() {
            return getOptions('padding.', 1, json);
        };

        this.getStyle = function() {
            return getOptions('style.', 1, json);
        };

        this.getBrush = function(options) {
            var brush = getOptions('brush.', 1, json);

            if (typeof options == 'object') {
                $.extend(brush, options);
            }

            return brush;
        };

        this.getWidgets = function(options) {
            var widgets = [],
                widgetMap = {};

            for (var key in json) {
                if (key.startsWith('widget.')) {
                    var tokens = key.split('.'),
                        type = tokens[1];

                    if (!widgetMap[type]) {
                        widgetMap[type] = {
                            type: type,
                        };

                        if (typeof options == 'object' && options[type]) {
                            $.extend(widgetMap[type], options[type]);
                        }
                    }

                    widgetMap[type][tokens[2]] = json[key];
                }
            }

            for (var key in widgetMap) {
                widgets.push(widgetMap[key]);
            }

            return widgets;
        };
    };
});

jui.define('editor.jui.chart.metadata.util', [], function() {
    var time = jui.include('util.time');

    return {
        getDateFormat: function(stime, etime) {
            var range = etime - stime;

            if (range <= time.DAY) {
                return 'HH:mm';
            } else if (range <= time.DAY * 3) {
                return 'MM-dd HH';
            }

            return 'MM-dd';
        },
        getNumberFormat: function(value) {
            if (typeof value == 'number') {
                return value.toLocaleForAries();
            }

            return value;
        },
        getDomain: function(data, target) {
            var max = 0;

            for (var i = 0; i < target.length; i++) {
                max = Math.max(max, data[target[i]]);
            }

            return getChartTarget(max);
        },
    };
});

jui.define(
    'editor.jui.chart.metadata.line',
    ['editor.jui.chart.metadata.util'],
    function(_) {
        var time = jui.include('util.time');

        function getInterval(stime, etime) {
            var range = etime - stime;

            if (range <= time.DAY) {
                return time.HOUR * ((range / time.HOUR) % 2 == 0 ? 2 : 3);
            } else if (range <= time.DAY * 7) {
                return time.DAY;
            }

            return time.DAY * ((range / time.DAY) % 2 == 0 ? 2 : 3);
        }

        return {
            init: function(parser, params) {
                var domainAxis = {
                    domain: [params.stime, params.etime],
                    interval: getInterval(params.stime, params.etime),
                    format: function(date, index) {
                        var format = _.getDateFormat(
                            params.stime,
                            params.etime
                        );

                        if (
                            format == 'HH:mm' &&
                            date.getHours() == 0 &&
                            index != 0
                        ) {
                            return time.format(date, '24:mm');
                        }

                        return time.format(date, format);
                    },
                };

                var valueAxis = {
                    domain: function(data) {
                        return _.getDomain(data, params.target);
                    },
                    format: function(value) {
                        return value.toUnitString();
                    },
                };

                var options = {
                    width: 756,
                    axis: {
                        data: params.data,
                        x: domainAxis,
                        y: valueAxis,
                    },
                    format: _.getNumberFormat,
                };

                $.extend(options, {
                    brush: parser.getBrush({
                        target: params.target,
                    }),
                });

                $.extend(options, {
                    widget: parser.getWidgets({
                        title: {
                            text: params.title,
                        },
                        legend: {
                            format: function(key) {
                                return params.series[key].text;
                            },
                        },
                    }),
                });

                return options;
            },
        };
    }
);

jui.define(
    'editor.jui.chart.metadata.bar',
    ['editor.jui.chart.metadata.util'],
    function(_) {
        var time = jui.include('util.time');

        return {
            init: function(parser, params) {
                var isRangeY = parser.getAxisY().type == 'range';

                var domainAxis = {
                    domain: 'start',
                    format: function(date) {
                        return time.format(
                            new Date(date),
                            _.getDateFormat(params.stime, params.etime)
                        );
                    },
                };

                var valueAxis = {
                    domain: function(data) {
                        return _.getDomain(data, params.target);
                    },
                    format: function(value) {
                        return value.toUnitString();
                    },
                };

                var options = {
                    width: 756,
                    axis: {
                        data: params.data,
                        x: isRangeY ? domainAxis : valueAxis,
                        y: isRangeY ? valueAxis : domainAxis,
                    },
                    format: _.getNumberFormat,
                };

                $.extend(options, {
                    brush: parser.getBrush({
                        target: params.target,
                    }),
                });

                $.extend(options, {
                    widget: parser.getWidgets({
                        title: {
                            text: params.title,
                        },
                    }),
                });

                $.extend(options);

                return options;
            },
        };
    }
);

jui.define('editor.jui.chart.metadata.pie', [], function() {
    return {
        init: function(parser, params) {
            var total = 0,
                row = params.data[0];

            for (var key in row) {
                total += row[key];
            }

            var options = {
                width: 756,
                axis: {
                    data: params.data,
                },
            };

            $.extend(options, {
                brush: parser.getBrush({
                    format: function(k, v) {
                        var rate = ((v / total) * 100).toFixed(1);
                        return rate + '%';
                    },
                }),
            });

            $.extend(options, {
                widget: parser.getWidgets({
                    title: {
                        text: params.title,
                    },
                    legend: {
                        format: function(key) {
                            return key + ' (' + row[key].toUnitString() + ')';
                        },
                    },
                }),
            });

            return options;
        },
    };
});

jui.defineUI('editor.jui.chart.builder', [], function() {
    var builder = jui.include('chart.builder');

    var UI = function() {
        var chartObj = null,
            chartData = null;
        var $imageElem = null;

        this.init = function() {
            if (this.checkLoadedImage()) return;

            chartData = this.parseMetaData();
            chartObj = builder(this.root, this.initBrush());
        };

        this.initBrush = function() {
            const brush = jui.include(
                    'editor.jui.chart.metadata.' + chartData.brush
                ),
                JSONParser = jui.include('editor.jui.chart.metadata.parser');

            if (typeof brush.init == 'function') {
                const parser = new JSONParser(chartData.brush),
                    options = brush.init(parser, chartData);

                $.extend(options, { height: parser.getHeight() });
                $.extend(options, { padding: parser.getPadding() });
                $.extend(options, { style: parser.getStyle() });
                $.extend(options.axis.x, parser.getAxisX());
                $.extend(options.axis.y, parser.getAxisY());

                return options;
            }
        };

        this.parseMetaData = function() {
            const tag = this.options.tag;
            const $textarea = $(this.root).find(tag);
            const json = JSON.parse(
                tag === 'textarea' ? $textarea.val() : $textarea.text()
            );

            if (typeof json.theme == 'object') {
                jui.redefine(
                    `editor.jui.chart.metadata.json.${json.brush}`,
                    [],
                    () => json.theme
                );
            }
            $textarea.remove();

            const target = [];
            for (let key in json.series) {
                target.push(key);
            }

            json.target = target;

            return json;
        };

        this.checkLoadedImage = function() {
            const $textarea = $(this.root).find(this.options.tag);

            if ($textarea.length == 1) {
                return false;
            }

            return true;
        };

        /**
         * uniqueId 있으면 템플릿에서 생성되는 차트이며, 없으면 리포트에서 생성되는 차트이다.
         * @param uniqueId
         */
        this.renderDataURI = function(uniqueId) {
            if (chartObj == null) return;

            // TODO: svg 텍스트에 특정 문자열이 포함될 경우, 변환이 잘 안되는 문제가 있었음.
            const base64Image = this.toDataURI();

            $imageElem = $('<img />').css({
                width: $(this.root).css('width'),
                height: chartObj.options.height,
                float: $(this.root).css('float'),
            });

            if (typeof uniqueId == 'string') {
                $imageElem.attr({
                    id: uniqueId,
                    class: 'chart-type jui ' + chartData.brush,
                    src: base64Image,
                });
            } else {
                $imageElem.attr({
                    src: base64Image,
                });
            }

            $(this.root).after($imageElem);
            $(this.root).remove();
        };

        this.toDataURI = function() {
            if (chartObj == null) return;

            return (
                'data:image/svg+xml;utf8,' +
                encodeURIComponent(chartObj.svg.toXML())
            );
        };
    };

    UI.setup = function() {
        return {
            tag: 'textarea',
        };
    };

    return UI;
});

export default jui;
export const drawGrid = gridGenerator;
