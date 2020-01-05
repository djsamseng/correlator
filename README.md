# Electron typescript

## Run application

```bash
yarn watch # terminal window 1
yarn start # terminal window 2
```

## Reload electron code
- Ctrl Shift R
## Inspectoor
- View >> Toggle Developer Tools

## Compile application

```bash
yarn build # terminal window 1
yarn start # terminal window 2
```

## To add iohook
```bash
$ yarn add node-abi
$ node -v # output v12.13.0
$ $ ./node_modules/electron/dist/Electron.app/Contents/MacOS/Electron -v # output v6.1.7
```
```javascript
import NodeAbi from "node-abi";
const electronAbi = NodeAbi.getAbi("6.1.7", "electron"); # output 73
const nodeAbi = NodeAbi.getAbi("12.13.0", "node"); # output 72
```
package.json
```json
  "iohook": {
    "targets": [
      "node-72",
      "electron-73"
    ],
    "platforms": [
      "win32",
      "darwin",
      "linux"
    ],
    "arches": [
      "x64",
      "ia32"
    ]
  }
```
```bash
$ yarn add iohoook
```

