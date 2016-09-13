app.FooterComponent = ng.core.Component({
  selector: 'playground-footer',
  directives: [ng.router.ROUTER_DIRECTIVES],
  templateUrl: '/views/footer.html'
})
.Class({
  constructor: function(){
    this.sites = {
      header: "Qlik Sites",
      items:[
        {
          text: "Qlik.com",
          link : "http://www.qlik.com"
        },
        {
          text: "Qlik Market",
          link : "http://market.qlik.com"
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
  }
});
