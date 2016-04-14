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
