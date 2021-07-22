import $ from '@library/jquery';
import { getDayjs, serverDateFormat } from '@common/base';
import { printTimeRange } from '@common/utility';

$(function() {
    $('.condition-box').css({
        visibility: 'visible',
    });
});

export function resizeFlexTable(dbTable) {
    $(dbTable.root).css('width', 'auto');

    if ($(dbTable.root).outerWidth() < $('.layout-body').outerWidth()) {
        $(dbTable.root).css({
            width: '100%',
            'padding-right': '0px',
        });
    } else {
        $(dbTable.root).css({
            width: $(dbTable.root).outerWidth(),
            'padding-right': '20px',
            'box-sizing': 'border-box',
        });
    }
}

export function getConditionMinTime(startDate, hour, minute) {
    let sdate = startDate.getDate().clone();

    if (typeof hour != 'undefined') {
        sdate = sdate.set('hour', hour);
    } else {
        sdate = sdate.set('hour', parseInt($('#startHour').val()));
    }

    if (typeof minute != 'undefined') {
        sdate = sdate.set('minute', minute);
    } else {
        sdate = sdate.set('minute', parseInt($('#startMinute').val()));
    }

    return sdate.valueOf();
}

export function getConditionMaxTime(endDate, hour, minute) {
    let edate = endDate.getDate().clone();

    if (typeof hour != 'undefined') {
        edate = edate.set('hour', hour);
    } else {
        edate = edate.set('hour', parseInt($('#endHour').val()));
    }

    if (typeof minute != 'undefined') {
        edate = edate.set('minute', minute);
    } else {
        edate = edate.set('minute', parseInt($('#endMinute').val()));
    }

    return edate.valueOf();
}

export function convertTimeText(value, maxValue, interval, checked) {
    var text = '';

    if (interval === 'all' || interval === 0) {
        text = getDayjs(value).format(serverDateFormat.short);

        if (!checked) {
            text += ' ~ ' + getDayjs(maxValue).format(serverDateFormat.short);
        }
    } else {
        if (checked) {
            text = getDayjs(value).format(serverDateFormat.long);
        } else {
            text = printTimeRange(value, interval, maxValue);
        }
    }

    return text;
}

export function exportCsv(raw) {
    const _form = document.createElement('form');
    _form.id = 'form_csv';
    _form.method = 'post';
    _form.action = '/file/download/csv';

    const _name = document.createElement('input');
    _name.name = 'name';
    _name.value = 'dbmetrics.csv';
    const _csv = document.createElement('textarea');
    _csv.name = 'csv';
    _csv.value = raw;

    _form.appendChild(_name);
    _form.appendChild(_csv);
    document.body.appendChild(_form);

    _form.submit();
    _form.remove();
}
