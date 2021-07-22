<template>
    <div
        class="help-wrapper"
        @keydown.shift="onKeydown"
        @keyup="onKeyup"
        @dblclick="onDblClick"
        tabindex="0"
    >
        <textarea
            v-if="editable && editing"
            class="editor"
            v-model="editingText"
            placeholder="placeholder"
        />
        <section
            v-else
            v-for="(c, i) in editedContent"
            class="help-session"
            :key="i"
        >
            <div class="title">
                {{ c.name }}
            </div>
            <div
                class="markdown-wrapper"
                v-html="convertMarkdownToHtml(c.text)"
            ></div>
        </section>
    </div>
</template>

<script>
import { markdown } from './markdown';

export default {
    name: 'HelpContent',
    props: {
        content: {
            type: Array,
            default: () => [],
        },
        editable: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        content: {
            handler(next, prev) {
                if (next !== prev) this.editing = false;
                if (next.length === 1) this.editingText = next[0].text;
            },
            deep: true,
        },
    },
    computed: {
        editedContent() {
            if (!this.editable) return this.content;
            else return [{ ...this.content[0], text: this.editingText }];
        },
    },
    data() {
        return {
            readyForToggle: false,
            editing: false,
            editingText: this.content[0]?.text,
        };
    },
    methods: {
        convertMarkdownToHtml(text) {
            if (text.includes('<title>') && text.includes('</title>'))
                return text;
            return markdown.toHTML(text);
        },
        onKeydown() {
            this.readyForToggle = true;
        },
        onKeyup() {
            this.readyForToggle = false;
        },
        onDblClick() {
            if (!this.editable || !this.readyForToggle) return;
            this.editing = !this.editing;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
.help-wrapper {
    @include themify($themes) {
        overflow-x: hidden;
        box-sizing: border-box;
        text-overflow: ellipsis;
        word-break: break-all;
        outline: none;
        padding: 16px 24px;
        .editor {
            height: 550px;
            width: 99%;
        }
        .help-session {
            margin-bottom: 40px;

            .title {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 16px;
            }

            ::v-deep .markdown-wrapper {
                pre {
                    border: 1px solid themed('border-color');
                    background-color: themed('snippet-background-color');
                    padding: 10px;
                    border-radius: 5px;
                    overflow-x: auto;
                }
                ul,
                li,
                hr {
                    color: themed('typography-color-grey1');
                }
            }
        }
    }
}
</style>
