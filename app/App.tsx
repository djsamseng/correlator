import { hot } from 'react-hot-loader/root'
import * as React from 'react'
import NodeAbi from "node-abi";
const Electron = require("electron");

const electronAbi = NodeAbi.getAbi("6.1.7", "electron");
const nodeAbi = NodeAbi.getAbi("12.13.0", "node");

type State = {
    isRecording:boolean,
    messages:Array<string>,
};

class App extends React.Component<{}, State> {
    constructor(props) {
        super(props);

        this.state = {
            isRecording: false,
            messages: [],
        }
    }
    private _setupElectron() {
      Electron.ipcRenderer.on("message", (evt, arg) => {
        const messages = this.state.messages.concat([arg]);
        this.setState({
          messages,
        });
      });
      Electron.ipcRenderer.send("start");
    }
    private _toggleRecord() {
      if (this.state.isRecording) {
        Electron.ipcRenderer.send("stopRecording");
      }
      else {
        Electron.ipcRenderer.send("startRecording");
      }
      this.setState({
        isRecording: !this.state.isRecording,
      });
    }
    render() {
        return (
            <div>
              <h1>Hello, world. Electron:{electronAbi} Node:{nodeAbi}</ h1>
              <p>Num messages received: {this.state.messages.length}</p>
              <button onClick={this._setupElectron.bind(this)}>Setup Electron</button>
              <button onClick={this._toggleRecord.bind(this)}>
                { this.state.isRecording ? "Stop recording" : "Start Recording" }
              </button>
            </div>
        );
    }
};

export default hot(App)
