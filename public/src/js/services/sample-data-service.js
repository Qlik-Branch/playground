let SampleDataService =
ng.core.Injectable({

})
.Class({
  constructor: [ng.http.Http, function(http){
    this.http = http;
    this.sampleData;
  }],
  getSampleData: function(callbackFn){
    if(this.sampleData){
      callbackFn(this.sampleData);
    }
    else{
      this.http.get('/api/sampledata').subscribe(response => {
        if(response._body!==""){
          this.sampleData = JSON.parse(response._body);
          callbackFn(JSON.parse(response._body));
        }
        else{
          callbackFn();
        }
      });
    }
  }
});
