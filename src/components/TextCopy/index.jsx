import React from 'react'
import { message, Space, Typography } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import styles from './index.module.less'
const { Text } = Typography;

const TextCopy = ({ text }) => {
  const copy = () => {
    if (!navigator.clipboard.writeText || typeof navigator.clipboard.writeText !== 'function') return message.info('请使用新版本chrome浏览器');
    navigator.clipboard.writeText(text).then(() => {
      message.success('复制成功');
    }).catch(() => {
      message.error('复制失败');
    });
  };
  return (
    <Space size="middle">
      <Text style={{fontSize: 15}} onClick={copy} className={styles.text}>{text}</Text>
      <CopyOutlined className={styles.copy} onClick={copy} />
    </Space>
  )
}

export default TextCopy