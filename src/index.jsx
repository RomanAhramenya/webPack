import React from 'react';
import {render} from 'react-dom'
import Post from './Post'
import './Babel'
import './styles/app.css'
import json from './assets/json.json'
import logo from './assets/1.png'
import xml from './assets/data.xml'
const post = new Post('Post TITLE',logo)
console.log('Post to String', post.toString())
console.log('json',json)
console.log('xml',xml)

const App = () => (
    <div className="container">
    <h1>
        Webpack
    </h1>
    <div>iMage <img src="./assets/1.png"/></div>
</div>
)

render(<App/>,document.getElementById('app'))