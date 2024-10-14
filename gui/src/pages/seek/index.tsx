
import React, { useState } from 'react';
import { SnippetsOutlined, FileSearchOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: 'job search',
    key: 'search',
    icon: <FileSearchOutlined />,
  },
  {
    label: 'job list',
    key: 'jobs',
    icon: <SnippetsOutlined />,
  },
];

const App: React.FC = () => {
  const [current, setCurrent] = useState('search');
  const navigate = useNavigate();

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    navigate('/seek/' + e.key);
  };

  return <div className='h-full flex flex-col'>
    <div className=''>
      <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
    </div>
    <div className='pt-5 pb-5 flex-1 overflow-auto'>
      <Outlet />
    </div>
  </div>
};

export default App;
