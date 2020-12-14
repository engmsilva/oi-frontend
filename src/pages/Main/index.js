import React from 'react';
import { Layout, Row } from 'antd';
import './styles.css';
import logo from '../../assets/logo.svg';

const { Content, Header } = Layout;

export default function Main(props) {
  const { children } = props;

  return (
    <Layout className="content_layout">
      <Header>
        <Row className="header">
          <img className="logoheader" src={logo} alt="logo"/>
        </Row>
      </Header>
      <Content>
        {children}
      </Content>
    </Layout>
  );
}