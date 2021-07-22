import axios from '@library/axios';
import { createFormData } from '@common/utility';

export const savePushAlarm = async (desktop, sound) => {
    return await axios.post(
        '/user/modify/push',
        createFormData({
            browser: false, // 이제 사용하지 않음
            desktop,
            sound,
        })
    );
};

export const saveAlarmOptions = async (
    normalStatus,
    warningStatus,
    fatalStatus,
    soundLoop,
    maxAge,
    maxCount
) => {
    return await axios.post(
        '/eventRule/notify/options/save',
        createFormData({
            normalStatus: normalStatus.active,
            normalTimeout: normalStatus.delay * 1000,
            normalSound: normalStatus.sound,
            warningStatus: warningStatus.active,
            warningTimeout: warningStatus.delay * 1000,
            warningSound: warningStatus.sound,
            fatalStatus: fatalStatus.active,
            fatalTimeout: fatalStatus.delay * 1000,
            fatalSound: fatalStatus.sound,
            soundLoop,
            maxAge,
            maxCount,
        })
    );
};

export const loadAlarmOptions = async () => {
    return await axios.get('/eventRule/notify/options/get', {
        params: {
            format: 'json',
        },
    });
};

export const loadSoundFiles = async () => {
    return await axios.get('/eventRule/notify/sound/list/all');
};
