import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { Layout } from 'antd';
import MMenu from '../../components/Menu'

import styles from './index.less';

const { Sider, Content } = Layout;

interface ILayoutProps {
  children: any;
}


const MainLayout: React.FC<ILayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const onCollapsed = () => {
    setCollapsed(!collapsed);
  }

  return (
    <Layout className={styles.layout}>
      <Sider
        // collapsed={collapsed}
        width={240}
        theme='light'
        className='sider'
        onClick={onCollapsed}
      >
        <MMenu />
      </Sider>
      <Layout className={styles.layoutContent}>
        <Content className={styles.content}>
          {children}
        </Content>
      </Layout>
    </Layout >
  );
};

export default withRouter(MainLayout as any);
