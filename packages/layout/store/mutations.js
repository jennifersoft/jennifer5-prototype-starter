import uuidv4 from '@library/uuid';
import mngMenus from '@entry/mng/menus';

export default {
    updateActiveLayer(state, menuType = null) {
        state.activeLayer = menuType;
    },
    setMenuList(state, { type, list = [] }) {
        state.menuSet = {
            ...state.menuSet,
            [type]: list,
        };
    },
    updateAlarmList(state, newAlarms = []) {
        // generate unique key for vue transition
        let concatenated = newAlarms
            .map(e => ({
                ...e,
                uuid: uuidv4(),
            }))
            .concat(state.alarm.list);
        let readIndex = state.alarm.readIndex;
        const overflow = concatenated.length - state.alarm.settings.maxCount;
        if (overflow > 0) {
            concatenated.splice(state.alarm.settings.maxCount, overflow);
            readIndex = readIndex - overflow >= 0 ? readIndex - overflow : 0;
        }
        state.alarm = {
            ...state.alarm,
            readIndex,
            list: concatenated,
        };
    },
    updateAlarmListAsRead(state, _) {
        state.alarm = {
            ...state.alarm,
            readIndex: state.alarm.list.length,
        };
    },
    updateSelectedAlarm(state, item = null) {
        state.alarm = {
            ...state.alarm,
            selected: item,
        };
    },
    updateAlarmSounds(state, list = []) {
        state.alarm = {
            ...state.alarm,
            sounds: list,
        };
    },
    updateAlarmSettings(state, settings) {
        state.alarm = {
            ...state.alarm,
            settings: {
                desktop: settings.desktop,
                sound: settings.sound,
                maxCount: settings.maxCount,
            },
        };
    },
    updateNoticeAndSystemEvent(state, { notices = [], systemEvents = [] }) {
        state.notices = notices.map(e => ({
            ...e,
            uuid: uuidv4(),
        }));
        state.systemEvents = systemEvents.map(e => ({
            ...e,
            uuid: uuidv4(),
        }));
    },
    updateMngData(state, mngData) {
        state.mngData = mngData;
    },
    resetMngData(state) {
        state.mngData = {
            ...mngMenus.index,
            url: '/mng/index',
            useLoading: true,
        };
    },
    updateUserInfo(
        state,
        { id = '', name = '', email = '', groupId = 'guest', startPage = '' }
    ) {
        state.user = {
            id,
            name,
            email,
            groupId,
            startPage,
        };
    },
    updateServerVersion(state, version = '') {
        state.serverVersion = version;
    },
    updateBackgroundJob(state, list = []) {
        state.backgroundJob = list;
    },
    updateAlertMessageForBgJob(state, message = '') {
        state.alertMessageForBgJob = message;
    },
};
