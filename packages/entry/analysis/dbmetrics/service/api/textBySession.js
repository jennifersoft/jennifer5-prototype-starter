import axios from 'axios';
import { TextTypeDef } from '@common/definition';

export const ServiceText = {
    async create(textType, domainIds, startTime, endTime) {
        return await axios.get('/textBySession/create', {
            params: {
                domainIds: domainIds,
                textType:
                    textType == 'application'
                        ? TextTypeDef.SERVICE
                        : TextTypeDef[textType.toUpperCase()],
                startTime: startTime,
                endTime: endTime,
            },
        });
    },
    async read(sessionKey) {
        return await axios.get('/textBySession/read', {
            params: {
                sessionKey: sessionKey,
            },
        });
    },
};

export async function serviceTextHelper(
    textType,
    domainIds,
    startTime,
    endTime,
    callback,
    sessionKey = '',
    data = []
) {
    const realSessionKey =
        sessionKey ||
        (await ServiceText.create(textType, domainIds, startTime, endTime))
            .data;
    const res = await ServiceText.read(realSessionKey);
    data = data.concat(res.data.texts);

    if (res.data.completed) {
        callback(data);
    } else {
        await serviceTextHelper(
            textType,
            domainIds,
            startTime,
            endTime,
            callback,
            realSessionKey,
            data
        );
    }
}
