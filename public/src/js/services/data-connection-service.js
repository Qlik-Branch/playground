app.DataConnectionService =
ng.core.Injectable({

})
.Class({
  constructor: [ng.http.Http, function(http){
    this.http = http;
    this.data;
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
  getConnectionDictionary: function(index, callbackFn){
    if(this.dataConnections){
      var dictionaryUrl = this.dataConnections[index].dictionary;
      this.http.get(dictionaryUrl).subscribe(response => {
        callbackFn(JSON.parse(response._body));
      });
    }
    else{
      this.getDataConnections((response)=>{
        var dictionaryUrl = this.dataConnections[index].dictionary;
        this.http.get(dictionaryUrl).subscribe(response => {
          callbackFn(JSON.parse(response._body));
        });
      });
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
  }

});
