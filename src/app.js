'use strict';
require('babel/polyfill');

var app = require('app');
var BrowserWindow = require('browser-window');
var crashReporter = require('crash-reporter');
var fs = require('fs');
var ipcMain = require('electron').ipcMain;

var mainWindow = null;
crashReporter.start();

app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready',  function() {
  mainWindow = new BrowserWindow({
    title: "Symfony Profiler"
  });
  if(!mainWindow.isMaximized()){
    mainWindow.maximize();
  }
  mainWindow.loadUrl('file://' + __dirname + '/renderer/index.html');

  ipcMain.on('toggle-profiler', function(event, url, token) {
    var profilerWindow = new BrowserWindow({
      show: false,
      title: "Symfony Profiler - Showing: " + token,
    });
    profilerWindow.loadUrl(url);
    profilerWindow.show();
  })
});
