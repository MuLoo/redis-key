import { useState, useEffect } from 'react';
import { Button, Flex, Input, Popover, Space, Tag } from 'antd';
import TextCopy from '../TextCopy';
import styles from './index.module.less';

const Prefix = ({ type = 'set', module }) => (
  <Space.Compact style={{ width: 250 }}>
    <Button size="large" type="text">
      {String(type).toUpperCase()}
    </Button>
    <Button size="large" type="dashed" style={{ display: 'flex', flex: '1 1 auto', borderRight: 'none' }}>
      {module}
    </Button>
  </Space.Compact>
);

const ModuleKeyOperation = ({ text, type, rKey }) => {
  const mapping = {
    string: 'GET',
    set: 'SMEMBERS',
    hash: 'HGETALL',
    list: 'LRANGE',
    zset: 'ZSCORE',
  };
  return (
    <Flex vertical className={styles.copyTextColor} gap="small">
      <Space>
        <Tag color="orange" bordered={false}>
          是否存在
        </Tag>
        <TextCopy text={`EXISTS ${rKey || text}`} />
      </Space>
      <Space>
        <Tag color="orange" bordered={false}>
          生存周期
        </Tag>
        <TextCopy text={`TTL ${rKey || text}`} />
      </Space>
      <Space>
        <Tag color="orange" bordered={false}>
          查看内容
        </Tag>
        <TextCopy text={`${mapping[type]} ${text} ${type === 'list' ? '0 -1' : ''}`} />
      </Space>
    </Flex>
  );
};
/**
 *
 * @param {String} text 操作命令文本
 * @param {String} type 操作类型
 * @param {String} rKey 真正的key
 * @returns
 */
const Suffix = ({ text, type = 'set', rKey = '' }) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      open={open}
      trigger="click"
      overlayClassName={styles.popover}
      mouseLeaveDelay="0.3"
      content={
        <Flex vertical>
          <ModuleKeyOperation text={text} type={type} rKey={rKey} />
        </Flex>
      }
      title="操作"
    >
      <Button type="primary" size="large" onClick={() => setOpen((open) => !open)}>
        操作
      </Button>
    </Popover>
  );
};

const MainShowItem = ({ module, text, rKey, type, width = 900 }) => {
  const w = typeof width === 'number' ? width : Number(width.replace('px', '')) || 900;
  const [inputValue, setInputValue] = useState(rKey || text);

  useEffect(() => {
    setInputValue(rKey || text);
  }, [rKey, text]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };
  return (
    <Input
      size="large"
      className={styles.moduleList}
      addonBefore={<Prefix module={module} type={type} />}
      addonAfter={<Suffix text={inputValue} type={type} rKey={rKey} />}
      value={inputValue}
      onChange={handleChange}
      variant="filled"
      style={{ width: w }}
    />
  );
};

export default MainShowItem;
