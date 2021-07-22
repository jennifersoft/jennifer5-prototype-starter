<template>
    <div class="table-of-contents" v-if="activity">
        <div class="top">
            <div class="subject">{{ i18n.contents }}</div>
            <div class="tools">
                <btn
                    ref="btn-sync"
                    :class="['border-none']"
                    :items="[{ iconType: iconTypes.refresh }]"
                    :tooltip-options="{
                        message: i18n.refresh,
                        position: 'top-center',
                    }"
                    @click.native="syncContents"
                ></btn>
                <btn
                    ref="btn-toggle"
                    :class="['border-none']"
                    :items="[{ iconType: iconTypes.close }]"
                    :tooltip-options="{
                        message: i18n.hideContents,
                        position: 'top-right',
                    }"
                    @click.native="toggleContents"
                ></btn>
            </div>
        </div>
        <div class="bottom">
            <ul>
                <li v-for="item in items">
                    <a
                        ref="item"
                        :type="item.type"
                        @click="searchContents(item.type, item.text)"
                        >{{ item.text }}</a
                    >
                </li>
            </ul>
        </div>
    </div>

    <tooltip
        class="layered-btn"
        :message="i18n.showContents"
        :position="'top-center'"
        :style="{ top: `${iconTop}px` }"
        @click.native="toggleContents"
        v-else
    >
        <svg-icon
            :icon-type="iconTypes.list"
            :width="24"
            :height="24"
        ></svg-icon>
    </tooltip>
</template>
<script>
import $ from '@library/jquery';
import { i18n } from '@common/utility';
import Tooltip from '@vuejs/component/tooltip/Tooltip';
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import Btn from '@vuejs/component/button/Btn';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

export default {
    components: {
        Tooltip,
        SvgIcon,
        Btn,
    },
    props: {
        contents: {
            type: String,
            required: false,
            default: '',
        },
        activity: {
            type: Boolean,
            required: false,
            default: true,
        },
        iconTop: {
            type: Number,
            required: false,
            default: 109,
        },
    },
    data() {
        return {
            i18n: {
                refresh: i18n.get('ui.label.refresh'),
                hideContents: i18n.get('ui.label.toc.hide'),
                showContents: i18n.get('ui.label.toc.show'),
                contents: i18n.get('ui.label.toc'),
            },
            iconTypes: {
                close: ICON_TYPE.close,
                refresh: ICON_TYPE.refresh,
                list: ICON_TYPE.document,
            },
            iconSize: 16,
            items: [],
            visibility: 'block',
        };
    },
    watch: {
        contents(newVal, oldVal) {
            if (newVal.length == oldVal.length) return;

            this.items = [];
            $.each(
                $(`<div>${newVal}</div>`).find('h1, h2, h3, h4'),
                (i, elem) => {
                    const text = $(elem).text();

                    // 템플릿에서 에디터 코드가 스토어에 저장될 때, 차트/테이블은 uniqueId로 변경되서 저장되기 때문에 예외처리가 필요함.
                    if (
                        text != '' &&
                        !text.startsWith('#jui') &&
                        !text.endsWith('#')
                    ) {
                        this.items.push({
                            text: text,
                            type: $(elem).prop('tagName'),
                        });
                    }
                }
            );
        },
    },
    methods: {
        syncContents() {
            this.$emit('sync-contents');
        },
        toggleContents() {
            this.$emit('toggle-contents');
        },
        searchContents(type, text) {
            this.$emit('search-contents', { type: type, text: text });
        },
    },
};
</script>
<style lang="scss" scoped>
@import '../themes.scss';

.table-of-contents {
    @include themify($themes) {
        position: absolute;
        top: 57px;
        right: 0px;
        width: 280px;
        height: calc(100% - 105px);
        padding: 24px;
        border-left: 1px solid themed('common-border-color');
        background-color: themed('common-background-color');

        > .top {
            position: relative;
            > .subject {
                font-size: 16px;
                font-weight: 500;
                padding-bottom: 16px;
                color: themed('common-font-color');
                border-bottom: 1px solid themed('common-border-color');
            }
            > .tools {
                position: absolute;
                top: -10px;
                right: 0px;
            }
        }

        > .bottom {
            margin-top: 16px;
            > ul {
                list-style: none;
                padding-left: 0px;
                > li {
                    margin-bottom: 6px;
                    > a {
                        color: themed('common-font-color');
                        cursor: pointer;
                    }
                    > a[type='H1'] {
                        font-weight: bold;
                        font-size: 14px;
                    }
                    > a[type='H2'] {
                        margin-left: 10px;
                        font-weight: bold;
                        font-size: 12px;
                    }
                    > a[type='H3'] {
                        margin-left: 15px;
                        font-size: 11px;
                    }
                    > a[type='H4'] {
                        margin-left: 20px;
                        font-size: 10px;
                    }
                }
            }
        }
    }
}

.layered-btn {
    @include themify($themes) {
        position: absolute;
        cursor: pointer;
        right: 24px;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid themed('common-border-color');
        background-color: themed('layered-btn-background-color');
        color: themed('layered-btn-icon-color');
    }
}
</style>
