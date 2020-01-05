import { hot } from 'react-hot-loader/root'
import * as React from 'react'
import NodeAbi from "node-abi";
const Electron = require("electron");

const electronAbi = NodeAbi.getAbi("6.1.7", "electron");
const nodeAbi = NodeAbi.getAbi("12.13.0", "node");

type State = {
    imageSrc:any,
    isRecording:boolean,
    messages:Array<string>,
};

class App extends React.Component<{}, State> {
    constructor(props) {
        super(props);

        this.state = {
            imageSrc:"",
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
        Electron.desktopCapturer.getSources({ types: [ "screen" ] })
        .then(async sources => {
          for (const source of sources) {
            if (source.name === "Screen 1") {
              try {
                const stream = await navigator.mediaDevices.getUserMedia({
                  audio: false,
                  video: {
                    // @ts-ignore
                    mandatory: {
                      chromeMediaSource: "desktop",
                      chromeMediaSourceId: source.id,
                    }
                  }
                });
                console.log("CORRECT:", stream);
                this._handleStream(stream);
              }
              catch (error) {
                console.error("Error getting user media", error);
              }
            }
            else {
              console.warn("GOT SOURCE:", source.name);
            }
          }
        });
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
              <br />
              <img src={this.state.imageSrc}/>
            </div>
        );
    }

    private _handleStream(stream) {
      // Create hidden video tag
      var video = document.createElement('video');
      video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';

      // Event connected to stream
      video.onloadedmetadata = () => {
          // Set video ORIGINAL height (screenshot)
          const HEIGHT = 500;
          const WIDTH = 500;
          const imageFormat = "image/jpeg";
          video.style.height = HEIGHT + 'px'; // videoHeight
          video.style.width = WIDTH + 'px'; // videoWidth

          video.play();

          // Create canvas
          var canvas = document.createElement('canvas');
          canvas.width = HEIGHT
          canvas.height = WIDTH
          var ctx = canvas.getContext('2d');
          // Draw video on canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          this.setState({
            imageSrc: canvas.toDataURL(imageFormat),
          });

          // Remove hidden video tag
          video.remove();
          try {
              // Destroy connect to stream
              stream.getTracks()[0].stop();
          } catch (e) {}
      }

      video.srcObject = stream;
      document.body.appendChild(video);
    }
};

export default hot(App)
