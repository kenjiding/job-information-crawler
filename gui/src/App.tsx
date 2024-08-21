import React, { useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SlackSquareOutlined,
  LinkedinOutlined,
} from '@ant-design/icons';
import Papa from 'papaparse';
import { useRoutes, useNavigate } from 'react-router-dom';
import appRoutes from './router/configs';

import { Button, Col, Layout, Menu, Row, theme } from 'antd';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const routes = useRoutes(appRoutes);
  const navigate = useNavigate();

  useEffect(() => {
    Papa.parse('seek.csv', {
      header: true,
      delimiter: ',',
      skipEmptyLines: true,
      complete: (results) => {
        console.log('results: ', results);
      },
      error: (error: Error) => {
        console.error("Error while parsing:", error);
      },
    });
  }, []);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleClick = (e: {key: string}) => {
    console.log('e: ', e);
    let key = e.key;
    if(key ==='seek') {
      key = `/${key}/search`
    }
    navigate(key);
  }

  return (
    <Layout className='h-full'>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="">
          <p className='text-xl font-bold text-white text-center p-3'>job crawler</p>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          onClick={handleClick}
          defaultSelectedKeys={['linkedin']}
          items={[
            {
              key: 'linkedin',
              icon: <LinkedinOutlined />,
              label: 'linkedin',
            },
            {
              key: 'seek',
              icon: <SlackSquareOutlined />,
              label: 'seek',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Row>
            <Col span={2}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
            </Col>
            <Col span={22} style={{ textAlign: 'center' }}>
              <span className='text-xl'>job crawler</span>
            </Col>
          </Row>
        </Header>
        <Content
          style={{
            margin: '15px 16px',
            padding: '10px 20px',
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {routes}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;