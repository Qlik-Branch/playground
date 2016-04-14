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
        <div>Login Page</div>
        <a href="/auth/github">Login</a>
      </div>
    )
  }
});
