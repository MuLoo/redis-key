import React from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Outlet, Link } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const items = [
  {
    key: '1',
    label: <Link to="/">生成KEY</Link>,
  },
  {
    key: '2',
    label: <Link to="/tool">常用命令</Link>,
  },
];
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
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(8px)',
          boxShadow: 'rgb(244 244 244 / 97%) 2px 2px 14px 8px',
        }}
      >
        <div className="demo-logo">Redis-Key-Generator</div>
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={items}
          style={{
            flex: 1,
            minWidth: 0,
            background: 'transparent',
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
            // minHeight: 380,
            minHeight: 'calc(100vh - 162px)',
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
