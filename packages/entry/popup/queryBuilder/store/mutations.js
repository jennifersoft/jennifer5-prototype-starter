export const mutations = {
    updateSchemas: (state, schemas) => {
        state.schemas = schemas;
    },
    updateData: (state, data) => {
        let newRows = [];

        data.rows.forEach(row => {
            let newRow = {};
            row.forEach((val, i) => {
                newRow[`col_${i}`] = val;
            });
            newRows.push(newRow);
        });

        state.columns = data.columns.map((col, i) => {
            return {
                type: col.type,
                name: col.name,
                key: `col_${i}`,
            };
        });

        state.rows = newRows;
    },
    addMessage: (state, message) => {
        state.messages.push(message);
    },
    updateTabs: (state, jsonStr) => {
        const empty = { 'Tab 1': '' };

        try {
            const data = !jsonStr ? empty : JSON.parse(jsonStr);
            state.tabs = data;
        } catch (e) {
            state.tabs = empty;
        }
    },
    deleteTab: (state, tab) => {
        const newTabs = {};
        Object.keys(state.tabs)
            .filter(key => key != tab)
            .forEach(key => {
                newTabs[key] = state.tabs[key];
            });
        state.tabs = newTabs;
    },
};
