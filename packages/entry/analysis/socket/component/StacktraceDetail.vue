<template>
    <div class="stacetrace-detail-wrapper" :style="cssValues">
        <pre v-html="content" class="stacetrace-detail-content"></pre>
        <div class="stacetrace-detail-footer">
            <btn normal
                :items="[{ text: i18n.receiveAgain }]"
                 @click="$emit('receive-again')" />
        </div>
    </div>
</template>

<script>
import Btn from "@vuejs/component/button/Btn";
export default {
    name: "StacktraceDetail",
    inject: {
        theme: {
            default: 'classic',
        },
        i18n: {
            default: () =>  ({
                receiveAgain: 'receiveAgain',
            }),
        },
    },
    props: {
        content: {
            type: String,
            default: '',
        },
        height: Number,
    },
    components: {
        Btn,
    },
    computed: {
        cssValues() {
            const contentHeight = !!this.height ? this.height + 'px' : '100%';
            return {
                '--content-height': contentHeight,
            };
        }
    },
}
</script>

<style lang="scss" scoped>
@import "~@common/scss/themes.scss";
$themes: (
    classic: (
        border-color: #e8e8e8,
    ),
    dark: (
        border-color: #4e4e4e,
    ),
);
.stacetrace-detail-wrapper {
    height: var(--content-height);
    display: flex;
    flex-direction: column;
    @include themify($themes) {
        // TODO: 오버플로우 처리
        .stacetrace-detail-content {
            flex: 1;
            height: 100%;
            overflow: auto;
            font-size: 12px;
            line-height: 1.5;
        }
        .stacetrace-detail-footer {
            padding-top: 16px;
            display: flex;
            justify-content: flex-end;
            border-top: 1px solid themed('border-color');
        }
    }
}
</style>