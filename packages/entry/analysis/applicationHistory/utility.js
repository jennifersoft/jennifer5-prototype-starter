import {
    DeployResourceStatusDef,
    DeployResourceTypeDef,
} from '@common/definition';
import { i18n } from '@common/utility';

export function getResourceType(value) {
    for (let key in DeployResourceTypeDef) {
        if (value == DeployResourceTypeDef[key]) {
            return key;
        }
    }

    return i18n.get('ui.label.unknown');
}

export function getResourceStatus(value) {
    for (let key in DeployResourceStatusDef) {
        if (value == DeployResourceStatusDef[key]) {
            return key == 'DEFAULT' ? '' : key;
        }
    }

    return i18n.get('ui.label.unknown');
}

export function checkReadResourceContents(type) {
    return (
        type == DeployResourceTypeDef.CLASS ||
        type == DeployResourceTypeDef.JSP ||
        type == DeployResourceTypeDef.JS ||
        type == DeployResourceTypeDef.XML ||
        type == DeployResourceTypeDef.JAVA ||
        type == DeployResourceTypeDef.CSS ||
        type == DeployResourceTypeDef.ASPX ||
        type == DeployResourceTypeDef.CSHTML ||
        type == DeployResourceTypeDef.CONFIG ||
        type == DeployResourceTypeDef.PHP
    );
}

export function checkEscapingContents(type) {
    if (!checkReadResourceContents(type)) return false;

    return (
        type == DeployResourceTypeDef.JSP ||
        type == DeployResourceTypeDef.XML ||
        type == DeployResourceTypeDef.CSS ||
        type == DeployResourceTypeDef.ASPX ||
        type == DeployResourceTypeDef.CSHTML ||
        type == DeployResourceTypeDef.PHP
    );
}
