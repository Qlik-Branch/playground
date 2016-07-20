let UserService =
ng.core.Injectable({

})
.Class({
  constructor: [ng.http.Http, function(http){
    this.http = http;
    this.user;
  }],
  getUser: function(callbackFn){
    if(!this.user){
      console.log('fetching user info from server');
      this.http.get('/server/currentuser').subscribe(response => {
        if(response._body!==""){
          this.user = JSON.parse(response._body);
          callbackFn(this.user);
        }
        else{
          callbackFn();
        }
      });
    }
    else{
      callbackFn(this.user);
    }
  },
  getUserConnections: function(callbackFn){
    this.http.get('/server/currentuserconnections').subscribe(response => {
      if(response._body!==""){
        callbackFn(JSON.parse(response._body));
      }
      else{
        callbackFn();
      }
    });
  }
});
