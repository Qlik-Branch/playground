let SampleDataService =
ng.core.Injectable({

})
.Class({
  constructor: [ng.http.Http, function(http){
    this.http = http;
    this.sampleData;
    this.sampleProjects;
  }],
  getSampleData: function(callbackFn){
    if(this.sampleData){
      callbackFn(this.sampleData);
    }
    else{
      this.http.get('/server/sampledata').subscribe(response => {
        if(response._body!==""){
          this.sampleData = JSON.parse(response._body);
          callbackFn(JSON.parse(response._body));
        }
        else{
          callbackFn();
        }
      });
    }
  },
  getSampleProjects: function(callbackFn){
    if(this.sampleProjects){
      callbackFn(this.sampleProjects);
    }
    else{
      this.http.get('/server/sampleprojects').subscribe(response => {
        if(response._body!==""){
          this.sampleProjects = JSON.parse(response._body);
          callbackFn(JSON.parse(response._body));
        }
        else{
          callbackFn();
        }
      });
    }
  }
});
