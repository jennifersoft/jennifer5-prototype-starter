import $ from '@library/jquery';
import { ariesuser, serverDateFormat, getDayjs, server } from '@common/base';
import { ClientUtilities } from '@common/legacy/ClientUtilities';
import { UIManager } from '@common/legacy/UIManager';
import { startOfDayjs } from '@common/dayjsWrapper';

export let i18n = {
    get: function(key, args) {
        if (window.i18n && window.i18n.get) return window.i18n.get(key, args);
        return key;
    },
};

export let downloadCsv = (fileName, options) => {
    const $form = $(
        '<form id="form_csv" method="post" action="/file/download/json/csv"><input name="name" type="hidden" /><input name="json" type="hidden" /></form>'
    );
    const rows = [options.names];
    const fields = options.fields;
    const data = options.rows;

    for (let i = 0; i < data.length; i++) {
        const row = [];
        for (let j = 0; j < fields.length; j++) {
            row[j] = data[i][fields[j]];
        }
        rows.push(row);
    }

    $('body').append($form);
    $form.find('input[name=name]').val(fileName + '.csv');
    $form.find('input[name=json]').val(JSON.stringify({ rows: rows }));
    $form.submit();
    $('#form_csv').remove();
};

export let downloadText = (fileName, text, ext = 'txt') => {
    let $form = $(
        '<form id="form_csv" method="post" action="/file/download/csv"><input name="name" type="hidden" /><input name="csv" type="hidden" /></form>'
    );

    $('body').append($form);
    $form.find('input[name=name]').val(`${fileName}.${ext}`);
    $form.find('input[name=csv]').val(text);
    $form.submit();
    $('#form_csv').remove();
};

export let checkPermission = type => {
    const permissionList = server.permission
        ? server.permission.split(',').map(data => parseInt(data))
        : [];

    return permissionList.includes(type);
};

export let validCheckEmail = email => {
    if (email == '' || email == null) return false;

    const regx = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return regx.test(email);
};

export let validCheckCellphone = number => {
    if (number == '' || number == null) return false;

    const regx = /^[0-9\+\-\s]+$/i;
    return regx.test(number);
};

export let validCheckName = keyword => {
    if (keyword == '' || keyword == null) return false;

    const regx = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
    return regx.test(keyword);
};

export let validCheckIp = ip => {
    if (ip == '' || ip == null) return false;

    return /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/.test(
        ip
    );
};

export let setExpandEff = row => {
    if (!row) return;
    $(row.list[0]).html("<i class='icon-right'></i>");
};

export let setExpandEndEff = row => {
    if (!row) return;
    $(row.list[0]).html("<i class='icon-left'></i>");
};

export let setSortEff = (column, e, isBlack, isMulti) => {
    $(column.element)
        .parent()
        .find('i')
        .remove();

    let $icon = $("<i class='icon-asc' style='margin-top: 2px;'></i>");

    if (column.order == 'desc') {
        $icon = $("<i class='icon-desc' style='margin-top: 2px;'></i>");
    }

    if (!isMulti) {
        $icon.css({
            position: 'static',
            float: 'right',
            'margin-left': '-20px',
        });
    } else {
        $icon.css({ 'margin-left': '3px' });
    }

    $(column.element)
        .find('i')
        .remove();
    $(column.element).append($icon);
};

export let getModifyUserMsg = code => {
    var msg_pwd = '';

    $.ajax({
        url: '/user/password/policy/get',
        type: 'post',
        async: false,
        success: function(policy) {
            var msg = i18n.get('M0104');

            msg = msg.replace('%d', policy.passwordLength);
            msg = msg.replace('%d', policy.minLowercase);
            msg = msg.replace('%d', policy.minUppercase);
            msg = msg.replace('%d', policy.minDigit);
            msg = msg.replace('%d', policy.minSpecial);

            msg_pwd = msg;
        },
    });

    if (code == 'M0104') {
        return msg_pwd;
    }

    return i18n.get(code);
};

export let printBrText = text => {
    text = text.replace(/\</g, '&lt;');
    text = text.replace(/\>/g, '&gt;');
    text = text.replace(/\n/g, '<br>');

    return text == 'null' ? '' : text;
};

export let printCsvText = text => {
    text = text.replace(/\"/g, '""');
    text = text.replace(/[\r|\n]/g, ' ');

    return text;
};

export let printEscape = method => {
    if (!method) return '';

    let res = method,
        len = res.length,
        max = 500;

    res = res.replace(/&/g, '&amp;');
    res = res.replace(/>/g, '&gt;');
    res = res.replace(/</g, '&lt;');
    res = res.replace(/"/g, '&quot;');
    res = res.replace(/'/g, '&apos;');
    res = res.replace(/\\/g, '\\\\');
    res = res.replace(/[\r|\n]/g, ' ');

    if (len > max) {
        return res.substr(0, max) + '...';
    }

    return res;
};

export let printTimeRange = (time, range, maxTime) => {
    let sdate = getDayjs(time),
        sdateStr = sdate.format(serverDateFormat.long);

    if (range === 'all') return sdateStr;

    let edate = sdate.add(parseInt(range) * 1000 * 60, 'millisecond');
    let etime = edate.valueOf();

    if (maxTime && etime > maxTime) {
        return sdateStr + ' ~ ' + getDayjs(maxTime).format('HH:mm');
    }

    return sdateStr + ' ~ ' + edate.format('HH:mm');
};

export let getChartTarget = value => {
    if (value > 10) {
        let preDigits = ('' + value).split(''),
            digits = ('' + Math.ceil(value * 1.2)).split('');

        for (let i = 1; i < digits.length; i++) {
            if (preDigits[i - 1] == digits[i - 1]) {
                digits[i] = '5';
            } else {
                digits[i] = '0';
            }
        }

        return parseInt(digits.join(''));
    } else if (value == 0) {
        return 1;
    }

    return value * 1.2;
};

export let setSessionObj = (key, obj) => {
    sessionStorage.setItem(key, JSON.stringify(obj));
};

export let getSessionObj = key => {
    let string = sessionStorage.getItem(key);

    let result;

    try {
        result = JSON.parse(string);
    } catch (e) {
        console.log('call getSessionObj parse problem ');
        console.log(string);
        return {};
    }

    return result;
};

export let printOidNames = (sid, oids) => {
    if (oids.length > 0) {
        let newOids = [];

        for (let i = 0; i < oids.length; i++) {
            if (!isNaN(oids[i])) {
                newOids.push(oids[i]);
            }
        }

        if (newOids.length > 0) {
            let names = [];

            $.ajax({
                url: '/agent/names/oids',
                method: 'GET',
                async: false,
                data: {
                    format: 'json',
                    sid: sid,
                    oids: newOids,
                },
                success: function(list) {
                    names = list;
                },
            });

            return names.join(',');
        }
    }

    return '';
};

export let linkManual = useHash => {
    let width = 1024,
        height = 768,
        url = `/manual/${ariesuser.language}/index.html`;

    if (useHash !== false) {
        let popupUrl = location.pathname;
        url +=
            '#' +
            popupUrl
                .split('/')
                .join('_')
                .substr(1);
    }

    let popup = window.open(
        url,
        'manual',
        'width=' +
            width +
            ',height=' +
            height +
            ',history=no,resizable=no,status=no,scrollbars=no,menubar=no'
    );
    popup.focus();
};

export let hashManual = hash => {
    let width = 1024,
        height = 768;
    let url = `/manual/${ariesuser.language}/index.html`;

    if (hash.startsWith('/mng/')) {
        hash = hash.split('?').join('_');
        hash = hash.split('=').join('_');

        url += `#${hash
            .split('/')
            .join('_')
            .substr(1)}`;
    } else {
        url += `#${hash}`;
    }

    let popup = window.open(
        url,
        'manual',
        'width=' +
            width +
            ',height=' +
            height +
            ',history=no,resizable=no,status=no,scrollbars=no,menubar=no'
    );
    popup.focus();
};

export let createFormData = obj => {
    const formData = new FormData();

    for (let key in obj) {
        if (obj[key] != null) {
            if (
                typeof obj[key] == 'object' &&
                obj[key].hasOwnProperty('length')
            ) {
                obj[key].forEach(value => {
                    formData.append(`${key}[]`, value);
                });
            } else {
                formData.append(key, obj[key]);
            }
        }
    }

    return formData;
};

export let openXViewPopupForEvent = (sid, time, txid) => {
    var stime = time - ClientUtilities.ONE_HOUR,
        etime = time + ClientUtilities.ONE_HOUR;

    UIManager.getXViewPointList(sid, [txid], stime, etime, txid);
};

export let printAgentStatusColor = msg => {
    if (msg == 'Stopped') return 'stopped';
    else if (msg == 'No License') return 'nolicense';

    return 'notsupported';
};

export let getEventData = data => {
    const eventInfo = {
        1: { name: 'normal', color: '' },
        3: { name: 'warning', color: 'warning' },
        5: { name: 'fatal', color: 'danger' },
    };

    var eInfo = eventInfo[data.eventLevel],
        customMessage =
            !data.customMessage ||
            data.customMessage == null ||
            data.customMessage == 'null'
                ? ''
                : data.customMessage + ' ',
        subject =
            data.mxidName && data.mxidName != ''
                ? i18n.get('ui.mx.' + data.mxidName)
                : data.errorTypeName;

    return {
        sid: data.sid,
        type: data.iconType,
        level: eInfo != null ? eInfo.name : '',
        color: eInfo != null ? eInfo.color : '',
        name: data.domainName + ', ' + data.name,
        subject: customMessage != '' ? customMessage + ', ' + subject : subject,
        detail: printBrText(data.detail),
        detailMessage: data.detailMessage,
        txid: data.relevantTxId,
        time: getDayjs(data.time).format(serverDateFormat.longWithSec),
        stime: data.time - ClientUtilities.ONE_HOUR,
        etime: data.time + ClientUtilities.ONE_HOUR,
        isNew: true,
        //isNew: data.isNew
    };
};

export let getByteLength = (s, b, i, c) => {
    for (b = i = 0; (c = s.charCodeAt(i++)); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
    return b;
};

export let getByteToUnit = size => {
    if (size === null || size === -1) return '';
    let s = parseInt(size) / 1024 / 1024;
    return Math.round(s).toLocaleForAries();
};

export let getJavaMajorVersion = version => {
    const tokens = version.split('.');
    const major = parseInt(tokens[0]);

    if (!isNaN(major)) {
        if (major == 1) {
            const minor = parseInt(tokens[1]);
            if (!isNaN(minor)) return minor;
        } else {
            return major;
        }
    }

    return -1;
};

export let isJSONString = jsonString => {
    try {
        const o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object",
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (o && typeof o === 'object') {
            return true;
        }
    } catch (e) {}

    return null;
};

export let getTimeRangeBasedOnDayOfWeek = (c, s, e) => {
    var current = startOfDayjs(getDayjs(c), 'date');

    // 오늘 요일과 마지막 요일이 같을 경우, 하루를 빼준다.
    var isSameDay = false;
    if (current.day() == e) {
        current = current.add(-7, 'day');
        isSameDay = true;
    }

    var endTime = isSameDay == true ? current : getPrevTime(current, e);
    var startTime = getPrevTime(endTime, s);

    function getPrevTime(current, day) {
        var nc = current.clone();
        var limit = 7;

        while (limit > 0) {
            if (day != nc.day()) {
                nc = nc.add(-1, 'day');
            } else {
                break;
            }
            limit--;
        }

        return nc;
    }

    return [startTime.valueOf(), endTime.valueOf()];
};

export let createUniqueId = (head = 'jui') => {
    let time = +new Date();

    let str = time
        .toString()
        .split('')
        .reverse();
    let id = '';

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    for (let i = 0; i < 12; ++i) {
        let index = random(0, str.length - 1);
        id += str[index];
    }

    return head + id;
};

export let showDBPlanPopup = (sid, stime, etime, key, params, bindParams) => {
    let pop = window.open(
        '',
        'dbplanPopup',
        "width=1280,height=780,location='no',history='no',resizable='no',status='no',scrollbars='no',toolbar='no',menubar='no'"
    );

    if (typeof pop != 'undefined') pop.focus();

    // TODO: [JJC-1627] backslash는 _.escape 함수로 완벽하게 처리되지 않음
    if (typeof params == 'object') {
        for (let i = 0; i < params.length; i++) {
            params[i].value = printEscape(params[i].value);
        }
    }
    if (typeof bindParams == 'object') {
        for (let i = 0; i < bindParams.length; i++) {
            bindParams[i].value = printEscape(bindParams[i].value);
        }
    }

    let $form = $(
        '<form id="popup_frm" method="post" action="/popup/dbplan" target="dbplanPopup">' +
            '<input name="sid" type="hidden" />' +
            '<input name="key" type="hidden" />' +
            '<input name="stime" type="hidden" />' +
            '<input name="etime" type="hidden" />' +
            '<input name="params" type="hidden" />' +
            '<input name="bindParams" type="hidden" /></form>'
    );

    $('#popup_frm').remove();
    $('body').append($form);

    $form.find('input[name=sid]').val(sid);
    $form.find('input[name=key]').val(key);
    $form.find('input[name=stime]').val(stime);
    $form.find('input[name=etime]').val(etime);
    $form.find('input[name=params]').val(JSON.stringify(params));
    $form.find('input[name=bindParams]').val(JSON.stringify(bindParams));

    $form.submit();
};

export let showSherpaOraclePopup = url => {
    let pop = window.open(
        url,
        'sherpaOraclePopup',
        "width=1280,height=768,location='no',history='no',resizable='no',status='no',scrollbars='yes',toolbar='no',menubar='no'"
    );
    if (typeof pop != 'undefined') pop.focus();
};

export const copyClipboard = (text = '') => {
    const tempElem = document.createElement('textarea');
    tempElem.value = text;
    document.body.appendChild(tempElem);

    tempElem.select();
    document.execCommand('copy');
    document.body.removeChild(tempElem);
};

export const JSONReplacer = (key, value) => {
    if (typeof value === 'number' && !isFinite(value)) {
        return String(value);
    }
    return value;
};
