<template>
    <div class="app">
        <popup-title :title="i18n.dbplan" :link="'popup_dbplan'"></popup-title>

        <div class="main">
            <div class="left">
                <origin>
                    <slot></slot>
                </origin>
            </div>
            <div
                class="resizer"
                :style="{ left: `${originWidth - 2}px` }"
                @mousedown="onStartResizing"
            ></div>
            <div class="right">
                <result :width="resultWidth"></result>
            </div>
        </div>
    </div>
</template>

<script>
import _ from '@library/lodash';
import PopupTitle from '@entry/popup/activeService/component/PopupTitle';
import Origin from './container/Origin';
import Result from './container/Result';
import { mapState, mapMutations, mapActions } from './vuex';

export default {
    inject: ['i18n'],
    components: {
        PopupTitle,
        Origin,
        Result,
    },
    props: {
        domainId: {
            type: Number,
            required: true,
        },
        dataKey: {
            type: Number,
            required: true,
        },
        startTime: {
            type: Number,
            required: true,
        },
        endTime: {
            type: Number,
            required: true,
        },
        useDbPlan: {
            type: Boolean,
            required: true,
        },
        inlineParameters: {
            type: Array,
            required: true,
        },
        boundParameters: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            resizeHandler: null,
            originWidth: 616,
            resultWidth: 616,
        };
    },
    computed: {
        ...mapState({
            mainWidth: state => state.mainWidth,
        }),
    },
    methods: {
        ...mapMutations(['loadParameters', 'calculateMainSize']),
        ...mapActions(['loadDatabaseSettings']),
        onStartResizing(e) {
            const splitter = this.$el;
            const startWidth = this.originWidth;
            const startLeft = e.x;

            const moveHandler = e2 => {
                const dist = e2.x - startLeft;
                const nextWidth = startWidth + dist;

                // 결과 영역은 무조건 늘리기만 가능하다.
                if (nextWidth < this.mainWidth / 2) {
                    this.originWidth = nextWidth;
                    this.resultWidth = this.mainWidth - nextWidth;
                }
                e2.preventDefault();
            };

            splitter.addEventListener('mousemove', moveHandler);
            splitter.addEventListener('mouseup', () =>
                splitter.removeEventListener('mousemove', moveHandler)
            );
        },
    },
    created() {
        this.loadParameters(this.$props);
        this.loadDatabaseSettings();
        this.resizeHandler = _.throttle(() => {
            this.calculateMainSize();
            this.originWidth = this.resultWidth = this.mainWidth / 2;
        }, 100);
        this.resizeHandler();
    },
    beforeMount() {
        window.addEventListener('resize', this.resizeHandler);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeHandler);
    },
};
</script>

<style lang="scss" scoped>
@import './themes.scss';

.app {
    @include themify($themes) {
        --subject-height: 95px;
        height: inherit;
        padding: 18px 24px;

        > .subject {
            height: var(--subject-height);
        }

        > .main {
            position: relative;
            display: flex;
            height: calc(100% - var(--subject-height));
            border-radius: 4px;
            border: 1px solid themed('main-border-color');

            > .left,
            > .right {
                flex: 1;
            }
            > .left {
                border-right: 1px solid themed('main-border-color');
            }

            > .resizer {
                position: absolute;
                z-index: 1;
                cursor: col-resize;
                width: 3px;
                height: 100%;
            }
        }
    }
}
</style>
