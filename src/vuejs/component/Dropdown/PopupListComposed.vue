<script>
import SizeMixin from "@vuejs/mixin/SizeMixin";

export default {
    name: 'PopupListComposed',
    mixins: [SizeMixin],
    provide() {
        return { injectedSize: this.size };
    },
    props: {
        offsetX: {
            type: Number,
            default: undefined,
        },
        offsetY: {
            type: Number,
            default: undefined,
        },
    },
    computed: {
        size() {
            // small by default
            return this.normal ? 'normal' : this.large ? 'large' : 'small';
        },
    },
    render(h) {
        return h(
            'div',
            {
                class: 'popup-list-group',
                style: {
                    top:
                        this.offsetY !== undefined
                            ? this.offsetY + 'px'
                            : undefined,
                    left:
                        this.offsetX !== undefined
                            ? this.offsetX + 'px'
                            : undefined,
                },
            },
            this.$slots.default.map(vNode => {
                if (vNode.componentOptions) {
                    vNode.componentOptions.propsData.inline = true;
                    vNode.componentOptions.propsData.noScroll = true;
                }
                return vNode;
            })
        );
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
.popup-list-group {
    @include themify($themes) {
        position: absolute;
        z-index: 10;
        background-color: themed('dropdown-list-background-color');
        border: 1px solid themed('border-color');
        box-shadow: 0 2px 3px 0 themed('dropdown-shadow-color');
        border-radius: 3px;
        .row-list {
            /*width: 100%;*/
            border: none;
            border-radius: 0;
            &:last-child {
                border-radius: 0 0 3px 3px;
            }
            &:not(:first-child) {
                border-top: 1px solid themed('tab-border-bottom-color');
            }
            .row {
                padding-right: var(--wrapper-padding-right);
            }
        }
        &.left {
            left: 0;
        }
        &.right {
            right: 0;
        }
    }
    /*&.simple {*/
    /*    .row-list:first-child {*/
    /*        border-radius: 3px 3px 0 0;*/
    /*    }*/
    /*}*/
}
</style>
