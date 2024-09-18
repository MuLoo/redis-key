import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const port = 3003;

// 获取当前文件的目录名
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'dist')));

// 处理所有其他请求，返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});