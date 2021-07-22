/**
 * @deprecated
 * aries.localStorage 를 변경함.
 * 가능하면 직접 구현해서 쓰자. 기존 코드를 위해 남겨둔 상태.
 * readJSON() 의 값이 비어있다면 빈객체를 넘겨준다. 이래서는 값이 저장되있는지 확인이 불가능하다.
 *
 */

class LocalStorageManager {
    static save(path, jsonData) {
        this.saveJSON(path, jsonData);
    }

    static saveJSON(path, jsonData) {
        localStorage.setItem(path, JSON.stringify(jsonData));
    }

    static read(path, jsonData) {
        return this.readJSON(path, jsonData);
    }

    static readJSON(path) {
        var jsonData;
        var jsonString = localStorage.getItem(path);

        if (jsonString) {
            jsonData = JSON.parse(jsonString);
        } else {
            jsonData = {};
        }

        return jsonData;
    }

    static saveDashboardRuntimeLineChartMode(runtimeLineChart) {
        var propertyKey = this.getDashboardChartKey(runtimeLineChart);
        var jsonData = this.readJSON('RuntimeLineChartMergedLineMode');

        jsonData[propertyKey] = runtimeLineChart.isMergedLineMode;

        this.saveJSON('RuntimeLineChartMergedLineMode', jsonData);
    }

    static readDashboardRuntimeLineChartMode(runtimeLineChart) {
        var propertyKey = this.getDashboardChartKey(runtimeLineChart);
        var jsonData = this.readJSON('RuntimeLineChartMergedLineMode');

        return jsonData[propertyKey];
    }

    static saveDashboardEqualizerChartMode(equalizerChart, merge) {
        var propertyKey = this.getDashboardChartKey(equalizerChart);
        var jsonData = this.readJSON('RuntimeLineChartMergedLineMode');

        jsonData[propertyKey] = merge;

        this.saveJSON('RuntimeLineChartMergedLineMode', jsonData);
    }

    static readDashboardEqualizerChartMode(equalizerChart) {
        var propertyKey = this.getDashboardChartKey(equalizerChart);
        var jsonData = this.readJSON('RuntimeLineChartMergedLineMode');

        return jsonData[propertyKey];
    }

    static getDashboardChartKey(chart) {
        var pathname = document.location.pathname;
        const model = chart.getModel();
        const cmdMap = model.cmdMap;
        var chartKey;
        if (pathname === '/userdefine/dashboard') {
            chartKey = cmdMap.key;
        } else {
            chartKey = cmdMap.pkey ?? cmdMap.mxid;
        }

        return pathname + '/' + chartKey;
    }

    static saveDashboardEventChartMode(eventChart) {
        var propertyKey = this.getDashboardChartKey(eventChart);
        var jsonData = this.readJSON('EventChartListRenderMode');

        jsonData[propertyKey] = eventChart.isListRenderMode;

        this.saveJSON('EventChartListRenderMode', jsonData);
    }

    static readDashboardEventChartMode(eventChart) {
        var propertyKey = this.getDashboardChartKey(eventChart);
        var jsonData = this.readJSON('EventChartListRenderMode');

        var mode = jsonData[propertyKey] ? jsonData[propertyKey] : undefined;

        return mode;
    }
}

export { LocalStorageManager };
