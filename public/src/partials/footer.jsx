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
