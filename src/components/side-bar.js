import MenuLayer from '@layout/component/layer/MenuLayer';
import AlarmLayer from '@layout/component/layer/AlarmLayer';
import SideBarItem from '@layout/component/item/SideBarItem';
import styled from 'vue-styled-components';

import { menus, alarms } from '../sample-data';

const SideBarWrapper = styled.div`
    width: 72px;
    height: 100vh;
    z-index: 1;
    box-sizing: border-box;
    padding: 23px 12px;
    background-color: #000000;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`;

export default {
    name: 'SideBar',
    components: {
        MenuLayer,
        AlarmLayer,
        SideBarItem,
        SideBarWrapper,
    },
    data() {
        return {
            showMenu: false,
            showAlarm: false,
        }
    },
    methods: {
        onClickMenuItem(key) {
            if (key === 'alarm')
                this.showAlarm = !this.showAlarm;
            else if (key === 'dashboard')
                this.showMenu = !this.showMenu;
            else {
                this.showMenu = false;
                this.showAlarm = false;
            }
        }
    },
    render() {
        return (
            <SideBarWrapper>
                <SideBarItem menuName={{ key: 'dashboard', displayName: '대시보드' }}
                            onClick={this.onClickMenuItem} />
                <SideBarItem menuName={{ key: 'alarm', displayName: '알람' }}
                            onClick={this.onClickMenuItem} />
                {this.showAlarm
                    && <AlarmLayer newList={alarms}
                                onClose={() => this.showAlarm = false} />}
                {this.showMenu
                    && <MenuLayer list={menus}
                                title={"Dashboard"}
                                onMouseleave={() => this.showMenu = false} />}

            </SideBarWrapper>
        );
    }
}
