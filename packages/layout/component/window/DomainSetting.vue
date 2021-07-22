<template>
    <window
        class="domain-setting"
        animation-name="fade-down"
        close-btn-type="none"
        :open-x="offsetX"
        :open-y="offsetY"
        :open-w="width"
        :open-h="height"
        :draggable="false"
        hide-footer
        v-if="active"
    >
        <div class="domain-setting-contents">
            <div class="logo">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100"
                    height="108"
                    viewBox="0 0 100 108"
                >
                    <g fill="none" fill-rule="evenodd">
                        <g fill="#E8E8E8">
                            <g>
                                <path
                                    d="M305.116 128.39c-2.36 2.515-2.468 3.906-2.441 5.62h-5.223c-.018-3.807.05-5.486 3.727-8.95 1.496-1.404 2.673-2.516 2.51-4.698-.15-2.08-1.9-3.164-3.56-3.164-1.845 0-4.008 1.359-4.008 5.193h-5.236c0-6.192 3.672-10.193 9.354-10.193 2.7 0 5.063.874 6.65 2.467 1.481 1.489 2.254 3.536 2.222 5.93-.036 3.569-2.232 5.913-3.995 7.794zm-5.114 15.295c-1.8 0-3.259-1.445-3.259-3.222 0-1.782 1.46-3.226 3.26-3.226 1.8 0 3.258 1.444 3.258 3.226 0 1.778-1.459 3.222-3.259 3.222zm26.363-3.137l-26.367 13.933-26.367-13.933v-28.79l26.367-14.239 26.367 14.396v28.633zM299.998 72L250 99v54.59L299.998 180 350 153.59V99.292L299.998 72z"
                                    transform="translate(-910 -348) translate(660 276)"
                                />
                            </g>
                        </g>
                    </g>
                </svg>
            </div>
            <div class="title">
                {{ i18n.M0141 }}
            </div>
            <div class="subtitle">{{ i18n.M0207 }}</div>
            <div class="button">
                <btn
                    large
                    :items="[{ text: i18n.M0143 }]"
                    @click="linkToDomainSetting"
                ></btn>
            </div>
        </div>
    </window>
</template>

<script>
import _ from '@library/lodash';
import Window from '@vuejs/component/window/Window';
import Btn from '@vuejs/component/button/Btn';
import { vuebus } from '@common/base';

export default {
    components: {
        Window,
        Btn,
    },
    inject: ['i18n'],
    data() {
        const width = 600;
        const height = 470;

        return {
            width,
            height,
            offsetX: window.innerWidth / 2 - width / 2,
            offsetY: window.innerHeight / 2 - height / 2,
            active: true,
        };
    },
    methods: {
        onResize: _.debounce(function({ target }) {
            this.offsetX = target.innerWidth / 2 - this.width / 2;
            this.offsetY = target.innerHeight / 2 - this.height / 2;
        }),
        linkToDomainSetting() {
            this.active = false;
            this.$emit('link-mng');
            vuebus.$emit('modal.changeMngUrl', '/mng/domainName');
        },
    },
    mounted() {
        window.addEventListener('resize', this.onResize);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
    },
};
</script>

<style lang="scss" scoped>
@import '~@common/scss/themes.scss';

$themes: (
    classic: (
        common-font-color: #616161,
    ),
    dark: (
        common-font-color: #999999,
    ),
);

.domain-setting {
    @include themify($themes) {
        .domain-setting-contents {
            color: themed('common-font-color');
            text-align: center;
            padding: 32px 109px 0px 109px;
            > .logo {
                margin-bottom: 40px;
            }
            > .title {
                font-size: 24px;
                margin-bottom: 24px;
            }
            > .subtitle {
                margin-bottom: 32px;
            }
        }
    }
}
</style>
