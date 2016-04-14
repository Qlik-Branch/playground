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
