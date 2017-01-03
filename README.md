# sandbox-gps


node serialport module needs to be rebuilt to run with Electron :


1. npm install --save-dev electron-rebuild
2. Delete existing Node.js binding node_modules/serialport/build/Release/serialport.node  <--important

3. Run electron-rebuild
    *   For Windows .\node_modules\.bin\electron-rebuild.cmd
    *   For Linux and macOS ./node_modules/.bin/electron-rebuild


2016.11.30 AndrewY : I've set up npm rebuild script to 
1. remove and reinstall serialport module
2. remove node binding ( seriralport.node )
3. exec electron-rebuild

```
npm rebuild
```



## Distribution Instruction

The command should generate installer under /dist
```
npm run dist 

```

