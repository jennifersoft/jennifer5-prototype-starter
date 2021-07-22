export default {
    loadSQL(state, sql) {
        state.sql = sql;
    },
    loadParameters(state, payload) {
        state.domainId = payload.domainId;
        state.dataKey = payload.dataKey;
        state.startTime = payload.startTime;
        state.endTime = payload.endTime;
        state.inlineParameters = payload.inlineParameters;
        state.boundParameters = payload.boundParameters;
    },
    updateDatabaseSettings(state, settings) {
        state.databaseSettings = settings;
        if (settings.length > 0) state.databaseName = settings[0].name;
    },
    updateOutputPlan(state, plan) {
        state.outputPlan = plan;
    },
    updateOutputQueries(state, payload) {
        state.outputOrigin = payload.origin;
        state.outputAll = payload.result;
    },
    updateSettings(state, payload) {
        state.inlineParameters = payload.inlineNames.map((name, i) => {
            return {
                ...state.inlineParameters[i],
                value: name,
            };
        });
        state.boundParameters = payload.boundNames.map((name, i) => {
            return {
                ...state.boundParameters[i],
                value: name,
            };
        });
        state.databaseName = payload.databaseName;
    },
    calculateMainSize(state) {
        state.mainWidth = window.innerWidth - 48;
        state.mainHeight = window.innerHeight - 120 - 18;
    },
};
