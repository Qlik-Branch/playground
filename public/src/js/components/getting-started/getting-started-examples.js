var GettingStartedExamples = ng.core.Component({
  selector: 'playground-getting-started-examples',
  directives: [],
  viewProviders: [],
  templateUrl: '/views/getting-started/getting-started-examples.html'
})
.Class({
  constructor: [ng.http.Http, function(http){
    http.get('/api/sampleapps').subscribe(response => {
      this.apps = JSON.parse(response._body);
    });
  }]
})
