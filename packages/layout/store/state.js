export default {
    // menu, alarm, notice, management or userMenu
    activeLayer: null,

    menuSet: {
        dashboard: [],
        analysis: [],
        statistics: [],
        report: [],
    },

    alarm: {
        list: [],
        readIndex: 0,
        selected: null,
        sounds: [],
        settings: {
            desktop: false,
            sound: false,
            maxCount: 0,
        },
    },

    notices: [],
    systemEvents: [],

    // iframe으로 로드되는 관리화면 메타데이터
    mngData: null,

    user: {
        id: '',
        name: '',
        email: '',
        groupId: 'guest',
        startPage: '',
    },
    serverVersion: '',
    backgroundJob: [],
    alertMessageForBgJob: '',
};
