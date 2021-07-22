<template>
    <window class="about-jennifer"
            animation-name="fade-down"
            :open-x="offsetX"
            :open-y="offsetY"
            :open-w="width"
            :open-h="height"
            @cancel="$emit('close')"
            :draggable="false"
            hide-footer>
        <template #subject>
            <div class="about-jennifer-head">
                <img class="top-logo"
                     :src="logoPath"
                     :width="48"
                     :height="48"
                     alt="JENNIFER 5" />
                <div class="product-info">
                    <span class="name">{{ 'JENNIFER' }}</span>
                    <span class="version">{{ i18n.version }}&nbsp;{{ serverVersion }}</span>
                </div>
            </div>
        </template>
        <div class="about-jennifer-contents">
            <div class="body">
                <div class="title">{{ i18n.thirdPartyLicense }}</div>
                <div class="detail">
                    boot library : Boost License<br/>
                    asm library : BSD License<br/>
                    h2 database : Eclipse Public License<br/>
                    jetty, spring, logback, commons-collections4, commons-io, commons-codec, fernflower, jjwt, lucy-xss, guava, gson, google-http-client, jackson-databind, hibernate, hikaricp : Apache License 2.0<br/>
                    slf4j, juijs, vuejs, jquery, lodash, dayjs, summernote, monaco-editor : MIT License<br/>
                </div>
                <div class="message">{{ i18n.M0184 }}</div>
            </div>
            <div class="foot">
                <div v-html="i18n.M0090" style="margin-bottom: 32px;">{{ i18n.M0090 }}</div>
                <div v-html="i18n.M0091">{{ i18n.M0091 }}</div>
            </div>
        </div>
    </window>
</template>

<script>
import Window from "@vuejs/component/window/Window";
import _ from '@library/lodash';

export default {
    name: "AboutJennifer",
    components: {
        Window,
    },
    inject: {
        i18n: {
            default: {
                version: 'Version',
                thirdPartyLicense: 'thirdPartyLicense',
                M0184: 'M0184',
                M0090: 'M0090',
                M0091: 'M0091',
            }
        }
    },
    props: {
        logoPath: {
            type: String,
            required: true,
        },
        serverVersion: {
            type: String,
            required: true,
        },
        width: {
            type: Number,
            default: 600,
        },
        height: {
            type: Number,
            default: 450,
        }
    },
    data() {
        return {
            offsetX: window.innerWidth / 2 - this.width / 2,
            offsetY: window.innerHeight / 2 - this.height / 2,
        }
    },
    methods: {
        onResize: _.debounce(function ({ target }) {
            this.offsetX = target.innerWidth / 2 - this.width / 2;
            this.offsetY = target.innerHeight / 2 - this.height / 2;
        }),
    },
    mounted() {
        window.addEventListener('resize', this.onResize);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
    }
}
</script>

<style lang="scss" scoped>
@import "~@common/scss/themes.scss";

$themes: (
    classic: (
        typography-color-primary: #212121,
        typography-color-grey1: #616161,
    ),
    dark: (
        typography-color-primary: #e8e8e8,
        typography-color-grey1: #999999,
    ),
);

.about-jennifer {
    @include themify($themes) {

        color: themed('typography-color-primary');
        .about-jennifer-head {
            height: 66px;
            display: flex;
            justify-content: flex-start;
            font-size: 20px;
            margin-bottom: 48px;

            > .top-logo {
                margin-right: 16px;
            }

            > .product-info {
                display: flex;
                flex-direction: column;

                > .name {
                    line-height: 48px;
                    margin-bottom: 4px;
                }

                > .version {
                    font-weight: normal;
                    font-size: 12px;
                }
            }
        }

        .about-jennifer-contents {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            font-size: 12px;
            color: themed('typography-color-grey1');
            > .body {
                margin-bottom: 38px;
                > .title {
                    font-weight: bold;
                    color: themed('typography-color-primary');
                }
                > .detail {
                    margin: 16px 0;
                }
            }

            > .foot {
                flex: 1;
            }
        }
    }
}

</style>