<script>
import Radio from '@vuejs/component/toggle/Radio';
import Checkbox from '@vuejs/component/toggle/Checkbox';
import ToggleSwitch from '@vuejs/component/toggle/ToggleSwitch';

const components = {
    radio: Radio,
    checkbox: Checkbox,
    switch: ToggleSwitch,
};

export default {
    name: 'OptionGroup',
    props: {
        type: {
            type: String,
            default: 'radio',
            validator(t) {
                return ['radio', 'checkbox', 'switch'].indexOf(t) !== -1;
            },
        },
        options: {
            type: Array,
            required: true,
            validator(options) {
                return options.every(opt => 'value' in opt && 'label' in opt);
            },
        },
        active: {
            // array of options.value
            type: Array,
            required: true,
        },
        noSelect: {
            // works if radio type
            type: Boolean,
            default: false,
        },
        inline: {
            type: Boolean,
            default: false,
        },
        normal: Boolean,
        large: Boolean,
    },
    watch: {
        active(next) {
            this.actives = next;
        },
    },
    data() {
        return {
            actives: this.active,
        };
    },
    computed: {
        component() {
            return components[this.type];
        },
        classes() {
            return `option-group-wrapper ${this.size} ${
                this.inline ? 'inline' : ''
            }`;
        },
        size() {
            return this.large ? 'large' : 'normal';
        },
        isMultiSelect() {
            return !(this.type === 'radio');
        },
    },
    methods: {
        isActive({ value }) {
            return this.actives.indexOf(value) !== -1;
        },
        onChange({ value }) {
            if (!this.isMultiSelect) {
                if (this.noSelect && this.isActive({ value }))
                    this.actives = [];
                else this.actives = [value];
            } else {
                if (this.isActive({ value }))
                    this.actives = this.actives.filter(e => e !== value);
                else this.actives.push(value);
            }
            this.$emit('change', this.actives);
        },
    },
    render(h) {
        return h(
            'div',
            {
                class: this.classes,
            },
            this.options.map(opt =>
                h(this.component, {
                    props: {
                        active: this.isActive(opt),
                        value: opt.value,
                        label: opt.label,
                        disabled: opt.disabled,
                        normal: this.normal,
                        large: this.large,
                        color: opt.color,
                    },
                    on: {
                        change: _ => this.onChange(opt),
                    },
                })
            )
        );
    },
};
</script>
<style lang="scss" scoped>
.option-group-wrapper {
    display: inline-flex;
    justify-content: space-between;
    &.inline {
        > *:not(:last-child) {
            margin-right: 18px;
        }
    }
    &:not(.inline) {
        flex-flow: column nowrap;
    }
    .aries-checkbox-wrapper,
    .aries-radio-wrapper,
    .aries-switch-wrapper {
        line-height: 2.5;
    }
}
</style>
