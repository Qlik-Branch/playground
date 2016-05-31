var GettingStarted = ng.core.Component({
  selector: 'playground-getting-started',
  viewProviders: [ng.http.HTTP_PROVIDERS],
  templateUrl: '/views/getting-started.html'
})
.Class({
  constructor: [ng.http.Http, function(http){
    http.get('/api/sampleapps').subscribe(response => {
      this.apps = JSON.parse(response._body);
    });
  }]
})
