import React, { useRef, useState } from 'react'
import {
  Select,
  Input,
  Divider,
  Button,
  Space,
  message,
  Popover,
  Flex,
  Typography,
  FloatButton,
  Drawer,
  Tag
} from 'antd'
import { SearchOutlined, ToolOutlined } from '@ant-design/icons'
import styles from './index.module.less'
import { parseQueryString } from '../../utils/common'

import { MD5 } from 'crypto-js';
import TextCopy from '../TextCopy';
import Tools from '../Tools'
const { Option } = Select;
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
  'programYupooAlbums'
].map(key => ({ key, value: '' }))

const selectBefore = (
  <Select style={{ padding: '8px 4px' }} defaultValue="module">
    <Option value="module">模块</Option>
    <Option value="api">接口</Option>
  </Select>
);
const Prefix = ({ type = 'set', module }) => (
  <Space.Compact style={{ width: 250 }}>
    <Button size="medium" type='text' >{String(type).toUpperCase()}</Button>
    <Button size="medium" type='dashed' style={{ display: 'flex', flex: '1 1 auto', borderRight: 'none'}}>{module}</Button>
  </Space.Compact>
)

const ModuleKeyOperation = ({ text, type }) => {
  const mapping = {
    'string': 'GET',
    'set': 'SMEMBERS',
    'hash': 'HGETALL',
    'list': 'LRANGE',
  }
  return <Flex vertical>
    <Space><Text code>是否存在</Text><TextCopy text={`EXISTS ${text}`} /></Space>
    <Space><Text code>查看内容</Text><TextCopy text={`${mapping[type]} ${text} ${type === 'list' ? '0 -1' : ''}`} /></Space>
  </Flex>
}

const Suffix = ({ text, type = 'set' }) => (
  <Popover content={<Flex vertical>
    <ModuleKeyOperation text={text} type={type}  />
  </Flex>} title="操作">
    <Button type='primary' size="medium">操作</Button>
  </Popover>
)

const GenerateKey = () => {
  const [uid, setUserId] = useState('')
  const [moduleKeyList, setModuleKeyList] = useState([])
  const [uriKey, setUriKey] = useState('')
  const [drawerVisible, setDrawerVisible] = useState(false)
  const userIdRef = useRef(null)
  const uriRef = useRef(null)

  const handleEnter = (inputValue) => {
    if (!inputValue || Number.isNaN(Number(inputValue))) {
      setModuleKeyList([])
      return;
    };
    console.log('userIDRef', userIdRef.current.input)
    userIdRef.current.value = inputValue
    setUserId(Number(inputValue))
    const list = moduleListInit.map(item => {
      const { key } = item
      // impress_pagecache_hash:{userId}:{MD5}
      // MD5: model_registry{model}:{userId}
      const md5 = MD5(`model_registry${key}:${inputValue}`).toString()
      console.log('md5', md5)
      return {
        key,
        value: `impress_pagecache_hash:${inputValue}:${md5}`
      }
    })
    setModuleKeyList(list)
  }

  const handleEnterUri = () => {
    const userId = userIdRef.current?.input?.value
    let uri = uriRef.current?.input?.value

    if (!userId || !uri) {
      message.error('请输入用户ID和Uri')
      return;
    }
    if (Number.isNaN(Number(userId))) {
      message.error('用户ID必须是数字')
      return;
    }
    if (!uri.includes('/')) {
      message.error('Uri格式不正确')
      return;
    }
    setUserId(Number(userId))
    // 如果输入的是完整的uri，处理下
    const isFullUri = uri.startsWith('http') || uri.includes('/api')
    if (isFullUri) {
      uri = uri.split('/api')[1]
    }
    // impress_pagecache_hash:{userId}:{MD5}
    // MD5: page_cache{接口uri}#{userId}
    const formatUri = parseQueryString(uri)
    console.log('formatUri', formatUri)
    const md5 = MD5(`page_cache${formatUri}#${userId}`).toString()
    setUriKey(`impress_pagecache_hash:${userId}:${md5}`)
  }

  const clickFloatButton = (event) => {
    setDrawerVisible(drawerVisible => !drawerVisible)

  }
  const userId = uid ? uid : "${userId}";
  return (
    <Flex vertical>
      <Flex vertical gap='middle'>
        <Divider orientation="left">模块缓存</Divider>
        <Search
          style={{ width: 400 }}
          addonBefore="用户ID"
          placeholder="请输入用户ID"
          allowClear
          // enterButton="Search"
          size="large"
          onSearch={handleEnter}
        />
        <Flex vertical gap='middle'  style={{ marginTop: 30 }}>
          {moduleKeyList.map(item => (
            <Space key={item.key} >
              <Input
                className={styles.moduleList}
                addonBefore={<Prefix module={item.key} type='set' />}
                addonAfter={<Suffix text={item.value} type='set' />}
                value={item.value}
                variant="filled"
                style={{ width: 900 }}
              />
            </Space>
            ))
          }
          </Flex>
        </Flex>
      <Flex vertical gap='middle'>
        <Divider orientation="left" className={styles.divider}>接口缓存</Divider>
        <Space.Compact size="large" style={{ maxWidth: 700, minWidth: 400 }}>
          <Input ref={userIdRef}
            onChange={(e) => setUserId(e.target.value)}
            onClear={() => setUriKey('')}
            value={uid}
            allowClear
            addonBefore='用户ID'
            placeholder="输入用户ID"
            style={{ width: 300 }}
            onPressEnter={handleEnterUri} />
          <Input ref={uriRef}
            allowClear
            onClear={() => setUriKey('')}
            addonBefore='Uri'
            addonAfter={<SearchOutlined onClick={handleEnterUri} />}
            placeholder="输入Uri"
            onPressEnter={handleEnterUri} />
        </Space.Compact>
        {
          uriKey && <Space  style={{ marginTop: 30 }}>
          <Input
            className={styles.moduleList}
            addonBefore={<Prefix module='API' type='hash' />}
            addonAfter={<Suffix text={uriKey} type='hash' />}
            value={uriKey}
            variant="filled"
            style={{ width: 900 }}
          />
          </Space>
        }
      </Flex>
      <Flex vertical gap='middle'>
        <Divider orientation="left" className={styles.divider}>自定义排序缓存</Divider>
        <Flex vertical gap='middle'>
          <Text type='secondary' >自定义排序缓存分为：相册自定义排序、隐藏相册自定义排序、分类自定义排序。都比较简单，将  <Text mark>$&#123;xxx&#125;</Text>
          整个替换即可</Text>
          <Space >
            <Tag color="green"> 相册自定义排序</Tag>
            {/* <TextCopy text={`impress#custom_sort_list#{albums:${userId}#extra}`} /> */}
            <Input
              className={styles.moduleList}
              addonBefore={<Prefix module='CustomSort' type='list' />}
              addonAfter={<Suffix text={`impress#custom_sort_list#{albums:${userId}#extra}`} type='list' />}
              value={`impress#custom_sort_list#{albums:${userId}#extra}`}
              variant="filled"
              style={{ width: 800 }}
            />
          </Space>
          <Space >
            <Tag color="green">隐藏相册自定义排序</Tag>
            {/* <TextCopy text={`impress#custom_sort_list#{albums:${userId}#extra}#hidden`} /> */}
            <Input
              className={styles.moduleList}
              addonBefore={<Prefix module='CustomSort' type='set' />}
              addonAfter={<Suffix text={`impress#custom_sort_list#{albums:${userId}#extra}#hidden`} type='set' />}
              value={`impress#custom_sort_list#{albums:${userId}#extra}#hidden`}
              variant="filled"
              style={{ width: 800 }}
            />
          </Space>
          <Space >
            <Tag color="green">一级分类自定义排序</Tag>
            {/* <TextCopy text={`impress#custom_sort_list#{category:${userId}#extra}`} /> */}
            <Input
              className={styles.moduleList}
              addonBefore={<Prefix module='CustomSort' type='list' />}
              addonAfter={<Suffix text={`impress#custom_sort_list#{category:${userId}#extra}`} type='list' />}
              value={`impress#custom_sort_list#{category:${userId}#extra}`}
              variant="filled"
              style={{ width: 800 }}
            />
          </Space>
          <Space >
            <Tag color="green">二级分类自定义排序</Tag>
            {/* <TextCopy text="impress#custom_sort_list#{category_child:${parent_categoryId}#extra}" /> */}
            <Input
              className={styles.moduleList}
              addonBefore={<Prefix module='CustomSort' type='list' />}
              addonAfter={<Suffix text={"impress#custom_sort_list#{category_child:${parent_categoryId}#extra}"} type='list' />}
              value={"impress#custom_sort_list#{category_child:${parent_categoryId}#extra}"}
              variant="filled"
              style={{ width: 800 }}
            />
          </Space>
        </Flex>
      </Flex>
      <Flex vertical gap='middle'>
        <Divider orientation="left" className={styles.divider}>计数缓存</Divider>
        <Flex vertical gap='middle'>
          <Text type='secondary' >计数缓存分为：一级分类下相册数量， 相册下图片数量。都比较简单，将  <Text mark>$&#123;xxx&#125;</Text>
            整个替换即可</Text>
          <Space >
            <Tag color="green">一级分类下相册数量</Tag>
            {/* <TextCopy text={"im_counter#category:${cateId}#uid:" + `${userId}`} /> */}
            <Input
              className={styles.moduleList}
              addonBefore={<Prefix module='Counter' type='string' />}
              addonAfter={<Suffix text={"im_counter#category:${cateId}#uid:" + `${userId}`} type='string' />}
              value={"im_counter#category:${cateId}#uid:" + `${userId}`}
              variant="filled"
              style={{ width: 700 }}
            />
          </Space>
          <Space >
            <Tag color="green">相册下图片数量</Tag>
            {/* <TextCopy text={"im_counter#albums:${albumId}#uid:" + `${userId}`} /> */}
            <Input
              className={styles.moduleList}
              addonBefore={<Prefix module='Counter' type='string' />}
              addonAfter={<Suffix text={"im_counter#albums:${albumId}#uid:" + `${userId}`} type='string' />}
              value={"im_counter#albums:${albumId}#uid:" + `${userId}`}
              variant="filled"
              style={{ width: 700 }}
            />
          </Space>
        </Flex>
      </Flex>
      <Flex vertical gap='middle'>
        <Divider orientation="left" className={styles.divider}>前端接口缓存</Divider>
        <Flex vertical gap='middle'>
          <Text type='secondary'>缓存三个接口，全部分类、分类布局、分类电商布局. @_v有两种情况，1或-1。自己看自己@_v=-1， 否则@_v=1</Text>
          <Space >
            <Tag color="green">全部分类</Tag>
            {/* <TextCopy text={"impress-website::cache::http://impress.yupoo-fd3.svc.cluster.fud3:4001/web/category/{userId}@_v=1`} /> */}
            <Input
              className={styles.moduleList}
              addonBefore={<Prefix module='BFF' type='string' />}
              addonAfter={<Suffix text={`impress-website::cache::http://impress.yupoo-fd3.svc.cluster.fud3:4001/web/category/${userId}@_v=1`} type='string' />}
              value={`impress-website::cache::http://impress.yupoo-fd3.svc.cluster.fud3:4001/web/category/${userId}@_v=1`}
              variant="filled"
              style={{ width: 1000 }}
            />
          </Space>
          <Space >
            <Tag color="green">分类布局</Tag>
            {/* <TextCopy text={`impress-website::cache::http://impress.yupoo-fd3.svc.cluster.fud3:4001/web/albums/${username}/cate?page=1&password=${password}@_v=-1`} /> */}
            <Input
              className={styles.moduleList}
              addonBefore={<Prefix module='BFF' type='string' />}
              addonAfter={<Suffix text={"impress-website::cache::http://impress.yupoo-fd3.svc.cluster.fud3:4001/web/albums/${username}/cate?page=1&password=${password}@_v=-1"} type='string' />}
              value={"impress-website::cache::http://impress.yupoo-fd3.svc.cluster.fud3:4001/web/albums/${username}/cate?page=1&password=${password}@_v=-1"}
              variant="filled"
              style={{ width: 1000 }}
            />
          </Space>
          <Space >
            <Tag color="green">分类电商</Tag>
            {/* <TextCopy text={"impress-website::cache::http://impress.yupoo-fd3.svc.cluster.fud3:4001/web/albums/${username}/cate?page=1&password={password}&gallery=1@_v=1"} /> */}
            <Input
              className={styles.moduleList}
              addonBefore={<Prefix module='BFF' type='string' />}
              addonAfter={<Suffix text={"impress-website::cache::http://impress.yupoo-fd3.svc.cluster.fud3:4001/web/albums/${username}/cate?page=1&password={password}&gallery=1@_v=1"} type='string' />}
              value={"impress-website::cache::http://impress.yupoo-fd3.svc.cluster.fud3:4001/web/albums/${username}/cate?page=1&password={password}&gallery=1@_v=1"}
              variant="filled"
              style={{ width: 1000 }}
            />
          </Space>
        </Flex>
      </Flex>
      <Flex vertical gap='middle'>
        <Divider orientation="left" className={styles.divider}>单一键缓存(findOne缓存)</Divider>
        <Flex vertical gap='middle'>
          <Text type='secondary' >单一键缓存例如：@yp:users:username:paypalyupoo、@yp:account:userid:3214689、@yp:contact:userid:3214689, 全小写</Text>
          <Text type='secondary' >根据查询的表、主键、值的不同而不同,将  <Text mark>$&#123;xxx&#125;</Text>整个替换</Text>
          <Space>
            <Tag color="green">单一键缓存</Tag>
            {/* <TextCopy text={"@yp:${tableName}:${index}:${val}"} /> */}
            <Input
              className={styles.moduleList}
              addonBefore={<Prefix module='FindOne' type='string' />}
              addonAfter={<Suffix text={"@yp:${tableName}:${index}:${val}"} type='string' />}
              value={"@yp:${tableName}:${index}:${val}"}
              variant="filled"
              style={{ width: 600 }}
            />
          </Space>
        </Flex>
      </Flex>
      <Flex vertical gap='middle'>
        <Divider orientation="left" className={styles.divider}>布局缓存</Divider>
          <Space>
            <Tag color="green">布局缓存</Tag>
            {/* <TextCopy text={`wy#impress_website_layout:${userId}`} /> */}
            <Input
              className={styles.moduleList}
              addonBefore={<Prefix module='Layout' type='string' />}
              addonAfter={<Suffix text={`wy#impress_website_layout:${userId}`} type='string' />}
              value={`wy#impress_website_layout:${userId}`}
              variant="filled"
              style={{ width: 600 }}
            />
          </Space>
      </Flex>
      <Flex vertical gap='middle'>
        <Divider orientation="left" className={styles.divider}>密码缓存</Divider>
          <Flex vertical gap='middle'>
          <Text type='secondary' >例如相册密码、主页密码、公告内容、是否开启二级分类</Text>
          <Space>
            <Tag color="green">相册密码</Tag>
              {/* <TextCopy text="yp:albums:${albumId}" /> */}
              <Input
                className={styles.moduleList}
                addonBefore={<Prefix module='Password' type='string' />}
                addonAfter={<Suffix text={"yp:albums:${albumId}"} type='string' />}
                value={"yp:albums:${albumId}"}
                variant="filled"
                style={{ width: 600 }}
              />
          </Space>
          <Space>
            <Tag color="green">主页密码</Tag>
              {/* <TextCopy text={`yp:homepage:${userId}`} /> */}
              <Input
                className={styles.moduleList}
                addonBefore={<Prefix module='Password' type='string' />}
                addonAfter={<Suffix text={`yp:homepage:${userId}`} type='string' />}
                value={`yp:homepage:${userId}`}
                variant="filled"
                style={{ width: 600 }}
              />
          </Space>
          <Space>
            <Tag color="green">公告内容</Tag>
              {/* <TextCopy text={`yp:broadcast:${userId}`} /> */}
              <Input
                className={styles.moduleList}
                addonBefore={<Prefix module='Password' type='string' />}
                addonAfter={<Suffix text={`yp:broadcast:${userId}`} type='string' />}
                value={`yp:broadcast:${userId}`}
                variant="filled"
                style={{ width: 600 }}
              />
          </Space>
          <Space>
            <Tag color="green">是否开启二级分类</Tag>
              {/* <TextCopy text={`yp:cate:child:${userId}`} /> */}
              <Input
                className={styles.moduleList}
                addonBefore={<Prefix module='Password' type='string' />}
                addonAfter={<Suffix text={`yp:cate:child:${userId}`} type='string' />}
                value={`yp:cate:child:${userId}`}
                variant="filled"
                style={{ width: 600 }}
              />
          </Space>
        </Flex>
      </Flex>

      <FloatButton icon={<ToolOutlined />} onClick={clickFloatButton} />
      <Drawer
        title={'常用操作命令'}
        placement="right"
        size='large'
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        <Tools />
      </Drawer>
    </Flex>
  )
}

export default GenerateKey