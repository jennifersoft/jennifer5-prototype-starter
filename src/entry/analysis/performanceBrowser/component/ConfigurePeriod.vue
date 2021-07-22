<template>
    <div class="configure-period">
        <navigation-item :label="i18n.periodConfig">
            <dropdown
                :items="periodList"
                :selected-value="periodDays"
                @onchange="changeHandler"
            />
        </navigation-item>
    </div>
</template>

<script>
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import NavigationItem from '@vuejs/component/NavigationBar/NavigationItem';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    name: 'ConfigurePeriod',
    inject: ['i18n'],
    components: { Dropdown, NavigationItem },

    data() {
        return {
            periodList: Array.from(new Array(7).keys()).map(key => {
                const num = key + 1;

                return {
                    text: `${num}${this.i18n.unitDay}`,
                    value: num,
                };
            }),
        };
    },
    methods: {
        ...mapActions('performancebrowser', ['changePeriodDays']),
        changeHandler({ value }) {
            this.changePeriodDays(value);
        },
    },
    computed: {
        ...mapState('performancebrowser', {
            periodDays: ({ selected }) => selected.periodDays,
        }),
    },
    mounted() {},
};
</script>
<style lang="scss" scoped>
.configure-period {
    .navigation-item {
        display: flex;
        flex-direction: row;
        width: 100%;
        ::v-deep {
            .navigation-item-label {
                padding: 0 20px;
            }
            .aries-ui-dropdown {
                flex: 1 1 100px;
                .row-list {
                    z-index: 1001;
                }
            }
        }
    }
}
</style>
