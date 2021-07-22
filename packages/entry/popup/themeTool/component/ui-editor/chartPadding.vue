<template>
    <section class="chart-padding">
        <div class="subject">{{ i18n.chartPadding }}</div>
        <div class="widgets">
            <div class="widget">
                <ul>
                    <li>
                        <span>Top</span>
                        <dropdown
                            :items="paddingItems"
                            :selected-value="theme['padding.top']"
                            @onchange="
                                item =>
                                    onChangeSetting('padding.top', item.value)
                            "
                        ></dropdown>
                    </li>
                    <li>
                        <span>Bottom</span>
                        <dropdown
                            :items="paddingItems"
                            :selected-value="theme['padding.bottom']"
                            @onchange="
                                item =>
                                    onChangeSetting(
                                        'padding.bottom',
                                        item.value
                                    )
                            "
                        ></dropdown>
                    </li>
                    <li>
                        <span>Left</span>
                        <dropdown
                            :items="paddingItems"
                            :selected-value="theme['padding.left']"
                            @onchange="
                                item =>
                                    onChangeSetting('padding.left', item.value)
                            "
                        ></dropdown>
                    </li>
                    <li>
                        <span>Right</span>
                        <dropdown
                            :items="paddingItems"
                            :selected-value="theme['padding.right']"
                            @onchange="
                                item =>
                                    onChangeSetting('padding.right', item.value)
                            "
                        ></dropdown>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>

<script>
import { mapState } from '../../constant';
import methods from '../mixin/methodsForSection';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';

export default {
    mixins: [methods],
    components: {
        Dropdown,
    },
    inject: {
        i18n: {
            default: {
                chartPadding: 'Chart Padding',
            },
        },
    },
    data() {
        return {
            paddingItems: [...Array(31)].map((v, i) => ({
                text: `${i * 10}`,
                value: i * 10,
            })),
        };
    },
    computed: {
        ...mapState({
            theme: state => {
                if (!state.editorCode) {
                    return {
                        'padding.top': 50,
                        'padding.bottom': 40,
                        'padding.left': 60,
                        'padding.right': 240,
                    };
                }

                return JSON.parse(state.editorCode);
            },
        }),
    },
};
</script>

<style lang="scss" scoped>
.chart-padding {
    ul {
        display: flex;
        flex-wrap: wrap;
        padding: 0px;
        margin: 0px;
        list-style: none;
        height: 70px;

        > li {
            flex: 1 1 50%;
            > span {
                padding-left: 10px;
                line-height: 28px;
            }
            > div {
                float: right;
            }
        }
    }

    ::v-deep .aries-ui-dropdown {
        width: 80px !important;
    }
}
</style>
