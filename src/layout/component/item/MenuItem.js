import { MenuItemWrapper } from './styled-components';

export default {
    name: 'MenuItem',
    props: {
        active: {
            type: Boolean,
            default: false,
        },
        displayName: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
    },
    computed: {
        activeClass() {
            let className = 'menu-item';
            if (this.active) className += ' active';
            return className;
        },
    },
    methods: {
        onClickMenu() {
            this.$emit('click');
        },
    },
    render() {
        return (
            <MenuItemWrapper
                class={this.activeClass}
                onClick={this.onClickMenu}
            >
                <span class="text">{this.displayName}</span>
                <img
                    class="thumbnail"
                    width={100}
                    height={72}
                    src={this.imageUrl}
                    alt={this.displayName}
                />
            </MenuItemWrapper>
        );
    },
};
