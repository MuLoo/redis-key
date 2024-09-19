import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import GenerateKey from './components/GenerateKey';
import Tools from './components/Tools';

const Router = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<GenerateKey />} />
        <Route path="/tool" element={<Tools />} />
      </Route>
    </Routes>
  );
};

export default Router;
