var Header = React.createClass({
  render: function(){
    var Link = ReactRouter.Link;
    return (
      <div className="header">
        <ul role="nav" className="navmenu">
          <li class="home">
            <Link activeClassName="active" to='/'><span className="lui-icon lui-icon--home"></span></Link>
          </li>
          <li>
            <Link activeClassName="active" to='/noobs'>Qlik for noobs</Link>
          </li>
          <li>
            <Link activeClassName="active" to='/gettingstarted'>Getting started</Link>
          </li>
          <li>
            <Link activeClassName="active" to='/showcase'>Showcase</Link>
          </li>
        </ul>
        <div className="loginmenu">
          <button className="lui-button  lui-button--inverse"><span className="lui-button__text">Qlik</span><span className="lui-button__caret  lui-caret"></span></button>
          <button className="lui-button lui-button--warning"><Link to='/login'>Login</Link></button>
        </div>
      </div>
    )
  }
});

var Footer = React.createClass({
  render: function(){
    var Link = ReactRouter.Link;
    var sites = {
      header: "Qlik Sites",
      items:[
        {
          text: "Qlik.com",
          link : "http://www.qlik.com"
        },
        {
          text: "Qlik Community",
          link : "http://community.qlik.com"
        },
        {
          text: "Qlik Cloud",
          link : "http://www.qlikcloud.com"
        }
      ]
    }
    return (
      <div className="footer">
        <div className="footer-main">
          <ul className="footer-block-container">
            <li className="footer-block">
              <div className="footer-logo"></div>
              <p>
                About Qlik playground. Lorum ipsum dolor sit amet.
                About Qlik playground. Lorum ipsum dolor sit amet.
                About Qlik playground. Lorum ipsum dolor sit amet.
              </p>
            </li>
            <li className="footer-block"><FooterList data={sites}/></li>
            <li className="footer-block"><FooterList data={sites}/></li>
            <li className="footer-block"><FooterList data={sites}/></li>
          </ul>
        </div>
        <div className="footer-company">
          <span>&copy; 1993-2016 Qliktech International Inc. | Powered by QIX engine | </span>
          <span className="lui-text-warning">Privacy policy</span>
          <span> | </span>
          <span className="lui-text-warning">Terms of service</span>
        </div>
      </div>
    )
  }
});

var FooterList = React.createClass({
  render: function(){
    var Link = ReactRouter.Link;
    var nodes = this.props.data.items.map(function(item){
      return (
        <li>{item.text}</li>
      );
    });
    return (
      <div className="footer-list">
        <span className="footer-list-header">{this.props.data.header}</span>
        <ul>
            {nodes}
        </ul>
      </div>
    )
  }
});

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

var Home = React.createClass({
  render: function(){
    return (
      <div>
        <Header />
        <div className="content">
          <h1>Home Page</h1>
        </div>
        <Footer />
      </div>
    )
  }
});

var Login = React.createClass({
  login: function(){
    $.get({
      url: "/auth/github",
      dataType: "jsonp",
      contentType: "text/html"
    })
    .success(function(data){
      console.log(data);
    });
  },
  render: function(){
    return (
      <div>
        <Header />
        <div className="content">
          <h1>Login Page</h1>
          <a href="/auth/github">Login</a>
        </div>
        <Footer />
      </div>
    )
  }
});

var Noobs = React.createClass({
  render: function(){
    return (
      <div>
        <Header />
        <div className="content">
          <h1>N00bs</h1>            
        </div>
        <Footer />
      </div>
    )
  }
});

var GettingStarted = React.createClass({
  render: function(){
    return (
      <div>
        <Header />
        <div className="content">
          <h1>Sample Apps</h1>
          <AppList url="/api/sampleapps"/>
        </div>
        <Footer />
      </div>
    )
  }
});

var Showcase = React.createClass({
  render: function(){
    return (
      <div>
        <Header />
          <div className="content">
            <h1>Showcase</h1>            
          </div>
          <Footer />
      </div>
    )
  }
});

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

