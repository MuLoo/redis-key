import { SearchOutlined, ToolOutlined } from '@ant-design/icons';
import { Divider, Drawer, Flex, FloatButton, Input, message, Space, Tag, Typography } from 'antd';
import { MD5 } from 'crypto-js';
import React, { useRef, useState } from 'react';
import { parseQueryString } from '../../utils/common';
import MainShowItem from '../MainShowItem';
import Tools from '../Tools';
import styles from './index.module.less';

const { Search } = Input;
const { Text } = Typography;
const moduleListInit = [
  'photos',
  'albums',
  'category',
  'category_child',
  'album_cate',
  'album_cate_child',
  'account',
  'preference',
  'template',
  'recycle_photos',
  'statistic',
  'programYupooAlbums',
].map((key) => ({ key, value: '' }));

const GenerateKey = () => {
  const [uid, setUserId] = useState('');
  const [moduleKeyList, setModuleKeyList] = useState([]);
  const [uriKey, setUriKey] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const userIdRef = useRef(null);
  const uriRef = useRef(null);

  const handleEnter = (inputValue) => {
    if (!inputValue || Number.isNaN(Number(inputValue))) {
      setModuleKeyList([]);
      return;
    }
    console.log('userIDRef', userIdRef.current.input);
    userIdRef.current.value = inputValue;
    setUserId(Number(inputValue));
    const list = moduleListInit.map((item) => {
      const { key } = item;
      // impress_pagecache_hash:{userId}:{MD5}
      // MD5: model_registry{model}:{userId}
      const md5 = MD5(`model_registry${key}:${inputValue}`).toString();
      console.log('md5', md5);
      return {
        key,
        value: `impress_pagecache_hash:${inputValue}:${md5}`,
      };
    });
    setModuleKeyList(list);
  };

  const handleEnterUri = () => {
    const userId = userIdRef.current?.input?.value;
    let uri = uriRef.current?.input?.value;

    if (!userId || !uri) {
      message.error('请输入用户ID和Uri');
      return;
    }
    if (Number.isNaN(Number(userId))) {
      message.error('用户ID必须是数字');
      return;
    }
    if (!uri.includes('/')) {
      message.error('Uri格式不正确');
      return;
    }
    setUserId(Number(userId));
    // 如果输入的是完整的uri，处理下
    const isFullUri = uri.startsWith('http') || uri.includes('/api');
    if (isFullUri) {
      uri = uri.split('/api')[1];
    }
    // impress_pagecache_hash:{userId}:{MD5}
    // MD5: page_cache{接口uri}#{userId}
    const formatUri = parseQueryString(uri);
    console.log('formatUri', formatUri);
    const md5 = MD5(`page_cache${formatUri}#${userId}`).toString();
    setUriKey(`impress_pagecache_hash:${userId}:${md5}`);
  };

  const clickFloatButton = () => {
    setDrawerVisible((drawerVisible) => !drawerVisible);
  };
  const userId = uid ? uid : '${userId}';
  return (
    <Flex vertical>
      <Flex vertical gap="middle">
        <Divider orientation="left">模块缓存</Divider>
        <Search
          style={{ width: 390 }}
          addonBefore="用户ID"
          placeholder="请输入用户ID"
          allowClear
          // enterButton="Search"
          size="large"
          onSearch={handleEnter}
        />
        <Flex vertical gap="middle" style={{ marginTop: 30 }}>
          {moduleKeyList.map((item) => (
            <Space key={item.key}>
              <MainShowItem text={item.value} type="set" module={item.key} />
            </Space>
          ))}
        </Flex>
      </Flex>
      <Flex vertical gap="middle">
        <Divider orientation="left" className={styles.divider}>
          接口缓存
        </Divider>
        <Space.Compact size="large" style={{ maxWidth: 700, minWidth: 390 }}>
          <Input
            ref={userIdRef}
            onChange={(e) => setUserId(e.target.value)}
            onClear={() => setUriKey('')}
            value={uid}
            allowClear
            addonBefore="用户ID"
            placeholder="输入用户ID"
            style={{ width: 300 }}
            onPressEnter={handleEnterUri}
          />
          <Input
            ref={uriRef}
            allowClear
            onClear={() => setUriKey('')}
            addonBefore="Uri"
            addonAfter={<SearchOutlined onClick={handleEnterUri} />}
            placeholder="输入Uri"
            onPressEnter={handleEnterUri}
          />
        </Space.Compact>
        {uriKey && (
          <Space style={{ marginTop: 30 }}>
            <MainShowItem text={uriKey} module="API" type="hash" />
          </Space>
        )}
      </Flex>
      <Flex vertical gap="middle">
        <Divider orientation="left" className={styles.divider}>
          自定义排序缓存
        </Divider>
        <Flex vertical gap="middle">
          <Text type="secondary">
            自定义排序缓存分为：相册自定义排序、隐藏相册自定义排序、分类自定义排序。都比较简单，将{' '}
            <Text mark>$&#123;xxx&#125;</Text>
            整个替换即可
          </Text>
          <Space>
            <Tag color="green">非隐相册自定义排序</Tag>
            <MainShowItem
              text={`impress#custom_sort_list#{albums:${userId}#extra}`}
              module="CustomSort"
              type="list"
              width="800"
            />
          </Space>
          <Space>
            <Tag color="green">隐藏相册自定义排序</Tag>
            <MainShowItem
              text={`impress#custom_sort_list#{albums:${userId}#extra}#hidden`}
              module="CustomSort"
              type="set"
              width="800"
            />
          </Space>
          <Space>
            <Tag color="green">一级分类自定义排序</Tag>
            <MainShowItem
              text={`impress#custom_sort_list#{category:${userId}#extra}`}
              module="CustomSort"
              type="list"
              width="800"
            />
          </Space>
          <Space>
            <Tag color="green">二级分类自定义排序</Tag>
            <MainShowItem
              text={'impress#custom_sort_list#{category_child:${parent_categoryId}#extra}'}
              module="CustomSort"
              type="list"
              width="800"
            />
          </Space>
        </Flex>
      </Flex>
      <Flex vertical gap="middle">
        <Divider orientation="left" className={styles.divider}>
          计数缓存
        </Divider>
        <Flex vertical gap="middle">
          <Text type="secondary">
            计数缓存分为：一级分类下相册数量，二级分类下相册数量(注意：用户的所有二级分类相册数是在一个zset集合里)，相册下图片数量。都比较简单，将{' '}
            <Text mark>$&#123;xxx&#125;</Text>
            整个替换即可
          </Text>
          <Space>
            <Tag color="green">一级分类下相册数量</Tag>
            <MainShowItem
              text={'im_counter#category:${cateId}#uid:' + `${userId}`}
              module="Counter"
              type="string"
              width="700"
            />
          </Space>
          <Space>
            <Tag color="green">二级分类下相册数量</Tag>
            <MainShowItem
              text={'impress#cateChild#' + `${userId}`}
              module="Counter"
              type="zset"
              width="700"
              rKey={'impress#cateChild#' + `${userId}`}
            />
          </Space>
          <Space>
            <Tag color="green">具体相册下图片数量</Tag>
            <MainShowItem
              text={'im_counter#albums:${albumId}#uid:' + `${userId}`}
              module="Counter"
              type="string"
              width="700"
            />
          </Space>
        </Flex>
      </Flex>
      <Flex vertical gap="middle">
        <Divider orientation="left" className={styles.divider}>
          前端接口缓存
        </Divider>
        <Flex vertical gap="middle">
          <Text type="secondary">
            缓存三个接口，全部分类、分类布局、分类电商布局. @_v有两种情况，1或-1。自己看自己@_v=-1， 否则@_v=1
          </Text>
          <Space>
            <Tag color="green">全部分类</Tag>
            <MainShowItem
              text={`impress-website::cache::http://impress.yupoo-fd3.svc.cluster.fud3:4001/web/category/${userId}@_v=1`}
              module="BFF"
              type="string"
              width="1300"
            />
          </Space>
          <Space>
            <Tag color="green">分类布局</Tag>
            <MainShowItem
              text={
                'impress-website::cache::http://impress.yupoo-fd3.svc.cluster.fud3:4001/web/albums/${username}/cate?page=1&password=${password}@_v=-1'
              }
              module="BFF"
              type="string"
              width="1300"
            />
          </Space>
          <Space>
            <Tag color="green">分类电商</Tag>
            <MainShowItem
              text={
                'impress-website::cache::http://impress.yupoo-fd3.svc.cluster.fud3:4001/web/albums/${username}/cate?page=1&password={password}&gallery=1@_v=1'
              }
              module="BFF"
              type="string"
              width="1300"
            />
          </Space>
        </Flex>
      </Flex>
      <Flex vertical gap="middle">
        <Divider orientation="left" className={styles.divider}>
          单一键缓存(findOne缓存)
        </Divider>
        <Flex vertical gap="middle">
          <Text type="secondary">
            单一键缓存例如：@yp:users:username:paypalyupoo、@yp:account:userid:3214689、@yp:contact:userid:3214689,
            全小写
          </Text>
          <Text type="secondary">
            根据查询的表、主键、值的不同而不同,将 <Text mark>$&#123;xxx&#125;</Text>整个替换
          </Text>
          <Space>
            <Tag color="green">单一键缓存</Tag>
            <MainShowItem text={'@yp:${tableName}:${index}:${val}'} module="FindOne" type="string" width="600" />
          </Space>
        </Flex>
      </Flex>
      <Flex vertical gap="middle">
        <Divider orientation="left" className={styles.divider}>
          布局缓存
        </Divider>
        <Space>
          <Tag color="green">布局缓存</Tag>
          <MainShowItem text={`wy#impress_website_layout:${userId}`} module="Layout" type="string" width="700" />
        </Space>
      </Flex>
      <Flex vertical gap="middle">
        <Divider orientation="left" className={styles.divider}>
          密码缓存
        </Divider>
        <Flex vertical gap="middle">
          <Text type="secondary">例如相册密码、主页密码、公告内容、是否开启二级分类</Text>
          <Space>
            <Tag color="green">相册密码</Tag>
            <MainShowItem text={'yp:albums:${albumId}'} module="Password" type="string" width="600" />
          </Space>
          <Space>
            <Tag color="green">主页密码</Tag>
            <MainShowItem text={`yp:homepage:${userId}`} module="Password" type="string" width="600" />
          </Space>
          <Space>
            <Tag color="green">公告内容</Tag>
            <MainShowItem text={`yp:broadcast:${userId}`} module="Password" type="string" width="600" />
          </Space>
          <Space>
            <Tag color="green">二级分类</Tag>
            <MainShowItem text={`yp:cate:child:${userId}`} module="Password" type="string" width="600" />
          </Space>
        </Flex>
      </Flex>

      <FloatButton icon={<ToolOutlined />} onClick={clickFloatButton} />
      <Drawer
        title={'常用操作命令'}
        placement="right"
        size="large"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        <Tools />
      </Drawer>
    </Flex>
  );
};

export default GenerateKey;
