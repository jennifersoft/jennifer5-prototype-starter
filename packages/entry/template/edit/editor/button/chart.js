import $ from '@library/jquery';
import { i18n } from '@common/utility';

export const chartButton = function(context) {
    const ui = $.summernote.ui;

    const button = ui.button({
        contents: '<i class="icon-chart"></i>',
        tooltip: i18n.get('ui.label.chart'),
        container: '#summernote',
    });

    return button.render();
};
