let UserService =
ng.core.Injectable({

})
.Class({
  constructor: [ng.http.Http, function(http){
    this.http = http;
  }],
  getUser: function(callbackFn){
    this.http.get('/api/currentuser').subscribe(response => {
      if(response._body!==""){
        callbackFn(JSON.parse(response._body));
      }
      else{
        callbackFn();
      }
    });
  },
  getUserConnections: function(callbackFn){
    this.http.get('/api/currentuserconnections').subscribe(response => {
      if(response._body!==""){
        callbackFn(JSON.parse(response._body));
      }
      else{
        callbackFn();
      }
    });
  }
});
