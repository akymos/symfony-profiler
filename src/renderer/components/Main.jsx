var React = require('react');
var CsvDataStore = require('../stores/CsvDataStore');
var ProfilerUrlStore = require('../stores/ProfilerUrlStore');
var moment = require('moment');
var ipc = require('electron').ipcRenderer;

var DetailRow = React.createClass({
  openProfiler : function() {
    if(ProfilerUrlStore.getData() == null){
      alert("Please insert a profiler URL!");
    }else{
      var profilerUrl = ProfilerUrlStore.getData() + this.props.data[0];
      ipc.send('toggle-profiler', profilerUrl, this.props.data[0]);
    }
  },
  render : function() {
    return (
      <tr>
        <td>{this.props.data.rowNumb}</td>
        <td><i className="fa fa-tachometer" onClick={this.openProfiler}></i></td>
        <td>{this.props.data[0]}</td>
        <td>{moment.unix(this.props.data[4]).format("DD/MM/YYYY hh:mm:ss")}</td>
        <td>{this.props.data[2]}</td>
        <td>{this.props.data[3]}</td>
        <td>{this.props.data[1]}</td>
        <td>{this.props.data[5]}</td>
      </tr>
    )
  }
});

var Main = React.createClass({
  getInitialState: function() {
    return {
      data: []
    }
  },
  componentDidMount: function() {
    CsvDataStore.addChangeListener(this._onStoreChange);
  },
  componentWillUnmount : function() {
    CsvDataStore.removeChangeListener(this._onStoreChange);
  },
  _onStoreChange: function(){
    var store = CsvDataStore.getData();
    if(store !== undefined){
      store.reverse();
      this.setState({
        data : store
      });
    }
  },
  handleChange: function(){
    ProfilerUrlStore.setData(event.target.value);
  },
  render: function() {
    var results = [];
    this.state.data.forEach(function(item, i) {
      item.rowNumb = i+1;
      results.push(<DetailRow inputId={"row"+item[0]+i} data={item} key={item[0]+i} />);
    });
    if(results.length > 0){
      return (
        <div>
          <div className={"profiler-configuration"}>
            <label>Profiler URL:</label>
            <input type="text" name="profilerUrl" placeholder="http://localhost/pathToSymFonyWeb/app_dev.php/_profiler/" value={ProfilerUrlStore.getData()} onChange={this.handleChange} />
          </div>
          <table className={"table table-striped header-fixed"}>
            <thead>
            <tr>
              <th>#</th>
              <th>View</th>
              <th>Token</th>
              <th>Time</th>
              <th>Method</th>
              <th>URL</th>
              <th>Remote Addr</th>
              <th>Parent Token</th>
            </tr>
            </thead>
            <tbody>
            {results}
            </tbody>
          </table>
        </div>
      );
    }else{
      return(<div>File -> Open</div>);
    }

  }
});

module.exports = Main;
