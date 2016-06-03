let ExampleAppService =
ng.core.Injectable({

})
.Class({
  constructor: [ng.http.Http, function(http){
    this.http = http;
    this.exampleApps;
  }],
  getExampleApps: function(callbackFn){
    if(this.exampleApps){
      callbackFn(this.exampleApps);
    }
    else{
      this.http.get('/configs/example-apps.json').subscribe(response => {
        if(response._body!==""){
          callbackFn(JSON.parse(response._body));
        }
        else{
          callbackFn();
        }
      });
    }
  }
});
