app.DataConnectionService =
ng.core.Injectable({

})
.Class({
  constructor: [ng.http.Http, function(http){
    this.http = http;
    this.data;
    this.showcaseItems;
  }],
  getDataConnections: function(force, callbackFn){
    if(!this.data || force===true){
      this.http.get('/server/dataconnections').subscribe(response => {
        if(response._body!==""){
          response = JSON.parse(response._body);
          this.data = response;
          callbackFn(this.data);
        }
        else{
          callbackFn();
        }
      });
    }
    else{
      callbackFn(this.data);
    }
  },
  getConnectionInfo: function(connectionId, callbackFn){
    this.http.get('/server/connectioninfo/'+connectionId).subscribe(response => {
      if(response._body!==""){
        callbackFn(JSON.parse(response._body));
      }
      else{
        callbackFn();
      }
    });
  },
  getShowcaseItems: function(callbackFn){
    if(!this.showcaseItems){
      this.http.get("/server/showcaseitems").subscribe(response=>{
        this.showcaseitems = JSON.parse(response._body)
        callbackFn(this.showcaseitems);
      });
    }
    else {
      callbackFn(this.showcaseItems);
    }
  },
  authoriseConnection: function(connectionId, callbackFn){
    this.http.post("/server/authorise/"+connectionId).subscribe(response => {
      callbackFn(JSON.parse(response._body));
    });
  },
  startApp: function(connectionId, callbackFn){
    this.http.get("/server/startapp/"+connectionId).subscribe(response => {
      callbackFn(JSON.parse(response._body));
    });
  },
  stopApp: function(connectionId, callbackFn){
    this.http.get("/server/stopapp/"+connectionId).subscribe(response => {
      callbackFn(JSON.parse(response._body));
    });
  },
  reloadApp: function(connectionId, callbackFn){
    this.http.get("/server/reloadapp/"+connectionId).subscribe(response => {
      callbackFn(JSON.parse(response._body));
    });
  },
  deleteConnection: function(connectionId, callbackFn){
    this.http.get("/server/deleteconnection/"+connectionId).subscribe(response => {
      callbackFn(JSON.parse(response._body));
    });
  }

});
