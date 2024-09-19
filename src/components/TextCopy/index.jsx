import React from 'react';
import { message, Space, Typography } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import styles from './index.module.less';
const { Text } = Typography;

const copyBackup = (text) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    message.success('复制成功');
  } catch (err) {
    message.error('复制失败');
  }
  document.body.removeChild(textarea);
};

const TextCopy = ({ text }) => {
  const copy = () => {
    // https下才可以使用原生的navigator.clipboard.writeText
    if (navigator.clipboard && navigator.clipboard.writeText && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          message.success('复制成功');
        })
        .catch(() => {
          message.error('复制失败');
        });
    } else {
      copyBackup(text);
    }
  };
  return (
    <Space size="middle">
      <Text style={{ fontSize: 15 }} onClick={copy} className={styles.text}>
        {text}
      </Text>
      <CopyOutlined className={styles.copy} onClick={copy} />
    </Space>
  );
};

export default TextCopy;
