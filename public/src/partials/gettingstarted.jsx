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
