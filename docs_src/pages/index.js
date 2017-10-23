import React from 'react';
import Helmet from 'react-helmet';
import { throttle } from 'lodash';
import marked from 'marked';
import highlight from 'highlight.js';

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true,
  highlight: code => highlight.highlightAuto(code).value,
});

import article from './index.md';
import shader from './index.frag';
const articleHtml = marked(article);

export default class Canvas extends React.Component {
  componentDidMount() {
    const Veda = require('vedajs');
    this.veda = new Veda({
      pixelRatio: 2,
      frameskip: 2,
    });
    this.veda.setCanvas(this.canvas);
    this.veda.loadFragmentShader(shader);
    this.veda.play();

    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = throttle(() => {
    this.veda.resize(this.container.offsetWidth, this.container.offsetHeight);
  })

  setContainer = el => {
    this.container = el;
  }

  setCanvas = el => {
    this.canvas = el;
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>VEDA.js - Shader Art Framework</title>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/dracula.min.css" />
        </Helmet>
        <style jsx>{`
          .body {
            position: absolute;
            z-index: 2;
            width: 100%;
          }
          article {
            width: 600px;
            max-width: 90%;
            margin: 0 auto;
            color: white;
            text-shadow: 0 0 10px #000;
          }
          .container {
            position: fixed;
            height: 100%;
            width: 100%;
            background: black;
          }
          .canvas {
            position: absolute;
            height: 100%;
            width: 100%;
            opacity: 0.5;
          }
        `}</style>
        <style global jsx>{`
          a, a:visited, a:hover {
            color: white;
            font-weight: bold;
          }
          body {
            margin: 0;
            padding: 0;
          }
          pre {
            padding: 10px;
            background: #000;
            font-family: monospace;
          }
        `}</style>
        <div className="body">
          <article dangerouslySetInnerHTML={{ __html: articleHtml }}/>
        </div>
        <div className="container" ref={this.setContainer}>
          <canvas className="canvas" ref={this.setCanvas}/>
        </div>
      </div>
    );
  }
}
