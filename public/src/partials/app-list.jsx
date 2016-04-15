var AppList = React.createClass({
  getApps: function(){
    $.get({
      url: this.props.url,
      success: function(data){
        this.setState({data: data});
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function(){
    this.getApps();
  },
  render: function(){
    var nodes = this.state.data.map(function(app, i){
      return (
        <div className="app-summary" key={i}>{app.name}</div>
      );
    });
    return (
      <div className="app-list">
        {nodes}
      </div>
    )
  }
});
