<template>
    <div class="agent-help-wrapper">
        <div class="loading" v-if="progress < 1">
            <div class="layer">
                <circle-loading :percent="progress * 100"> </circle-loading>
            </div>
        </div>
        <div v-else>
            <div class="popup-header">
                <div class="header-text">{{ messages.agentHelp }}</div>
                <search
                    v-model="searchText"
                    class="search"
                    @search="onApplySearch"
                    @clear="onCancelSearch"
                    style="width: 200px;"
                    small
                >
                </search>
            </div>
            <div class="popup-body">
                <div class="left">
                    <tab
                        :tabs="tabs"
                        :active-tab="currentTab"
                        @change="onChangeTab"
                    >
                    </tab>
                    <div v-if="currentTab === 'index'" class="dictionary">
                        <div class="index-group" v-for="c in indexKeys">
                            <div class="index">{{ c }}</div>
                            <ul>
                                <li
                                    v-for="(item, i) in filteredIndexData[c]"
                                    :title="item.name"
                                    :key="i"
                                    :class="[
                                        'index-item',
                                        {
                                            active:
                                                !!currentItem &&
                                                currentItem.name === item.name,
                                        },
                                    ]"
                                    @click="onClickIndexRow(item)"
                                >
                                    {{ item.name }}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <tree-selector
                        v-else
                        class="tree-group"
                        ref="tree-selector"
                        :tree="renamedGroupData"
                        :width="266"
                        :height="scrollHeight"
                        @change="onClickTreeRow"
                    >
                    </tree-selector>
                </div>
                <div class="content">
                    <help-navigation
                        v-if="
                            currentTab === 'group' &&
                                !!currentItem &&
                                !!currentItem.key
                        "
                        :path="pathFromRoot"
                        @update-tree="onUpdateTree"
                    >
                    </help-navigation>
                    <help-content
                        :content="contentsArray"
                        :editable="currentTab === 'index'"
                    >
                    </help-content>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Tab from '@vuejs/component/tab/Tab';
import Search from '@vuejs/component/Input/Search';
import TreeSelector from '@vuejs/component/TreeSelector/TreeSelector';
import HelpContent from '@entry/popup/agentHelp/HelpContent';
import HelpNavigation from '@entry/popup/agentHelp/HelpNavigation';
import CircleLoading from '@entry/popup/xviewAnalysis/component/CircleLoading';
import {
    mapActions,
    mapGetters,
    mapMutations,
    mapState,
} from '@entry/popup/agentHelp/vuex';
import { i18n } from '@common/utility';
import _ from '@library/lodash';

export default {
    name: 'App',
    components: {
        Tab,
        Search,
        TreeSelector,
        HelpContent,
        HelpNavigation,
        CircleLoading,
    },
    props: {
        paramKey: {
            type: String,
            required: true,
        },
        paramType: {
            type: String,
            required: true,
        },
    },
    computed: {
        ...mapState({
            key: ({ params }) => params.key,
            currentTab: state => state.currentTab,
            currentItem: state => state.currentItem,
            search: state => state.search,
            progress: state => state.progress,
        }),
        ...mapGetters([
            'filteredIndexData',
            'renamedGroupData',
            'contentsArray',
            'pathFromRoot',
        ]),
    },
    data() {
        return {
            searchText: '',
            messages: {
                agentHelp: i18n.get('ui.title.agentHelp'),
            },
            tabs: [
                { key: 'index', value: i18n.get('ui.label.index') },
                { key: 'group', value: i18n.get('ui.label.group') },
            ],
            indexKeys: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',

            // 탭이 그룹일 때, 트리 셀렉터 높이 관련 변수들
            scrollHeight: 612,
            resizeHandler: null,
        };
    },
    methods: {
        ...mapMutations([
            'updateParams',
            'updateCurrentTab',
            'updateCurrentItem',
            'updateSearchText',
            'updateProgress',
        ]),
        ...mapActions(['onChangeTab', 'loadIndex', 'loadGroup']),
        onClickIndexRow(row) {
            this.updateCurrentItem({ ...row, key: '' });
        },
        onClickTreeRow(row) {
            const target = row[0];
            this.updateCurrentItem({
                name: target.label,
                text: target.text,
                key: target.key,
            });
        },
        onApplySearch() {
            this.updateCurrentTab('index');
            this.updateSearchText(this.searchText);
        },
        onCancelSearch() {
            this.updateSearchText('');
        },
        onUpdateTree(item) {
            this.$refs['tree-selector'].onClickNodeLabel([item.key, true]);
        },
        resizeScrollHeight() {
            this.scrollHeight = window.innerHeight - 110;
        },
    },
    created() {
        this.updateParams({
            type: this.paramType,
            key: this.paramKey,
        });

        this.resizeHandler = _.throttle(this.resizeScrollHeight, 100);
        this.resizeHandler();
    },
    async mounted() {
        this.updateProgress(0);
        await this.loadIndex();
        await this.loadGroup();
        this.updateProgress(1);
        if (!!this.key) {
            this.updateCurrentTab('index');
            for (let key of Object.keys(this.filteredIndexData)) {
                const candidates = this.filteredIndexData[key];
                if (!candidates) continue;

                const target = candidates.findIndex(e => e.name === this.key);
                if (target !== -1) {
                    this.onClickIndexRow(candidates[target]);
                    break;
                }
            }
            this.updateSearchText(this.key);
            this.searchText = this.key;

            // 선택된 key가 세로 가운데 오도록 스크롤 처리
            this.$nextTick(() => {
                const targetEl = document.getElementsByClassName(
                    'index-item active'
                );
                if (targetEl.length > 0) {
                    const scrollOptions = {
                        block: 'center',
                        behavior: 'smooth',
                    };
                    targetEl.item(0).scrollIntoView(scrollOptions);
                }
            });
        }

        window.addEventListener('resize', this.resizeHandler);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeHandler);
    },
};
</script>

<style scoped></style>
