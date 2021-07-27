<template>
    <div class="side-bar">
        <div class="btn-group upper">
            <slot name="upper"></slot>
        </div>
        <div class="btn-group lower">
            <slot name="lower"></slot>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "SideBarWrapper"
    }
</script>

<style lang="scss" scoped>
.side-bar {
    position: sticky;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 10000;
    padding: 20px 20px 24px;
    box-sizing: border-box;
    background-color: #000;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    > .btn-group {
        display: flex;
        flex-direction: column;
        align-items: center;

        > .top-logo {
            margin-bottom: 40px;
            cursor: pointer;
        }

        > *:not(:last-child) {
            margin-bottom: 24px;
        }

        .item-with-badge {
            position: relative;
            > .badge {
                position: absolute;
                right: -8px;
                top: -8px;
            }
        }
    }
}
</style>
