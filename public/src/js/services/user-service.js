app.UserService =
ng.core.Injectable({

})
.Class({
  constructor: [ng.http.Http, function(http){
    this.http = http;
    this.user;
  }],
  getUser: function(force, callbackFn){
    if(!this.user || force===true){
      console.log('fetching user info from server');
      this.http.get('/server/currentuser').subscribe(response => {
        if(response._body!==""){
          response = JSON.parse(response._body)
          this.user = response;
          if(response.user){
            this.parseConnections();  
          }
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
  },
  parseConnections: function(callbackFn){
    this.user.myParsedConnections = {};
    this.user.runningAppCount = 0;
    for(let c=0;c<this.user.myConnections.length;c++){
      if(this.user.dataConnections[this.user.myConnections[c].connection]){
        this.user.dataConnections[this.user.myConnections[c].connection].authorised = true;
        this.user.myParsedConnections[this.user.myConnections[c].connection] = this.user.dataConnections[this.user.myConnections[c].connection];
        if(this.user.myConnections[c].appid){
          this.user.myParsedConnections[this.user.myConnections[c].connection].appid = this.user.myConnections[c].appid;
          this.user.runningAppCount++;
        }
      }
      else{
        this.user.dataConnections[this.user.myConnections[c].connection].authorised = false;
      }
    }
  }
});
