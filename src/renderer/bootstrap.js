var polyfill = require('babel/polyfill');
var remote = require('remote');
var Menu = remote.require('menu');
var dialog = remote.require('dialog');
var fs = require('fs');
var currentWindow = remote.getCurrentWindow();
var React = require('react');
var Main = require('./components/Main');
var parse = require('csv-parse');
var CsvDataStore = require('./stores/CsvDataStore');
var CsvPathStore = require('./stores/CsvPathStore');

var showOpen = function() {
  var fileNames = dialog.showOpenDialog(currentWindow, {
    properties: [
      'openFile'
    ],
    filters: [{
      name: 'Profiler csv',
      extensions: ['csv']
    }]
  });
  if (fileNames !== undefined) {
    var fileName = fileNames[0];
    CsvPathStore.setData(fileName);
    fs.createReadStream(fileName).pipe(
      parse({delimiter: ','}, function(err, data){
        if(data != null){
          CsvDataStore.unsetData();
          CsvDataStore.setData(data);
        }
      })
    );
    fs.watchFile(CsvPathStore.getData(), function(curr, prev){
      fs.createReadStream(CsvPathStore.getData()).pipe(
        parse({delimiter: ','}, function(err, data){
          if(data != null){
            CsvDataStore.unsetData();
            CsvDataStore.setData(data);
          }
        })
      );
    });
  }
};

var template = [{
  label: 'File',
  submenu: [{
    label: 'Open',
    click: showOpen
  }, {
    label: 'Quit',
    accelerator: 'Command+Q',
    click: function () {
      currentWindow.close()
    }
  }]
}];

var menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

React.render(
  React.createElement(Main),
  document.getElementById('app')
);
