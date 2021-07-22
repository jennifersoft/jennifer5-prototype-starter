import jui from 'juijs-chart';
import BarBrush from 'juijs-chart/src/brush/bar.js';

jui.use(BarBrush);

export default {
    name: 'chart.brush.column2',
    extend: 'chart.brush.bar',
    component: function() {
        const ColumnBrush = function() {
            let g;
            let zeroY, width, col_width, half_width;

            this.drawBefore = function() {
                const op = this.brush.outerPadding,
                    ip = this.brush.innerPadding,
                    len = this.brush.target.length;

                g = this.chart.svg.group();
                zeroY = this.axis.y(0);
                width = this.axis.x.rangeBand();

                if (this.brush.size > 0) {
                    col_width = this.brush.size;
                    half_width = col_width * len + (len - 1) * ip;
                } else {
                    half_width = width - op * 2;
                    col_width = (width - op * 2 - (len - 1) * ip) / len;
                    col_width = col_width < 0 ? 0 : col_width;
                }
            };

            this.draw = function() {
                const points = this.getXY(),
                    style = this.getBarStyle();

                this.eachData(function(data, i) {
                    let startX = this.offset('x', i) - half_width / 2;

                    for (let j = 0; j < this.brush.target.length; j++) {
                        let value = data[this.brush.target[j]],
                            tooltipX = startX + col_width / 2,
                            tooltipY = this.axis.y(value),
                            position = tooltipY <= zeroY ? 'top' : 'bottom';

                        // TODO: 값이 음수가 있는 차트에서는 사용할 수 없음. 제니퍼 용으로 커스터마이징 하였음
                        if (
                            Math.abs(zeroY - tooltipY) < this.brush.minSize &&
                            value > 0
                        ) {
                            tooltipY =
                                position == 'top'
                                    ? tooltipY - this.brush.minSize
                                    : tooltipY + this.brush.minSize;
                        }

                        let height = Math.abs(zeroY - tooltipY),
                            radius =
                                col_width < style.borderRadius ||
                                height < style.borderRadius
                                    ? 0
                                    : style.borderRadius,
                            r = this.getBarElement(i, j, {
                                width: col_width,
                                height: height,
                                value: value,
                                tooltipX: tooltipX,
                                tooltipY: tooltipY,
                                position: position,
                                max: points[j].max[i],
                                min: points[j].min[i],
                            });

                        if (tooltipY <= zeroY) {
                            r.round(col_width, height, radius, radius, 0, 0);
                            r.translate(startX, tooltipY);
                        } else {
                            r.round(col_width, height, 0, 0, radius, radius);
                            r.translate(startX, zeroY);
                        }

                        // 그룹에 컬럼 엘리먼트 추가
                        g.append(r);

                        // 다음 컬럼 좌표 설정
                        startX += col_width + this.brush.innerPadding;
                    }
                });

                this.drawETC(g);

                return g;
            };
        };

        return ColumnBrush;
    },
};
