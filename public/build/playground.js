"use strict";

var Header = React.createClass({
  displayName: "Header",

  render: function render() {
    var Link = ReactRouter.Link;
    return React.createElement(
      "div",
      { className: "header" },
      React.createElement(
        "ul",
        { role: "nav", className: "navmenu" },
        React.createElement(
          "li",
          { "class": "home" },
          React.createElement(
            Link,
            { activeClassName: "active", to: "/" },
            React.createElement("span", { className: "lui-icon lui-icon--home" })
          )
        ),
        React.createElement(
          "li",
          null,
          React.createElement(
            Link,
            { activeClassName: "active", to: "/noobs" },
            "Qlik for noobs"
          )
        ),
        React.createElement(
          "li",
          null,
          React.createElement(
            Link,
            { activeClassName: "active", to: "/gettingstarted" },
            "Getting started"
          )
        ),
        React.createElement(
          "li",
          null,
          React.createElement(
            Link,
            { activeClassName: "active", to: "/showcase" },
            "Showcase"
          )
        )
      ),
      React.createElement(
        "div",
        { className: "loginmenu" },
        React.createElement(
          "button",
          { className: "lui-button  lui-button--inverse" },
          React.createElement(
            "span",
            { className: "lui-button__text" },
            "Qlik"
          ),
          React.createElement("span", { className: "lui-button__caret  lui-caret" })
        ),
        React.createElement(
          "button",
          { className: "lui-button lui-button--warning" },
          React.createElement(
            Link,
            { to: "/login" },
            "Login"
          )
        )
      )
    );
  }
});

var Footer = React.createClass({
  displayName: "Footer",

  render: function render() {
    var Link = ReactRouter.Link;
    var sites = {
      header: "Qlik Sites",
      items: [{
        text: "Qlik.com",
        link: "http://www.qlik.com"
      }, {
        text: "Qlik Community",
        link: "http://community.qlik.com"
      }, {
        text: "Qlik Cloud",
        link: "http://www.qlikcloud.com"
      }]
    };
    return React.createElement(
      "div",
      { className: "footer" },
      React.createElement(
        "div",
        { className: "footer-main" },
        React.createElement(
          "ul",
          { className: "footer-block-container" },
          React.createElement(
            "li",
            { className: "footer-block" },
            React.createElement("div", { className: "footer-logo" }),
            React.createElement(
              "p",
              null,
              "About Qlik playground. Lorum ipsum dolor sit amet. About Qlik playground. Lorum ipsum dolor sit amet. About Qlik playground. Lorum ipsum dolor sit amet."
            )
          ),
          React.createElement(
            "li",
            { className: "footer-block" },
            React.createElement(FooterList, { data: sites })
          ),
          React.createElement(
            "li",
            { className: "footer-block" },
            React.createElement(FooterList, { data: sites })
          ),
          React.createElement(
            "li",
            { className: "footer-block" },
            React.createElement(FooterList, { data: sites })
          )
        )
      ),
      React.createElement(
        "div",
        { className: "footer-company" },
        React.createElement(
          "span",
          null,
          "© 1993-2016 Qliktech International Inc. | Powered by QIX engine | "
        ),
        React.createElement(
          "span",
          { className: "lui-text-warning" },
          "Privacy policy"
        ),
        React.createElement(
          "span",
          null,
          " | "
        ),
        React.createElement(
          "span",
          { className: "lui-text-warning" },
          "Terms of service"
        )
      )
    );
  }
});

var FooterList = React.createClass({
  displayName: "FooterList",

  render: function render() {
    var Link = ReactRouter.Link;
    var nodes = this.props.data.items.map(function (item) {
      return React.createElement(
        "li",
        null,
        item.text
      );
    });
    return React.createElement(
      "div",
      { className: "footer-list" },
      React.createElement(
        "span",
        { className: "footer-list-header" },
        this.props.data.header
      ),
      React.createElement(
        "ul",
        null,
        nodes
      )
    );
  }
});

var AppList = React.createClass({
  displayName: "AppList",

  getApps: function getApps() {
    $.get({
      url: this.props.url,
      success: function (data) {
        this.setState({ data: data });
      }.bind(this)
    });
  },
  getInitialState: function getInitialState() {
    return { data: [] };
  },
  componentDidMount: function componentDidMount() {
    this.getApps();
  },
  render: function render() {
    var nodes = this.state.data.map(function (app, i) {
      return React.createElement(
        "div",
        { className: "app-summary", key: i },
        app.name
      );
    });
    return React.createElement(
      "div",
      { className: "app-list" },
      nodes
    );
  }
});

var Home = React.createClass({
  displayName: "Home",

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(Header, null),
      React.createElement(
        "div",
        null,
        "Home Page"
      )
    );
  }
});

var Login = React.createClass({
  displayName: "Login",

  login: function login() {
    $.get({
      url: "/auth/github",
      dataType: "jsonp",
      contentType: "text/html"
    }).success(function (data) {
      console.log(data);
    });
  },
  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(Header, null),
      React.createElement(
        "div",
        null,
        "Login Page"
      ),
      React.createElement(
        "a",
        { href: "/auth/github" },
        "Login"
      )
    );
  }
});

var Noobs = React.createClass({
  displayName: "Noobs",

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(Header, null),
      React.createElement(
        "div",
        null,
        "Noobs"
      )
    );
  }
});

var GettingStarted = React.createClass({
  displayName: "GettingStarted",

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(Header, null),
      React.createElement(
        "div",
        { className: "content" },
        React.createElement(
          "h1",
          null,
          "Sample Apps"
        ),
        React.createElement(AppList, { url: "/api/sampleapps" })
      ),
      React.createElement(Footer, null)
    );
  }
});

var Showcase = React.createClass({
  displayName: "Showcase",

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(Header, null),
      React.createElement(
        "div",
        null,
        "Showcase"
      )
    );
  }
});

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var hashHistory = ReactRouter.hashHistory;

var PlaygroundRouter = React.createClass({
  displayName: "PlaygroundRouter",

  render: function render() {
    return React.createElement(
      Router,
      { history: hashHistory },
      React.createElement(Route, { path: "/", component: Home }),
      React.createElement(Route, { path: "/login", component: Login }),
      React.createElement(Route, { path: "/noobs", component: Noobs }),
      React.createElement(Route, { path: "/gettingstarted", component: GettingStarted }),
      React.createElement(Route, { path: "/showcase", component: Showcase })
    );
  }
});
ReactDOM.render(React.createElement(PlaygroundRouter, null), document.getElementById('app'));
