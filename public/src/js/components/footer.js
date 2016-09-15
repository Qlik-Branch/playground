app.FooterComponent = ng.core.Component({
  selector: 'playground-footer',
  directives: [ng.router.ROUTER_DIRECTIVES],
  templateUrl: '/views/footer.html'
})
.Class({
  constructor: function(){
    this.sitesone = {
      header: "QLIK SITES",
      items:[
        {
          text: "Qlik.com",
          link : "http://www.qlik.com"
        },
        {
          text: "Qlik Cloud",
          link : "http://www.qlikcloud.com"
        },
        {
          text: "Qlik Community",
          link : "http://community.qlik.com"
        },
      ]
    }
    this.sitestwo = {
      header: "",
      items:[
        {
          text: "Partner Portal",
          link : "https://login.qlik.com/login.aspx?returnURL=%2fexternal%2fportal.aspx"
        },
        {
          text: "Qlik Support",
          link : "https://qliksupport.force.com/apex/QS_Home_Page"
        }
      ]
    }
    this.sitesthree = {
      header: "",
      items:[
        {
          text: "Qlik Market",
          link : "http://market.qlik.com"
        },
        {
          text: "Demo Site",
          link : "http://sense-demo.qlik.com"
        }
      ]
    }
  }
});
