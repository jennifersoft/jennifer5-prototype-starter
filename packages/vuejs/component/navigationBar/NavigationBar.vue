<script>
import Btn from '@vuejs/component/button/Btn';
import CircleLoadingBtn from '@vuejs/component/button/CircleLoadingBtn';
import Dropdown from '@vuejs/component/dropdown/Dropdown';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

export default {
    name: 'NavigationBar',
    props: {
        showSearchBtn: {
            type: Boolean,
            default: true,
        },
        disableSearchBtn: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        progress: {
            type: Number,
            default: 1,
        },
        suspendible: {
            type: Boolean,
            default: true,
        },
        types: {
            type: Array,
            default: null,
            validator(types) {
                return types.every(t => !!t.text && !!t.value);
            },
        },
        typeDropdownWidth: {
            type: Number,
            default: 108,
        },
        selectedType: [String, Number],
    },
    components: {
        Btn,
        CircleLoadingBtn,
        Dropdown,
    },
    methods: {
        onClickSearch() {
            if (this.disableSearchBtn) return;

            // ARIES-10031: FormatDateInput.vue에서 외부의 다른 버튼 클릭 시 정상적으로 blur가 발생하지 않아 네비게이션 바에서 일단 처리
            document
                .querySelectorAll('.date-input-wrapper input')
                .forEach(el => {
                    el.blur();
                });
            this.$emit('search');
        },
        onClickStopSearch() {
            this.$emit('stop-search');
        },
        onChangeType(type) {
            this.$emit('update:type', type);
        },
    },
    created() {
        this.searchIcon = ICON_TYPE.search;
    },
    render(createElement) {
        return createElement(
            'div',
            {
                class: 'aries-ui-navigation-bar',
            },
            [
                !!this.types
                    ? createElement(
                          'div',
                          {
                              class: 'navigation-type-btn',
                          },
                          [
                              createElement(Dropdown, {
                                  props: {
                                      items: this.types,
                                      selectedValue:
                                          this.selectedType || undefined,
                                      normal: true,
                                      isSimpleStyle: true,
                                      width: this.typeDropdownWidth,
                                  },
                                  on: {
                                      onchange: this.onChangeType,
                                  },
                              }),
                          ]
                      )
                    : null,
                createElement('div', { class: 'navigation-item-wrapper' }, [
                    this.$slots.default
                        ?.filter(child => child.data !== undefined)
                        .map(child => {
                            if (child.tag.includes('NavigationItem'))
                                return child;
                            return createElement(
                                'div',
                                {
                                    class: 'navigation-item', // wrapping for give class
                                },
                                [child]
                            );
                        }),
                ]),
                !!this.$slots.right
                    ? createElement(
                          'div',
                          { class: 'navigation-item-wrapper right' },
                          [
                              this.$slots.right
                                  .filter(child => child.data !== undefined)
                                  .map(child => {
                                      if (child.tag.includes('NavigationItem'))
                                          return child;
                                      return createElement(
                                          'div',
                                          {
                                              class: 'navigation-item', // wrapping for give class
                                          },
                                          [child]
                                      );
                                  }),
                          ]
                      )
                    : null,
                !this.showSearchBtn
                    ? null
                    : createElement(CircleLoadingBtn, {
                          props: {
                              type: this.loading ? 'loading' : 'progress',
                              loading: this.loading,
                              progress: this.progress,
                              disabled: this.disableSearchBtn,
                              suspendible: this.suspendible,
                          },
                          class: 'navigation-search-btn',
                          on: {
                              search: this.onClickSearch,
                              'stop-search': this.onClickStopSearch,
                          },
                      }),
            ]
        );
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
.aries-ui-navigation-bar {
    @include themify($themes) {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid themed('tab-border-bottom-color');
        border-radius: 4px;
        padding: 0 8px;
        height: 44px;
        display: flex;
        align-items: center;
        .navigation-item-wrapper {
            display: inline-flex;
            justify-content: flex-start;
            align-items: center;
            .navigation-item {
                padding-right: 8px;
                box-sizing: border-box;
                display: inline-flex;
            }

            &:not(.right) {
                flex: 1;

                .navigation-item:not(:first-child) {
                    border-left: 1px solid themed('tab-border-bottom-color');
                    padding-left: 8px;
                }
            }
            &.right {
                .navigation-item:last-child {
                    padding-right: 0;
                }
            }
        }

        .navigation-type-btn {
            height: 100%;
            display: inline-flex;
            align-items: center;
            margin: 0 8px 0 -4px;
            padding-right: 4px;
            border-right: 1px solid themed('tab-border-bottom-color');
        }

        .navigation-search-btn {
            margin: -5px 0 -5px 8px;
        }
    }
}
</style>
