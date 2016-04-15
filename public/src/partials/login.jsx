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
