<template>
    <div class="http-error-page">
        <svg
            v-if="lockSvg"
            xmlns="http://www.w3.org/2000/svg"
            width="98"
            height="173"
            viewBox="0 0 98 173"
        >
            <defs>
                <radialGradient
                    id="28pxxg548a"
                    cx="50%"
                    cy="50%"
                    r="50%"
                    fx="50%"
                    fy="50%"
                    gradientTransform="matrix(0 1 -.9955 0 .998 0)"
                >
                    <stop offset="0%" stop-color="#666" stop-opacity=".16" />
                    <stop offset="100%" stop-color="#666" stop-opacity="0" />
                </radialGradient>
            </defs>
            <g fill="none" fill-rule="evenodd">
                <g>
                    <g>
                        <g>
                            <path
                                fill="#865EFF"
                                fill-rule="nonzero"
                                d="M81.667 54.167V32.5C81.667 14.555 67.037 0 49 0S16.333 14.555 16.333 32.5v21.667H7c-3.866 0-7 3.134-7 7V123c0 3.866 3.134 7 7 7h84c3.866 0 7-3.134 7-7V61.167c0-3.866-3.134-7-7-7h-9.333zM54.5 96.477V109h-11V96.477C40.227 94.567 38 91.064 38 87c0-6.072 4.928-11 11-11s11 4.928 11 11c0 4.059-2.222 7.568-5.5 9.477zM27 54V32.5C27 20.643 36.867 11 49 11c12.127 0 22 9.643 22 21.5V54H27z"
                                transform="translate(-912 -388) translate(794.5 388) translate(117.5)"
                            />
                            <path
                                fill="url(#28pxxg548a)"
                                d="M0 140H98V173H0z"
                                transform="translate(-912 -388) translate(794.5 388) translate(117.5)"
                            />
                        </g>
                    </g>
                </g>
            </g>
        </svg>
        <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="228"
            height="137"
            viewBox="0 0 228 137"
        >
            <defs>
                <linearGradient
                    id="elq0o8dxka"
                    x1="85.295%"
                    x2="85.295%"
                    y1="100%"
                    y2="0%"
                >
                    <stop offset="0%" stop-color="#FFF" stop-opacity="0" />
                    <stop offset="100%" stop-color="#EAEAEA" />
                </linearGradient>
                <linearGradient
                    id="50zrgeflmb"
                    x1="85.295%"
                    x2="85.295%"
                    y1="100%"
                    y2="0%"
                >
                    <stop offset="0%" stop-color="#FFF" stop-opacity="0" />
                    <stop offset="100%" stop-color="#EAEAEA" />
                </linearGradient>
            </defs>
            <g fill="none" fill-rule="evenodd">
                <g>
                    <g>
                        <g>
                            <path
                                fill="#865EFF"
                                d="M187 57v64H67V57h120zm-77.143 28.235c-2.152 0-3.896 1.756-3.896 3.922 0 2.166 1.744 3.921 3.896 3.921s3.896-1.755 3.896-3.921-1.744-3.922-3.896-3.922zm17.143 0c-2.152 0-3.896 1.756-3.896 3.922 0 2.166 1.744 3.921 3.896 3.921s3.896-1.755 3.896-3.921-1.744-3.922-3.896-3.922zm17.143 0c-2.152 0-3.896 1.756-3.896 3.922 0 2.166 1.744 3.921 3.896 3.921s3.896-1.755 3.896-3.921-1.744-3.922-3.896-3.922z"
                                transform="translate(-827 -306) translate(636 306) translate(191)"
                            />
                            <path
                                fill="#653DDC"
                                d="M67 121L67 137 83 121z"
                                transform="translate(-827 -306) translate(636 306) translate(191)"
                            />
                            <path
                                fill="url(#elq0o8dxka)"
                                d="M228 0v60h-59V0h59zm-8 30h-43v2h43v-2zm0-7h-43v2h43v-2zm0-7h-43v2h43v-2zm0-7h-43v2h43V9z"
                                transform="translate(-827 -306) translate(636 306) translate(191)"
                            />
                            <path
                                fill="url(#50zrgeflmb)"
                                d="M35 79v36H0V79h35zm-4 18H4v1h27v-1zm0-4H4v1h27v-1zm0-4H4v1h27v-1zm0-4H4v1h27v-1z"
                                transform="translate(-827 -306) translate(636 306) translate(191)"
                            />
                        </g>
                    </g>
                </g>
            </g>
        </svg>

        <div class="error-code">{{ codeMessage }}</div>
        <div class="title">{{ title }}</div>
        <div class="message" v-html="message" />
    </div>
</template>

<script>
export default {
    name: 'App.vue',
    props: {
        lockSvg: {
            type: Boolean,
            required: false,
            default: false,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: false,
            default: '',
        },

        codeMessage: {
            type: String,
            required: true,
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@common/scss/themes.scss';
$themes: (
    classic: (
        error-code-color: #6330ee,
        title-color: #212121,
        message-color: #616161,
    ),
    dark: (
        error-code-color: #a47cff,
        title-color: #e8e8e8,
        message-color: #999999,
    ),
);

.http-error-page {
    justify-content: center;
    align-items: center;
    height: 100%;
    display: flex;
    flex-direction: column;
    @include themify($themes) {
        .error-code {
            margin-top: 56px;
            color: themed('error-code-color');
            font-size: 14px;
        }
        .title {
            color: themed('title-color');
            font-size: 24px;
            margin: 24px 0;
        }
        .message {
            color: themed('message-color');
            font-size: 16px;
            text-align: center;
        }
    }
}
</style>
