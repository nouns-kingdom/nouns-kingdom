import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./views/Home";
import Category from "./views/Category";
import Word from "./views/Word";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className='about' style={{ marginLeft: "15%", marginRight: "15%", marginTop: "2rem" }}>
      <h1>为什么会写这样一个网站</h1>
      <p>这个网站目前只有名词类相关的单词，以卡片的形式展示，卡片部分只有英文注释，相对应的中文翻译单独在卡片下方显示。</p>
      <p>
        最初有这样一个想法是一次上班路上，看着外面的树，想着自己能用英文说出几个树的部分(root, leaves...)。好像没了。。。 然后打开手机搜索了一下parts of
        tree，发现其实好多单词自己都认识，只不过真的要说的时候想不起来。再看一眼自己做的公交车，能想到的单词也就只是window，front door， rear
        door，seat。。。其它也就没什么了。然后脑海里第一次有了写这样一个app的想法。也确实动手写了，当时想的是写一个手机app，用react
        native，之后因为忙写的事情（其实就是懒），也就慢慢不上心了。今年7月份的时候我们家迎来了一位新成员，想着应该写点什么东西来纪念一下，另外也算是送他的一份小礼物了。所以又把这个项目捡了起来。
      </p>
    </div>
  );
}

function NotFound() {
  return <h2>404 - Not Found</h2>;
}

function App() {
  return (
    <Router>
      <div style={{ background: "#f5f5f5", padding: "1em 0", marginBottom: "2em", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
        <nav style={{ display: "flex", justifyContent: "center", gap: "2em" }}>
          <Link to='/' style={{ textDecoration: "none", fontWeight: "bold", color: "#333" }}>
            Home
          </Link>
          <Link to='/about' style={{ textDecoration: "none", fontWeight: "bold", color: "#333" }}>
            About
          </Link>
        </nav>
      </div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path=':category' element={<Category />} />
        <Route path=':category/:id' element={<Word />} />
        <Route path='about' element={<About />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
