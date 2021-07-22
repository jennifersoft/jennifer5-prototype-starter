<template>
    <window
        class="mng-window"
        :open-w="layerWidth"
        :open-h="layerHeight"
        :open-x="layerLeft"
        :open-y="layerTop"
        :hide-footer="!useFooter"
        :hide-cancel-btn="true"
        :messages="{ apply: btnTitle, cancel: i18n.cancel }"
        @apply="submitCaller"
        @cancel="$emit('close')"
    >
        <template #subject>
            <template v-if="url !== '/mng/index'">
                <svg-icon
                    class="back-icon"
                    :icon-type="backIcon"
                    :width="iconSize"
                    :height="iconSize"
                    @click.native="$emit('home')"
                ></svg-icon>
                <span class="blank">{{ title }}</span>
            </template>
            <span v-else>{{ title }}</span>
        </template>

        <template #icons>
            <btn
                class="border-none"
                :items="[{ iconType: helpIcon }]"
                @click="openManual"
            ></btn>
        </template>

        <div class="body" :style="{ overflow: bodyScroll, height: bodyHeight }">
            <div class="loading" v-if="useLoading"></div>
            <iframe
                v-show="url !== ''"
                ref="iframe"
                id="mng_iframe"
                :src="url"
                :style="{ 'min-height': iframeHeight }"
                frameborder="0"
                scrolling="no"
                width="100%"
            ></iframe>
        </div>
    </window>
</template>

<script>
import { iframeResizer } from 'iframe-resizer';
import { hashManual } from '@common/utility';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import Window from '@vuejs/component/window/Window';
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import Btn from '@vuejs/component/button/Btn';
import i18nMessages from '@vuejs/component/messages';
import _ from '@library/lodash';

export default {
    inject: ['i18n'],
    components: {
        Window,
        SvgIcon,
        Btn,
    },
    props: {
        url: {
            type: String,
            required: false,
            default: '',
        },
        title: {
            type: String,
            required: false,
            default: '',
        },
        width: {
            type: Number,
            required: false,
            default: 900,
        },
        height: {
            type: Number,
            required: false,
            default: 550,
        },
        scroll: {
            type: Boolean,
            required: false,
            default: false,
        },

        btnTitle: {
            type: String,
            required: false,
            default: i18nMessages.apply,
        },
        btnFunc: {
            type: String,
            required: false,
            default: '',
        },
        useFooter: {
            type: Boolean,
            required: false,
            default: false,
        },
        useLoading: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    computed: {
        layerWidth() {
            return this.width + 30;
        },
        layerHeight() {
            return this.height + 78;
        },
        bodyHeight() {
            //  푸터 영역 높이가 47px, 푸터를 사용하면 바디에서 해당 높이만큼 빼준다.
            return `${this.height - (this.useFooter ? 47 : 0)}px`;
        },
        bodyScroll() {
            return this.scroll && !this.useLoading ? 'auto' : 'hidden';
        },
        footDisplay() {
            return this.useFooter ? 'block' : 'none';
        },
        footHeight() {
            return this.useFooter ? '47px' : '0px';
        },
        iframeHeight() {
            return `${parseInt(this.bodyHeight) - 5}px`;
        },
    },
    data() {
        return {
            backIcon: ICON_TYPE.home,
            helpIcon: ICON_TYPE.help,
            iconSize: 20,
            layerLeft: window.innerWidth / 2 - this.width / 2,
            layerTop: window.innerHeight / 2 - this.height / 2,
        };
    },
    methods: {
        submitCaller() {
            if (this.btnFunc != '') {
                this.$refs.iframe.contentWindow[this.btnFunc]();
            }
        },
        openManual() {
            hashManual(this.url);
        },
        onResizeWindow: _.debounce(function() {
            this.layerLeft = window.innerWidth / 2 - this.width / 2;
            this.layerTop = window.innerHeight / 2 - this.height / 2;
        }, 100),
    },
    mounted() {
        iframeResizer(
            {
                log: false,
                checkOrigin: false,
                heightCalculationMethod: 'bodyScroll',
            },
            this.$refs.iframe
        );

        this.$refs.iframe.addEventListener('load', () => {
            setTimeout(() => this.$emit('ready'), 500);
        });
        window.addEventListener('resize', this.onResizeWindow);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResizeWindow);
    },
};
</script>

<style lang="scss" scoped>
.mng-window {
    .back-icon {
        position: absolute;
        z-index: 1000;
        top: 23px;
        cursor: pointer;
    }

    .blank {
        margin-left: 23px;
    }

    .loading {
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-position-x: 50%;
        background-position-y: 50%;
        background-image: url('../../asset/loading.svg');
    }
}
</style>
