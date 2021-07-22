import { server } from '@common/base';

export const linkToEditorPage = (url, key) => {
    const httpMethod = server.reportTalkOnlyAllowPost ? 'post' : 'get';
    const form = document.createElement('form');
    form.setAttribute('method', httpMethod);
    form.setAttribute('action', url);

    const hiddenField = document.createElement('input');
    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('name', 'key');
    hiddenField.setAttribute('value', key);
    form.appendChild(hiddenField);

    document.body.appendChild(form);
    form.submit();
};
