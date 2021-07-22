import axios from '@library/axios';

export const gcCommitAgent = async params => {
    const url = '/agent/gc';

    return await axios.post(url, null, {
        params: params,
    });
};
