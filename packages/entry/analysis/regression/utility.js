import $ from '@library/jquery';

function getRegression(data, xAvg, yAvg) {
    var xDotYSum = 0,
        xDotXSum = 0,
        sse = 0,
        ssr = 0;

    for (var i = 0; i < data.length; i++) {
        var xDotY = (data[i].x - xAvg) * (data[i].y - yAvg),
            xDotX = Math.pow(data[i].x - xAvg, 2);

        xDotYSum += xDotY;
        xDotXSum += xDotX;
    }

    var b1 = xDotYSum / xDotXSum,
        b0 = yAvg - b1 * xAvg;

    for (var i = 0; i < data.length; i++) {
        var py = b0 + b1 * data[i].x;

        sse += Math.pow(data[i].y - py, 2);
        ssr += Math.pow(py - yAvg, 2);
    }

    var sst = ssr + sse,
        ssr_free = 1,
        sse_free = data.length - 2,
        msr = ssr / ssr_free,
        mse = sse / sse_free,
        f = msr / mse;

    return {
        b1: b1,
        b0: b0,

        ssr: ssr, // 회귀 - 제곱합/자유도/평균제곱/f값
        ssr_free: ssr_free,
        msr: msr,
        f: f,

        sse: sse, // 오차 - 제곱합/자유도/평균제곱
        sse_free: sse_free,
        mse: mse,

        sst: ssr + sse,
        sst_free: data.length - 1,
        r2: ssr / sst, // 결정계수
    };
}

export function calculateRegression(xData, yData) {
    var data = [],
        xMin = 99999,
        yMin = 99999,
        xMax = 0,
        yMax = 0,
        xSum = 0,
        ySum = 0;

    for (var i = 0; i < xData.length; i++) {
        var obj = {
            x: xData[i],
            y: yData[i],
        };

        if (obj.x > 0 || obj.y > 0) {
            xSum += obj.x;
            ySum += obj.y;
            xMin = Math.min(xMin, obj.x);
            yMin = Math.min(yMin, obj.y);
            xMax = Math.max(xMax, obj.x);
            yMax = Math.max(yMax, obj.y);
            data.push(obj);
        }
    }

    return {
        regression: getRegression(data, xSum / data.length, ySum / data.length),
        data: data,
        xMin: xMin,
        yMin: yMin,
        xMax: xMax,
        yMax: yMax,
    };
}

export function createHeatmapChartData(names, data) {
    const result = [];

    for (let y = 0; y < names.length; y++) {
        for (let x = 0; x < names.length; x++) {
            if (data == null) {
                result.push([x, y, names[x], names[y], 0, null]);
            } else {
                let reg = calculateRegression(data[x], data[y]);

                result.push([
                    x,
                    y,
                    names[x],
                    names[y],
                    isNaN(reg.regression.r2) ? 0 : reg.regression.r2,
                    reg,
                ]);
            }
        }
    }

    return result;
}

export function showRegressionPopup(
    xIndex,
    yIndex,
    xLabel,
    yLabel,
    xMin,
    yMin,
    xMax,
    yMax,
    regression,
    points,
    interval
) {
    let pop = window.open(
        '',
        'regressionPopup',
        "width=485,height=740,location='no',history='no',resizable='no',status='no',scrollbars='yes',toolbar='no',menubar='no'"
    );

    if (typeof pop != 'undefined') pop.focus();

    let $form = $(
        '<form id="popup_frm" method="post" action="/popup/regression" target="regressionPopup">' +
            '<input name="interval" type="hidden" />' +
            '<input name="regression" type="hidden" />' +
            '<input name="points" type="hidden" />' +
            '<input name="xIndex" type="hidden" />' +
            '<input name="yIndex" type="hidden" />' +
            '<input name="xLabel" type="hidden" />' +
            '<input name="yLabel" type="hidden" />' +
            '<input name="xMin" type="hidden" />' +
            '<input name="yMin" type="hidden" />' +
            '<input name="xMax" type="hidden" />' +
            '<input name="yMax" type="hidden" /></form>'
    );

    $('#popup_frm').remove();
    $('body').append($form);

    $form.find('input[name=interval]').val(interval);
    $form.find('input[name=xIndex]').val(xIndex);
    $form.find('input[name=yIndex]').val(yIndex);
    $form.find('input[name=xLabel]').val(xLabel);
    $form.find('input[name=yLabel]').val(yLabel);
    $form.find('input[name=xMin]').val(xMin);
    $form.find('input[name=yMin]').val(yMin);
    $form.find('input[name=xMax]').val(xMax);
    $form.find('input[name=yMax]').val(yMax);
    $form.find('input[name=regression]').val(JSON.stringify(regression));
    $form.find('input[name=points]').val(JSON.stringify(points));
    $form.submit();
}

export function decode(html) {
    const decoder = document.createElement('div');
    decoder.innerHTML = html;
    return decoder.textContent;
}
