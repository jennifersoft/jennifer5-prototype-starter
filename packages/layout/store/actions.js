import axios from '@library/axios';
import { getDayjs, serverDateFormat, ariesuser } from '@common/base';
import { createFormData } from '@common/utility';
import {
    eventRuleNotifyAll,
    systemEventList,
} from '@layout/listener/websocket';
import { xSocket } from '@common/legacy/xSocket';
import { Exporter } from '@common/legacy/Exporter';
import { JWTTypeDef } from '@common/definition';
import i18nMessages from '../i18n';

export default {
    async fetchMenuListAll({ state }) {
        return await axios.get('/menu/accessbleList/all/user', {
            params: {
                userId: state.user.id,
            },
        });
    },
    async createAutoLoginUrl(_, { memo, url }) {
        return await axios.post(
            '/auth/token/create',
            createFormData({
                tokenType: JWTTypeDef.SHARE_URL,
                memo,
                url,
            })
        );
    },
    async fetchMenuListCategorized({ commit, dispatch }) {
        const { data } = await dispatch('fetchMenuListAll');

        const preset = {
            dashboard: [],
            realtime: [],
            analysis: [],
            statistics: [],
            report: [],
        };

        for (const d of data) {
            if (!preset[d.type]) continue;
            preset[d.type].push({ ...d, displayName: d.name });
        }

        commit('setMenuList', {
            type: 'dashboard',
            list: preset.dashboard.concat(preset.realtime),
        });
        commit('setMenuList', { type: 'analysis', list: preset.analysis });
        commit('setMenuList', { type: 'statistics', list: preset.statistics });
        commit('setMenuList', { type: 'report', list: preset.report });
    },
    initializeSocket({ state, commit }) {
        const MessageSocket = new xSocket('/ws/push');
        MessageSocket.onMessageCallback = evt => {
            const obj = eval('(' + evt.data + ')'),
                data = obj.data;

            if (obj.key === 'eventRuleNotifyAll') {
                const { list, readIndex } = state.alarm;
                commit('updateAlarmSettings', {
                    desktop: data.desktop,
                    sound: data.sound,
                    maxCount: data.options.maxCount,
                });
                commit(
                    'updateAlarmList',
                    eventRuleNotifyAll(
                        data,
                        alarm => commit('updateSelectedAlarm', alarm),
                        list.length - readIndex
                    )
                );
            } else if (obj.key === 'systemEventList') {
                commit('updateNoticeAndSystemEvent', systemEventList(data));
            } else if (obj.key === 'forcedLogout') {
                alert(i18nMessages.M0291.split('%s').join(data.ip));
                location.href = '/logout';
            } else if (obj.key === 'forcedBan') {
                alert(i18nMessages.M0297.split('%s').join(data.ip));
                location.href = '/logout';
            }
        };
        MessageSocket.init();
    },
    async fetchAlarmSettings({ state, commit }, sound = false) {
        const { status } = await axios.post(
            '/user/modify/push',
            createFormData({
                browser: false,
                desktop: state.alarm.settings.desktop,
                sound,
            })
        );
        if (status === 200) {
            commit('updateAlarmSettings', {
                desktop: state.alarm.settings.desktop,
                sound,
            });
        }
    },
    async fetchAlarmSounds({ commit }) {
        const { data } = await axios.get(
            '/eventRule/notify/sound/list/all',
            null
        );
        commit('updateAlarmSounds', data);
    },
    async fetchUserInformation({ commit }) {
        const { data } = await axios.get('/user/find');
        commit('updateUserInfo', {
            id: data.id,
            name: data.name,
            email: data.email,
            groupId: data.groupId,
            startPage: data.defaultMenuCode,
        });
    },
    async fetchServerVersion({ commit }) {
        const { data } = await axios.get('/serverInfo/version', {
            params: {
                format: 'json',
            },
        });
        commit('updateServerVersion', data.view);
    },
    async fetchBackgroundJob({ commit }) {
        const { data } = await axios.get('/user/myjob/list');
        commit(
            'updateBackgroundJob',
            data.map(e => ({
                ...e,
                timestamp: getDayjs(e.lastModified).format(
                    serverDateFormat.longWithSec
                ),
            }))
        );
    },
    async removeBackgroundJob(_, { dir, name }) {
        await axios.post(
            '/user/myjob/delete',
            createFormData({
                dir,
                name,
            })
        );
    },
    async downloadBackgroundJob({ commit }, { lastModified, length, dir }) {
        const { status } = await axios.get('/user/myjob/download', {
            params: {
                time: lastModified,
                size: length,
                dir: dir,
            },
        });
        if (status === 200) {
            const $form = document.createElement('form');
            $form.innerHTML = `
                <form>
                    <input name="time" value="${lastModified}" type="hidden" />
                    <input name="size" value="${length}" type="hidden" />
                    <input name="dir" value="${dir}" type="hidden" />
                </form>`;
            $form.setAttribute('method', 'post');
            $form.setAttribute('action', '/user/myjob/download');

            document.body.appendChild($form);
            $form.submit();
            $form.remove();
        } else {
            commit('updateAlertMessageForBgJob', i18nMessages.M0595);
        }
    },
    async exportBackgroundJob({ commit }, { dir, name, lastModified, length }) {
        const title = `[${
            i18nMessages[
                dir === 'profiles' ? 'exportProfiles' : 'exportMustget'
            ]
        }] ${name}`;

        const content = `
            <div>
                ${i18nMessages.fileName}: ${name}<br/>
                ${i18nMessages.creationTime}: ${getDayjs(lastModified).format(
            serverDateFormat.longWithSec
        )}<br/>
                ${i18nMessages.size} (${i18nMessages.kb}): ${Math.round(
            length / 1024
        ).toLocaleForAries()}<br/>  
            </div>`;

        const link =
            '/user/myjob/download?time=' +
            lastModified +
            '&size=' +
            length +
            '&dir=' +
            dir;
        const html =
            content +
            "<br /><a href='" +
            link +
            "' class='profile-link'><i class='icon-link'></i> " +
            i18nMessages[
                dir === 'profiles' ? 'exportProfiles' : 'exportMustget'
            ] +
            '</a>';

        Exporter.text(title, html, function(article) {
            commit('updateAlertMessageForBgJob', i18nMessages.M0378);
        });
    },
    async changeStartPage({ commit, state }, startPage) {
        const { data } = await axios.get('/user/modify/screen', {
            params: {
                startPage,
                targetCount: ariesuser.expandedDashboardTargetCount,
            },
        });

        if (data) {
            commit('updateUserInfo', {
                ...state.user,
                startPage,
            });
        }
    },
    async checkLoginStatus() {
        let success = true;
        try {
            const res = await axios.get('/heartbeat/ping');
            success = res.data === 'pong' && res.status === 200;
        } catch (e) {
            success = false;
        }
        return success;
    },
};
