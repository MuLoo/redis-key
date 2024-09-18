import React from 'react';
import { ConfigProvider } from 'antd';
import './App.css';
import Router from './router.jsx';

import {
  BrowserRouter,
} from "react-router-dom";

const App = () => (
  <ConfigProvider
    theme={{
      token: {
        // Seed Token，影响范围大
        colorPrimary: "#00b96b",
        borderRadius: 4,

        // 派生变量，影响范围小
        // colorBgContainer: '#f6ffed',
      },
    }}
  >
      <BrowserRouter ><Router /></BrowserRouter>
  </ConfigProvider>
);

export default App;