var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var _Data = null;

var CsvPathStore = assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getData : function() {
    return _Data;
  },
  setData : function(data) {
    _Data = data;
    this.emitChange();
  },
  unsetData : function() {
    _Data = null;
    this.emitChange();
  }
});

module.exports = CsvPathStore;
