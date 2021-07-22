export default {
    newAlarmList(state) {
        const { list, readIndex } = state.alarm;
        return list.slice(0, list.length - readIndex);
    },
    lastAlarmList(state) {
        const { list, readIndex } = state.alarm;
        return list.slice(list.length - readIndex);
    },
    noticeStatus(state) {
        if (state.systemEvents.length > 0) return 'danger';
        if (state.notices.length > 0) return 'success';
        return 'default';
    },
    hasMenuListFetched(state) {
        return Object.values(state.menuSet).some(e => e.length > 0);
    },
    hasServerVersionFetched(state) {
        return !!state.serverVersion;
    },
};
