import $ from '@library/jquery';
import Vue from 'vue';
import VueRegression from './regression';
import { ariesuser } from '@common/base';
import { i18n } from '@common/utility';
import { decode } from '@entry/analysis/regression/utility';

Vue.component('regression', VueRegression);

new Vue({
    el: '#app',
    provide: {
        theme: ariesuser.theme,
        i18n: {
            r2: i18n.get('ui.label.r2'),
            prediction: i18n.get('ui.label.prediction'),
            regressionAnalysis: i18n.get('ui.label.regressionAnalysis'),
            result: i18n.get('ui.label.result'),
            freedom: i18n.get('ui.label.freedom'),
            sumOfSquares: i18n.get('ui.label.sumOfSquares'),
            averageOfSquares: i18n.get('ui.label.averageOfSquares'),
            fValue: i18n.get('ui.label.fValue'),
            intercept: i18n.get('ui.label.intercept'),
            slope: i18n.get('ui.label.slope'),
            sec: i18n.get('ui.label.unit.sec'),
            showAnalysis: i18n.get('ui.label.showAnalysis'),
            hideAnalysis: i18n.get('ui.label.hideAnalysis'),
            analysis: i18n.get('ui.label.analysisResult'),
            regression: 'Regression',
            error: 'Error',
            total: 'Total',
        },
    },
    computed: {
        regression() {
            return JSON.parse(
                decode(document.getElementById('regression').innerHTML)
            );
        },
        points() {
            return JSON.parse(
                decode(document.getElementById('points').innerHTML)
            );
        },
    },
    beforeMount() {
        $('header > div').html($('#title').html());
    },
});
