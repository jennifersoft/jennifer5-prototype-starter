import { getEventData, i18n } from '@common/utility';
import { getDayjs, serverDateFormat } from '@common/base';

let _cachedEventList = [];
const pushQueue = [];

function addSystemNotify(item, onClickSystemNotify) {
    let n = null;

    const { type, level, name, subject, detail, time } = item;
    const msg = i18n.get('ui.label.alarmSystemPushTitle'),
        opts = {
            //tag: msg,
            body: `[${name}] ${subject} ${detail}\n${time}`,
        };

    // If the user agreed to get notified
    if (Notification && Notification.permission === 'granted') {
        n = new Notification(msg, opts);
        n.onclick = onclick;
    }

    // If the user haven't tell if he want to be notified or not
    // Note: because of Chrome, we are not sure the permission property
    // is set, therefore it's unsafe to check for the "default" value.
    else if (Notification && Notification.permission !== 'denied') {
        Notification.requestPermission(function(status) {
            if (Notification.permission !== status) {
                Notification.permission = status;
            }

            // If the user said okay
            if (status === 'granted') {
                n = new Notification(msg, opts);
                n.onclick = onclick;
            }

            // Otherwise, we can fallback to a regular modal alert
            else {
                //alert("Hi!");
            }
        });
    }

    // If the user refuse to get notified
    else {
        // We can fallback to a regular modal alert
        //alert("Hi!");
    }

    function onclick(_) {
        window.focus();
        onClickSystemNotify(item);
    }

    return n;
}

function getEventDataList(list, opts) {
    const items = [];
    const eventInfo = {
        1: { name: 'normal', color: '' },
        3: { name: 'warning', color: 'warning' },
        5: { name: 'fatal', color: 'danger' },
    };

    for (let i = 0; i < list.length; i++) {
        let eInfo = eventInfo[list[i].eventLevel],
            data = Object.assign(
                { delay: opts[eInfo.name + 'Timeout'] },
                getEventData(list[i])
            );

        items.push(data);
    }

    return items;
}

export function eventRuleNotifyAll(data, onclick, unreadAlarmCount) {
    let items = getEventDataList(data.list, data.options);
    let loopEventLevel = 0; // 반복중인 사운드 이벤트 레벨

    // desktop push
    if (data.desktop) {
        items.forEach(e => {
            pushQueue.push(addSystemNotify(e, onclick));
        });
    }

    if (items.length > 0 && data.sound) {
        const eventLevel = data.list[0].eventLevel;
        const notiCount = unreadAlarmCount;

        const soundKey = data.options[`${items[0].level}Sound`];
        const soundContainer = document.querySelector('#notify-sounds');
        const targetSrc = document.querySelector(
            `audio[data-key='${soundKey}']`
        );

        if (unreadAlarmCount === 0) loopEventLevel = 0;

        if (!!targetSrc) {
            if (
                notiCount === 0 ||
                (notiCount > 0 && eventLevel > loopEventLevel)
            ) {
                Array.from(soundContainer.children).forEach(e => {
                    e.removeAttribute('loop');
                });
                if (data.options.soundLoop) {
                    targetSrc.setAttribute('loop', 'true');
                } else targetSrc.removeAttribute('loop');

                targetSrc.currentTime = 0;
                targetSrc.play();
                loopEventLevel = eventLevel;
            }
        }
    }

    return items.reverse();
}

export function systemEventList(data) {
    const notices = [];
    const systemEvents = [];

    if (data.notices && Array.isArray(data.notices)) {
        for (let i = 0; i < data.notices.length; i++) {
            notices.push({
                subject: data.notices[i].subject,
                timestamp: `${getDayjs(
                    parseInt(data.notices[i].startTime)
                ).format(serverDateFormat.long)} ~ 
                    ${getDayjs(parseInt(data.notices[i].endTime)).format(
                        serverDateFormat.long
                    )}`,
            });
        }
    }

    if (data.systemEvents && Array.isArray(data.systemEvents)) {
        for (let i = 0; i < data.systemEvents.length; i++) {
            if (!data.systemEvents[i]) continue;

            systemEvents.push({
                subject: `[${data.systemEvents[i].name}]`,
                message: data.systemEvents[i].messages,
            });
        }
    }

    return { notices, systemEvents };
}

window.onunload = function(_) {
    pushQueue.forEach(e => {
        if (e && typeof e.close == 'function') {
            e.close();
        }
    });
};
