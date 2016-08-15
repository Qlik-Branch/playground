// app.FooterList = ng.core.Component({
//   selector: 'playground-footer-list',
//   inputs: ['data:data'],
//   directives: [ng.router.ROUTER_DIRECTIVES],
//   templateUrl: '/views/footer-list.html'
// })
// .Class({
//   constructor: function(){
//
//   }
// });

app.FooterList = (function(){
  function FooterList(){

  }
  FooterList.data = [];
});

app.FooterList.annotations = [
  new ng.core.Component({
    selector: 'playground-footer-list',
    inputs: ['data:data'],
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/footer-list.html'
  })
];
