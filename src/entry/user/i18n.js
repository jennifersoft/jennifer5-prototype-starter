import { i18n } from '@common/utility';
import axios from '@library/axios';

export default {
    login: i18n.get('ui.button.login'),
    userId: i18n.get('ui.label.userId'),
    keepLogin: i18n.get('ui.label.keepLogin'),
    password: i18n.get('ui.label.password'),
    requiredFields: i18n.get('ui.label.requiredFields'),
    userName: i18n.get('ui.label.userName'),
    confirmPassword: i18n.get('ui.label.confirmPassword'),
    optionalFields: i18n.get('ui.label.optionalFields'),
    company: i18n.get('ui.label.company'),
    dept: i18n.get('ui.label.dept'),
    jobTitle: i18n.get('ui.label.jobTitle'),
    cellphone: i18n.get('ui.label.cellphone'),
    email: i18n.get('ui.label.email'),
    cancel: i18n.get('ui.button.cancel'),
    apply: i18n.get('ui.button.confirm'),
    join: i18n.get('ui.button.join'),
    joinIn: i18n.get('ui.button.joinIn'),
    confirm: i18n.get('ui.button.confirm'),
    logout: i18n.get('ui.label.logout'),
    approvedWait: i18n.get('ui.label.approvedWait'),
    accountLocked: i18n.get('ui.label.accountLocked'),
    changePassword: i18n.get('ui.label.changePassword'),
    currentPassword: i18n.get('ui.label.currentPassword'),
    newPassword: i18n.get('ui.label.newPassword'),
    confirmNewPassword: i18n.get('ui.label.confirmNewPassword'),
    changeNext: i18n.get('ui.button.changeNext'),
    errorCode: i18n.get('ui.label.errorCode'),
    createAdminUser: i18n.get('ui.label.createAdminUser'),
    M0492: i18n.get('M0492'),
    M0002: i18n.get('M0002'),
    M0428: i18n.get('M0428'),
    M0497: i18n.get('M0497'),
    M0564: i18n.get('M0564'),
    M0565: i18n.get('M0565'),
    M0001: i18n.get('M0001'),
    M0292: i18n.get('M0292'),
    M0104: i18n.get('M0104'),
    M0105: i18n.get('M0105'),
    M0299: i18n.get('M0299'),
    M0300: i18n.get('M0300'),
    M0107: i18n.get('M0107'),
    M0101: i18n.get('M0101'),
    M0296: i18n.get('M0296'),
    M0491: i18n.get('M0491'),
    M0298: i18n.get('M0298'),
    M0278: i18n.get('M0278'),
    M0574: i18n.get('M0574'),
    M0003: i18n.get('M0003'),
    M0091: i18n.get('M0091'),
    M0106: i18n.get('M0106'),
    M0108: i18n.get('M0108'),
    M0115: i18n.get('M0115'),
    M0116: i18n.get('M0116'),
    M0341: i18n.get('M0341'),
    M0342: i18n.get('M0342'),
    M0343: i18n.get('M0343'),
    M0339: i18n.get('M0339'),
    M0340: i18n.get('M0340'),
    M0480: i18n.get('M0480'),
    M0638: i18n.get('M0638'),
    M0639: i18n.get('M0639'),
    M0640: i18n.get('M0640'),
    M0641: i18n.get('M0641'),
    next: i18n.get('ui.label.next'),
    error: i18n.get('ui.label.error'),
    M0103: i18n.get('M0103'),
    M0118: i18n.get('M0118'),
    M0478: i18n.get('M0478'),
};

export async function getMessageAlongPolicy(code, password = '') {
    if (code !== 'M0104') return { code, message: i18n.get(code) };

    const patternCount = (pattern, str) => {
        const regex = new RegExp(pattern);
        let count = 0;
        for (const ch of str) {
            if (regex.test(ch)) count += 1;
        }
        return count;
    };

    let detailCode = null;
    let digit = -1;
    const { data } = await axios.post('/login/password/policy/get');
    const {
        passwordLength,
        minLowercase,
        minUppercase,
        minDigit,
        minSpecial,
    } = data;

    if (patternCount('[A-Z]', password) < minUppercase) {
        detailCode = 'M0644';
        digit = minUppercase;
    }
    if (patternCount('[a-z]', password) < minLowercase) {
        detailCode = 'M0643';
        digit = minLowercase;
    }
    if (patternCount('[0-9]', password) < minDigit) {
        detailCode = 'M0645';
        digit = minDigit;
    }
    if (!detailCode) {
        detailCode = 'M0646';
        digit = minSpecial;
    }
    if (password.length < passwordLength) {
        detailCode = 'M0642';
        digit = passwordLength;
    }

    return {
        code: detailCode,
        message: i18n.get(detailCode).replace('%d', digit),
    };
}

const PASSWORD_INVALID_STATUS = {
    M0642: 'PW_SHORT',
    M0643: 'PW_LESS_LOWERCASE',
    M0644: 'PW_LESS_UPPERCASE',
    M0645: 'PW_LESS_DIGIT',
    M0646: 'PW_LESS_SPECIAL',
};

export const SIGN_UP_STATUS_MAP = {
    M0329: 'INVALID_USER',
    M0103: 'REQUIRED_FIELD_MISSING',
    M0118: 'INVALID_ID',
    M0101: 'ID_ALREADY_EXISTS',
    M0104: 'INVALID_PASSWORD',
    M0107: 'SIGN_UP_SUCCESS',
    ...PASSWORD_INVALID_STATUS,
};

export const PW_MODIFY_STATUS_MAP = {
    M0328: 'INVALID_USER',
    M0117: 'PW_NOT_CORRECT',
    M0111: 'PW_NOT_MODIFIED',
    M0104: 'INVALID_PASSWORD',
    M0116: 'MODIFY_SUCCESS',
    ...PASSWORD_INVALID_STATUS,
};

export const ADMIN_SIGN_UP_STATUS = {
    M0101: 'ID_INVALID',
    M0103: 'REQUIRED_FIELD_MISSING',
    M0118: 'ID_SHORT',
    M0478: 'SIGN_UP_SUCCESS',
};

export const LOGIN_STATUS = {
    M0296: 'USER_UNAUTHORIZED',
    M0491: 'IP_INVALID',
    M0298: 'MAX_SESSION_EXCEEDED',
    M0278: 'ACCOUNT_LOCKED',
    M0574: 'RESTRICTED_WITH_SSO',
    M0003: 'INFO_NOT_MATCH',
};
