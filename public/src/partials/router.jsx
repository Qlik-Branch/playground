var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var hashHistory = ReactRouter.hashHistory;

var PlaygroundRouter = React.createClass({
  render: function(){
    return (
      <Router history={hashHistory}>
        <Route path="/" component={Home}/>
        <Route path="/login" component={Login}/>
        <Route path="/noobs" component={Noobs}/>
        <Route path="/gettingstarted" component={GettingStarted}/>
        <Route path="/showcase" component={Showcase}/>
      </Router>
    )
  },
});
ReactDOM.render(
  <PlaygroundRouter />,
  document.getElementById('app')
);
