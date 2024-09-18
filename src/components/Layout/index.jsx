import React from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Outlet, Link } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const items = [{
  key: '1',
  label: <Link to='/'>生成KEY</Link>,
}, {
  key: '2',
  label: <Link to='/tool'>常用命令</Link>,
}];
const LayoutTemplate = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="demo-logo" >Redis-Key</div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={items}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
      </Header>
      <Content
        style={{
          padding: '0 48px',
        }}
      >
        <Breadcrumb
          style={{
            margin: '16px 0',
          }}
        >
          {/* <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item> */}
        </Breadcrumb>
        <div
          style={{
            padding: 24,
            minHeight: 380,
            height: 'calc(100vh - 162px)',
            overflow: 'scroll',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </div>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
        Yupoo ©{new Date().getFullYear()} Created by LQM
      </Footer>
    </Layout>
  );
};
export default LayoutTemplate;