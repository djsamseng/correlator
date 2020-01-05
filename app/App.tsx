import { hot } from 'react-hot-loader/root'
import * as React from 'react'

// @ts-ignore
import NodeAbi from "node-abi";
const electronAbi = NodeAbi.getAbi("6.1.7", "electron");
const nodeAbi = NodeAbi.getAbi("12.13.0", "node");

const App = () => (
  <div>
    <h1>Hello, world. Electron:{electronAbi} Node:{nodeAbi}</ h1>
  </div>
)

export default hot(App)
