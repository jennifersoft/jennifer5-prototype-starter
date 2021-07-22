import $ from '@library/jquery';

export const mutations = {
    loadDocument: (state, { json, markup }) => {
        state.key = json.key;
        state.charts = json.charts;

        state.lang = json.lang;
        state.label = json.label;

        state.title = json.title;
        state.buildDay = json.buildDay;
        state.buildTime = json.buildTime;

        state.domains = json.domains;
        state.domainGroupIndex = json.domainGroupIndex;
        state.domainGroupTitle = json.domainGroupTitle;

        // 에디터에 들어가는 마크업
        state.data = markup;
    },
    loadDefaultChartStyles: (state, chartStyles) => {
        state.chartStyles = chartStyles;
    },
    updateEditorCode: (state, code) => {
        const $div = $('<div />').html(code);
        const newCharts = {};

        $div.find("img[id*='jui']").each(function() {
            const $img = $(this);
            const key = $img.attr('id');
            const style = $img.attr('style') || '';

            $img.after(document.createTextNode('#' + key + '#'));
            $img.remove();

            // 에디터에 데이터 이미지가 삭제되었다면 기존의 차트 객체도 제거해야 함.
            if (state.charts.hasOwnProperty(key)) {
                newCharts[key] = state.charts[key];
                newCharts[key].style = style;
            }
        });

        state.data = $div[0].innerHTML;
        state.charts = newCharts;
    },
    updateDataImages: (state, charts) => {
        state.charts = charts;
    },
    updateTemplateSetting: (state, payload) => {
        state.domainGroupTitle = payload.domainGroupTitle;
        state.domainGroupIndex = payload.domainGroupIndex;
        state.domains = payload.domains;
        state.buildDay = payload.buildDay;
        state.buildTime = payload.buildTime;
        state.title = payload.title;
    },
    changeLanguage: (state, lang) => {
        state.lang = lang;
    },
    saveDataImage: (state, payload) => {
        state.charts[payload.uniqueId] = payload;
    },
};
