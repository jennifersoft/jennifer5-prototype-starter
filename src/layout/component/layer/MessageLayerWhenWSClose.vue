<template>
    <div class="message-layer-when-ws-close" v-show="show">
        <div class="loading">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="202"
                height="42"
                viewBox="0 0 202 42"
            >
                <clipPath id="clipPath">
                    <rect x="0" y="0" width="10" height="42" />
                </clipPath>

                <path
                    id="iconPath"
                    d="M216 189c-7.2 0-13 5.8-13 13s5.8 13 13 13 13-5.8 13-13-5.8-13-13-13zm160 0c-7.2 0-13 5.8-13 13s5.8 13 13 13 13-5.8 13-13-5.8-13-13-13zm-80 0c-7.2 0-13 5.8-13 13s5.8 13 13 13 13-5.8 13-13-5.8-13-13-13zm-80 34c-11.6 0-21-9.4-21-21s9.4-21 21-21c10.2 0 18.8 7.3 20.6 17h38.8c1.9-9.7 10.4-17 20.6-17 10.2 0 18.8 7.3 20.6 17h38.8c1.9-9.7 10.4-17 20.6-17 11.6 0 21 9.4 21 21s-9.4 21-21 21c-10.2 0-18.8-7.3-20.6-17h-38.8c-1.9 9.7-10.4 17-20.6 17-10.2 0-18.8-7.3-20.6-17h-38.8c-1.8 9.6-10.3 17-20.6 17z"
                    transform="translate(-195 -181)"
                />
                <use clip-path="url(#clipPath)" xlink:href="#iconPath" />
            </svg>
        </div>

        <div class="message" v-html="message" />
    </div>
</template>

<script>
import { Observer } from '@common/legacy/Observer';
import { DataKeywordInObserver } from '@common/ObserverKeyword';

export default {
    name: 'MessageLayerWhenWSClose',
    data() {
        return {
            message: '',
            show: false,
        };
    },
    mounted() {
        Observer.on(
            DataKeywordInObserver.SHOW_MESSAGE_WHEN_WS_CLOSE,
            message => {
                this.message = message;
                this.show = true;
            }
        );

        Observer.on(
            DataKeywordInObserver.HIDE_MESSAGE_WHEN_WS_CLOSE,
            message => {
                this.show = false;
            }
        );
    },
};
</script>

<style lang="scss" scoped>
@import '~@common/scss/themes.scss';
$themes: (
    classic: (
        bg-color: rgba(255, 255, 255, 0.9),
        text-color: #616161,
        loading-bg-color: #e8e8e8,
        loading-fill-color: #865eff,
    ),
    dark: (
        bg-color: rgba(0, 0, 0, 0.9),
        text-color: #999999,
        loading-bg-color: #4e4e4e,
        loading-fill-color: #865eff,
    ),
);

.message-layer-when-ws-close {
    position: fixed;
    z-index: 10000;

    right: 0;
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    bottom: 0;
    top: 0;
    left: 72px;

    @include themify($themes) {
        background-color: themed('bg-color');
        > .message {
            text-align: center;
            color: themed('text-color');
            font-size: 24px;
            margin-top: 64px;
        }

        .loading {
            > svg {
                fill: themed('loading-fill-color');

                > use {
                    fill: themed('loading-bg-color');
                }
            }
        }
    }

    @keyframes loading {
        from {
            width: 0;
        }
        to {
            width: 202px;
        }
    }

    #clipPath rect {
        animation: loading 2s infinite alternate;
    }
}
</style>
