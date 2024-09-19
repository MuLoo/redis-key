import React from 'react';
import { Flex, Divider, List, Tag, Typography, Space } from 'antd';
import TextCopy from '../TextCopy';

const loginInfoArr = [
  <Space key="1">
    <Tag color="blue">登录Redis集群</Tag>
    <TextCopy text="redis-cli -c -h rds-yupoo.service.upyun" />
  </Space>,
  <Space key="2">
    <Tag color="geekblue">登录Master节点</Tag>
    <TextCopy text="redis-cli -h 192.168.5.30 -p 6379" />
  </Space>,
  <Space key="3">
    <Tag color="geekblue">登录Master节点</Tag>
    <TextCopy text="redis-cli -h 192.168.5.38 -p 6379" />
  </Space>,
  <Space key="4">
    <Tag color="geekblue">登录Master节点</Tag>
    <TextCopy text="redis-cli -h 192.168.5.9 -p 6379" />
  </Space>,
  <Space key="5">
    <Tag color="geekblue">登录Master节点</Tag>
    <TextCopy text="redis-cli -h 192.168.5.11 -p 6379" />
  </Space>,
  <Space key="6">
    <Tag color="geekblue">登录Master节点</Tag>
    <TextCopy text="redis-cli -h 192.168.5.29 -p 6379" />
  </Space>,
];

const tipsArr = [
  <Space key="1">
    <Tag color="purple">查看集群状态</Tag>
    <TextCopy text="CLUSTER INFO" />
  </Space>,
  <Space key="2">
    <Tag color="purple">查看redis状态</Tag>
    <TextCopy text="INFO" />
  </Space>,
  <Space key="3">
    <Tag color="purple">查看集群节点</Tag>
    <TextCopy text="CLUSTER NODES" />
  </Space>,
  <Space key="4">
    <Tag color="purple">连接的客户端</Tag>
    <TextCopy text="CLIENT LIST" />
  </Space>,
  <Space key="5">
    <Tag color="purple">获取redis配置</Tag>
    <TextCopy text="CONFIG GET *" />
  </Space>,
  <Space key="6">
    <Tag color="purple">查看满足pattern的key</Tag>
    <Tag color="red">谨慎操作</Tag>
    <TextCopy text="KEYS impress_pagecache_hash:289037:*" />
  </Space>,
  <Space key="7">
    <Tag color="purple">查看key生存周期</Tag>
    <TextCopy text="TTL KEY" />
  </Space>,
  <Space key="8">
    <Tag color="purple">查看key类型</Tag>
    <TextCopy text="TYPE KEY" />
  </Space>,
  <Space key="9">
    <Tag color="purple">持久化key</Tag>
    <TextCopy text="PERSIST KEY" />
  </Space>,
  <Space key="10">
    <Tag color="purple">删除key</Tag>
    <TextCopy text="DEL KEY" />
  </Space>,
];

const Tools = () => {
  return (
    <Flex vertical>
      <Divider orientation="left">登录Redis服务器</Divider>
      <List
        header={<div>登录Redis</div>}
        footer={
          <Typography.Text type="secondary">
            Redis集群5主5从，详情访问{' '}
            <Typography.Link href="https://yp-octopus.s.upyun.com/" target="_blank">
              Octous
            </Typography.Link>
          </Typography.Text>
        }
        bordered
        dataSource={loginInfoArr}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
      <Divider orientation="left" style={{ marginTop: 30 }}>
        常用命令
      </Divider>
      <List
        header={<div>查看信息</div>}
        footer={<Typography.Text type="secondary">Redis常用命令</Typography.Text>}
        bordered
        dataSource={tipsArr}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </Flex>
  );
};

export default Tools;
