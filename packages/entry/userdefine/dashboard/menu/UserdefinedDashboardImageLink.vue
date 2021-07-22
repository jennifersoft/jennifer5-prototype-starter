<template>
    <div class="userdefined-dashboard-image-link" @click="link()">
        <img :src="imgSrc" :alt="title" />
        <div class="contents">
            <div class="group-id">
                {{ groupId }}
            </div>
            <div class="title" v-html="title"></div>
            <div class="time-n-interaction">
                <div class="date">{{ noneOrDate }}</div>
                <div @click.stop>
                    <dropdown
                        normal
                        @onchange="clickEditOrDelete"
                        :selected-value="-1"
                        :button-options="{
                            size: 'small',
                            iconType: moreIcon,
                            position: 'top-left',
                        }"
                        :items="menuData"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { serverDateFormat } from '@common/base';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

export default {
    name: 'UserdefinedDashboardImageLink',
    components: {
        Dropdown,
    },
    inject: {
        i18n: {
            edit: {
                default: 'edit',
            },
            delete: {
                default: 'delete',
            },
        },
    },
    props: {
        imgSrc: {
            type: String,
            required: true,
        },
        dashboardKey: {
            type: String,
            required: true,
        },
        groupId: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        lastUpdatedTime: {
            type: Number,
            required: false,
        },
    },
    data() {
        return {
            menuData: [
                { value: 'edit', text: this.i18n.edit },
                { value: 'delete', text: this.i18n.delete },
            ],
        };
    },
    methods: {
        link() {
            document.location =
                '/userdefine/dashboard?key=' + this.dashboardKey;
        },
        clickEditOrDelete(item) {
            if (item.value === 'edit')
                document.location =
                    '/userdefine/dashboardEdit?key=' + this.dashboardKey;
            else if (item.value === 'delete') {
                const { left, top } = this.$el.getBoundingClientRect();
                this.$emit('delete', {
                    dashboardKey: this.dashboardKey,
                });
            }
        },
    },
    computed: {
        noneOrDate() {
            return this.lastUpdatedTime
                ? getDayjs(this.lastUpdatedTime).format(serverDateFormat.short)
                : '';
        },
    },
    created() {
        this.moreIcon = ICON_TYPE.moreHorizon;
    },
};
</script>
<style lang="scss" scoped>
.userdefined-dashboard-image-link {
    @import './themes.scss';
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 193px;
    height: 253px;
    position: relative;
    border-radius: 5px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    @include themify($themes) {
        background-color: themed(
            'dashboard-menu-layer-thumbnail-userdefined-background'
        );

        &:hover {
            &::before {
                position: absolute;
                content: '';
                height: inherit;
                width: inherit;
                border-radius: inherit;
                background-color: themed(
                    'dashboard-menu-layer-thumbnail-hover-background'
                );
            }
        }
    }

    text-align: center;
    cursor: pointer;

    > img {
        width: 193px;
        height: 117px;
    }

    .time-n-interaction {
        text-align: left;
        @include themify($themes) {
            border-top: 1px solid
                themed('dashboard-menu-layer-tab-title-border-color');
        }
    }

    @import '~@vuejs/component/themes.scss';

    > .contents {
        flex-grow: 1;
        box-sizing: border-box;

        padding: 16px 16px 7px 16px;
        display: flex;
        flex-direction: column;
        > div.group-id {
            text-align: left;
            height: 14px;
            @include themify($themes) {
                color: themed('typography-color-grey2');
            }

            font-size: 11px;
            margin-bottom: 9px;
        }

        > div.title {
            flex-grow: 1;
            text-align: left;
            font-weight: bold;
            font-size: 14px;

            @include themify($themes) {
                color: themed('typography-color-primary');
            }
            margin-bottom: 16px;
        }

        > .time-n-interaction {
            height: 26px;
            padding-top: 7px;

            display: flex;
            flex-direction: row;
            justify-content: space-between;
            font-size: 10px;
            @include themify($themes) {
                color: themed('typography-color-grey2');
            }

            .date {
                line-height: 26px;
            }
        }
    }
}
</style>
