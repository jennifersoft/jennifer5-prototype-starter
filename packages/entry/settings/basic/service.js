import axios from '@library/axios';
import { createFormData } from '@common/utility';

export const loadMenuItems = async () => {
    return await axios.get('/menu/accessbleList/all', {
        params: {
            format: 'json',
        },
    });
};

export const loadUserInfo = async () => {
    return await axios.get('/user/find');
};

export const saveAll = (startPage, targetCount, language, theme) => {
    return axios.all([
        axios.post(
            '/user/modify/screen',
            createFormData({
                startPage,
                targetCount,
            })
        ),
        axios.get(`/language/${language}`),
        axios.get(`/user/theme/${theme}`),
    ]);
};
