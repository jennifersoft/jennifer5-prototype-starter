<template>
    <div class="search-bar">
        <div class="title">{{ i18n.talk }}</div>
        <div class="search-input">
            <i class="icon-search"></i>
            <input
                type="text"
                :placeholder="i18n.M0615"
                :value="search"
                @keyup.enter.prevent="onSearchTitle"
            />
        </div>

        <div class="tools">
            <btn
                :items="[{ iconType: addIcon }]"
                :tooltip-options="{ message: i18n.newTalk }"
                @click="() => $emit('active-form', null)"
                class="border-none"
                normal
            />

            <div class="separator"></div>

            <tooltip
                :message="i18n.help"
                :position="'bottom-right'"
                :cursor-none="true"
            >
                <btn
                    class="border-none"
                    normal
                    :items="[{ iconType: helpIcon }]"
                    @click="onClickHelpBtn"
                />
            </tooltip>
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import Tooltip from '@vuejs/component/tooltip/Tooltip';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { linkManual } from '@common/utility';
import { mapState, mapActions } from '../constant';

export default {
    components: {
        Btn,
        Tooltip,
    },
    inject: {
        i18n: {
            default: {
                talk: 'TALK',
                newTalk: 'New Talk',
                bookmark: 'Bookmark',
                help: 'Help',
                M0615: 'Please enter your search word.',
            },
        },
    },
    computed: {
        ...mapState({
            search: state => state.search,
        }),
    },
    data() {
        return {
            addIcon: ICON_TYPE.add,
            helpIcon: ICON_TYPE.help,
        };
    },
    methods: {
        ...mapActions({
            searchArticles: 'searchArticles',
            loadArticles: 'loadArticles',
        }),
        onSearchTitle(e) {
            const title = e.target.value;

            if (
                !title.includes('?') &&
                !title.includes('&') &&
                !title.includes('=')
            ) {
                if (title !== '')
                    this.searchArticles({
                        page: 0,
                        key: 'paging',
                        search: title,
                    });
                else this.loadArticles({ page: 0, key: 'paging' });
            }
        },
        onClickHelpBtn() {
            linkManual('report_board');
        },
    },
};
</script>

<style lang="scss" scoped>
.search-bar {
    position: relative;
    padding: 14px 27px 14px 20px;
    text-align: center;

    > .title {
        position: absolute;
        height: 34px;
        line-height: 34px;
        font-size: 20px;
        font-weight: bold;
    }

    > .search-input {
        display: inline-block;
        padding: 7px 12px;
        width: 334px;
        text-align: left;
        border-radius: 2px;

        > input[type='text'] {
            border: 0;
            margin-top: -3px;
            width: 310px;
            font-size: 14px;
            background-color: transparent;
        }
    }

    > .tools {
        position: absolute;
        right: 21px;
        top: 16px;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        > .separator {
            display: inline-block;
            height: 16px;
            vertical-align: middle;
            align-self: center;
            display: inline-flex;
            margin: 0 6px;
        }
    }
}
</style>
