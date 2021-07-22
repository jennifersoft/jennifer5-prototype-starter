import styled, { css } from 'vue-styled-components';

export const AlarmBoxWrapper = styled('div', {
    normal: Boolean,
    warning: Boolean,
    fatal: Boolean,
})`
    .classic & {
        --box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08),
            inset 1px 1px 0 0 rgba(255, 255, 255, 0.5);
        --box-bg: #ffffff;
        --box-bg-hover: rgba(0, 0, 0, 0.05);
        --box-bg-active: rgba(0, 0, 0, 0.16);
        --text-default: #212121;
        --text-secondary: #616161;
        --badge-bg-normal: #cce4f9;
        --badge-bg-warning: #fbeecc;
        --badge-bg-fatal: #ffccd1;
    }

    .dark & {
        --box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.4),
            inset 1px 1px 0 0 rgba(255, 255, 255, 0.08);
        --box-bg: #1c1c1c;
        --box-bg-hover: rgba(255, 255, 255, 0.08);
        --box-bg-active: rgba(255, 255, 255, 0.16);
        --text-default: #e8e8e8;
        --text-secondary: #999999;
        --badge-bg-normal: #4986e7;
        --badge-bg-warning: #ffbf17;
        --badge-bg-fatal: #d24654;
    }

    width: 320px;
    box-sizing: border-box;
    position: relative;
    padding: 16px;
    margin-left: 8px;
    border-radius: 0 4px 4px 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 12px;
    cursor: pointer;
    user-select: none;

    box-shadow: var(
        --box-shadow,
        0 2px 4px 0 rgba(0, 0, 0, 0.08),
        inset 1px 1px 0 0 rgba(255, 255, 255, 0.5)
    );
    background-color: var(--box-bg, #ffffff);
    color: var(--text-default, #212121);

    &::before {
        position: absolute;
        content: '';
        top: 0;
        left: -8px;
        width: 8px;
        height: 100%;
        background-color: ${props =>
            props.normal ? '#497eff' : props.warning ? '#ffdd26' : '#ff4f55'};
        border-radius: 4px 0 0 4px;
    }

    &:hover {
        &::after {
            position: absolute;
            content: '';
            top: 0;
            left: -8px;
            right: 0;
            height: 100%;
            border-radius: inherit;
            background-color: var(--box-bg-hover, rgba(0, 0, 0, 0.05));
        }
    }

    &:active {
        &::after {
            position: absolute;
            content: '';
            top: 0;
            left: -8px;
            right: 0;
            height: 100%;
            border-radius: inherit;
            background-color: var(--box-bg-active, rgba(0, 0, 0, 0.16));
        }
    }

    > *:not(:last-child) {
        margin-bottom: 8px;
    }

    > .name-badge {
        display: inline-block;
        padding: 0 4px;
        height: 18px;
        line-height: 18px;
        border-radius: 3px;

        ${props =>
            props.normal &&
            css`
                background-color: var(--badge-bg-normal, #cce4f9);
            `};

        ${props =>
            props.warning &&
            css`
                background-color: var(--badge-bg-warning, #fbeecc);
            `};
        ${props =>
            props.fatal &&
            css`
                background-color: var(--badge-bg-fatal, #ffccd1);
            `};

        color: #212121;
    }
    > .message {
    }
    > .timestamp {
        font-size: 11px;
        color: var(--text-secondary, #616161);
    }
`;

export const MenuItemWrapper = styled('div')`
    .classic & {
        --text-default: #616161;
        --text-hover: #212121;
        --bg-hover: rgba(0, 0, 0, 0.05);
    }

    .dark & {
        --text-default: #999999;
        --text-hover: #e8e8e8;
        --bg-hover: rgba(255, 255, 255, 0.05);
    }

    width: 224px;
    padding: 8px;
    box-sizing: border-box;
    position: relative;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    border-radius: 4px;
    color: var(--text-default, #616161);

    > .thumbnail {
        margin-left: 8px;
    }

    > .text {
        word-break: keep-all;
        overflow-wrap: anywhere;
        // Same property from previous version
        word-wrap: anywhere;
    }

    &:hover {
        &::before {
            position: absolute;
            content: '';
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: inherit;
            background: var(--bg-hover, rgba(0, 0, 0, 0.05));
        }
        color: var(--text-hover, #212121);
    }

    &:active,
    &.active {
        background-color: #8652ff;
        color: #ffffff;
    }
`;

export const NoticeBoxWrapper = styled('div', {
    success: Boolean,
    danger: Boolean,
})`
    .classic & {
        --box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08),
            inset 1px 1px 0 0 rgba(255, 255, 255, 0.5);
        --bg-success: #ffffff;
        --bg-danger: #ffe6e8;
        --icon-success: #1fa558;
        --icon-danger: #df2c34;
        --text-primary: #212121;
        --text-secondary: #616161;
    }

    .dark & {
        --box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.4),
            inset 1px 1px 0 0 rgba(255, 255, 255, 0.08);
        --bg-success: #1c1c1c;
        --bg-danger: #c42a2f;
        --icon-success: #1fa558;
        --icon-danger: #ffffff;
        --text-primary: #e8e8e8;
        --text-secondary: #999999;
    }

    width: 328px;
    box-sizing: border-box;
    padding: 16px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    box-shadow: var(
        --box-shadow,
        0 2px 4px 0 rgba(0, 0, 0, 0.08),
        inset 1px 1px 0 0 rgba(255, 255, 255, 0.5)
    );

    ${props =>
        props.success
            ? css`
                  background-color: var(--bg-success, #ffffff);
              `
            : css`
                  background-color: var(--bg-danger, #ffe6e8);
              `};

    > .icon {
        flex-shrink: 0;
        ${props =>
            props.success
                ? css`
                      color: var(--icon-success, #1fa558);
                  `
                : css`
                      color: var(--icon-danger, #df2c34);
                  `};
    }

    > .content {
        flex: 1;
        margin-left: 16px;
        display: flex;
        flex-direction: column;
        font-size: 12px;
        word-break: break-word;
        > .message {
            color: var(--text-primary, #212121);
        }
        > .timestamp {
            font-size: 11px;
            color: var(--text-secondary, #616161);
            margin-top: 8px;
        }
    }
`;
