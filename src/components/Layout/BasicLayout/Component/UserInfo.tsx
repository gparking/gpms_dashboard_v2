import React from 'react';
import { Menu, Dropdown, Modal } from 'antd';
import { inject, observer } from 'mobx-react';
import UserStore from '@store/userStore';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
const confirm = Modal.confirm;
import { useHistory } from 'react-router-dom';
interface InjectedProps {
  userStore: UserStore;
}

const UserInfo: React.FC = (props) => {
  const history = useHistory();

  const {
    userStore: { userInfo, userLogout }
  } = props as InjectedProps;

  const handleLogout = () => {
    confirm({
      maskClosable: true,
      title: 'confirm to logout',
      content: 'user info will reset, system cannot auto-login',
      onOk: () => {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            userLogout();
            history.push('/user/login');
            resolve();
          }, 800);
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {}
    });
  };

  const handleTriggerError = () => {
    history.push('/exception/home');
  };

  const getMenu = () => (
    <Menu>
      <Menu.Item>
        <UserOutlined />
        <span className="RCS-userInfo-menuItem">user info</span>
      </Menu.Item>
      <Menu.Item onClick={handleTriggerError}>
        <SettingOutlined />
        <span className="RCS-userInfo-menuItem">trigger error</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={handleLogout}>
        <LogoutOutlined />
        <span className="RCS-userInfo-menuItem">logout</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="RCS-userInfo">
      <Dropdown overlay={getMenu()} className="RCS-userInfo" placement="bottomRight">
        <div className="RCS-userInfo-dropdown">
          <UserOutlined className="RCS-userInfo-icon" />
          <span className="RCS-userInfo-userName">{userInfo.name}</span>
        </div>
      </Dropdown>
    </div>
  );
};

export default inject('userStore')(observer(UserInfo));