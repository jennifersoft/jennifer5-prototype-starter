import axios from '@library/axios';
import { createFormData } from '@common/utility';

export const loadPasswordPolicy = async () => {
    return await axios.get('/user/password/policy/get');
};

export const changeUserPassword = async (id, password, newPassword) => {
    return await axios.post(
        '/user/modify/password',
        createFormData({
            id: id,
            password: password,
            newPassword: newPassword,
        })
    );
};

export const saveUserData = async form => {
    return await axios.post(
        '/user/modify/self',
        createFormData({ ...form, password: '' })
    );
};
