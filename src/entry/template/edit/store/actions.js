import $ from '@library/jquery';
import { ariesuser } from '@common/base';

export const actions = {
    saveDocument({ commit, getters }, code) {
        return new Promise((resolve, reject) => {
            commit('changeLanguage', ariesuser.language);
            commit('updateEditorCode', code);
            resolve(getters.toJSONString);
        });
    },
    loadTemplateSetting({ commit, getters }, payload) {
        return new Promise((resolve, reject) => {
            commit('updateTemplateSetting', payload.data);

            if (typeof payload.file == 'object') {
                commit('updateDataImages', payload.file.charts);
                resolve(payload.file);
            } else if (typeof payload.file == 'string') {
                if (payload.file != 'blank.json') {
                    $.ajax({
                        method: 'GET',
                        url: `/script/data/template/${payload.file}`,
                        success: json => {
                            commit('updateDataImages', json.charts);
                            resolve(json);
                        },
                        error: () => reject,
                    });
                } else {
                    resolve();
                }
            } else {
                reject();
            }
        });
    },
};
