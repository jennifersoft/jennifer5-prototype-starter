import $ from '@library/jquery';
import { i18n } from '@common/utility';

export const tableButton = function(context) {
    const ui = $.summernote.ui;

    const button = ui.button({
        contents: '<i class="icon-table"></i>',
        tooltip: i18n.get('ui.label.table'),
        container: '#summernote',
    });

    return button.render();
};
