<template>
    <div class="edit-iframe">
        <div class="iframe-configure-without-btn">
            <div class="title">
                <div>{{ i18n.iframe }}</div>
            </div>
            <div class="link">
                <span>{{ i18n.url }}</span>
                <div class="data-input">
                    <input-field small v-model="iframeURL" />
                </div>
            </div>
        </div>
        <div v-show="editingComponentDataKey === undefined" class="insert-box">
            <btn
                :items="[{ text: i18n.insert }]"
                style="width: 248px; margin: 10px auto 0 auto; text-align: center!important;"
                class="focus"
                normal
                @click="onClickInsert"
            />
        </div>
    </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import { i18n } from '@common/utility';
import { GenerateKey } from '@module/global/GenerateKey';
import Btn from '@vuejs/component/button/Btn';
import InputField from '@vuejs/component/Input/InputField';

const { mapGetters, mapState, mapMutations } = createNamespacedHelpers(
    'userdefine'
);
export default {
    name: 'editIframe',
    components: {
        Btn,
        InputField,
    },
    data() {
        return {
            i18n: {
                iframe: i18n.get('ui.en.iframe'),
                url: i18n.get('ui.en.url'),
                insert: i18n.get('ui.label.insert'),
            },
        };
    },
    methods: {
        ...mapMutations(['setIframeURL', 'setComponent']),

        onClickInsert() {
            if (this.editingIframeOptions.url.trim() === '') return;

            const componentOption = Object.assign(
                { ...this.editingIframeOptions },
                this.defaultComponentPosition,
                {
                    dataKey: GenerateKey.makeLongKeyByTime(),
                    zIndex: this.nextZIndex,
                }
            );

            this.setComponent(componentOption);
        },
    },
    computed: {
        ...mapState([
            'editingIframeOptions',
            'editingComponentDataKey',
            'defaultComponentPosition',
        ]),

        iframeURL: {
            get() {
                return this.editingIframeOptions.url;
            },
            set(value) {
                this.setIframeURL(value);
                if (this.editingComponentDataKey)
                    this.setComponent(this.editingIframeOptions);
            },
        },
    },
};
</script>
<style lang="scss" scoped>
@import '../themes.scss';
.edit-iframe {
    width: 280px;
    height: calc(100% - 41px);
    @include themify($themes) {
        background-color: themed('area-menu-background-color');
        > .iframe-configure-without-btn {
            height: calc(100% - 67px);
            overflow-y: auto;

            color: themed('edit-component-title2-color');

            div.title {
                height: 40px;

                > div {
                    height: 24px;
                    margin: 8px 0 8px 16px;
                    font-size: 14px;
                    font-weight: bold;
                    color: themed('edit-component-title1-color');
                }
            }

            > div:not(.title) {
                display: flex;
                flex-direction: column;
                padding: 16px;

                > span {
                    line-height: 28px;
                    flex-grow: 1;
                }

                .data-input {
                    margin-top: 14px;

                    input {
                        width: 100%;
                    }
                }
            }
        }

        .insert-box {
            border-top: solid 1px themed('area-menu-border-color');
            margin-top: auto;
            display: flex;
        }
    }
}
</style>
