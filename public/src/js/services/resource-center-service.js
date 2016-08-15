app.ResourceCenterService = ng.core.Injectable({

})
.Class({
    constructor: [ng.http.Http, function(http){
        this.http = http;
    }],
    getResource: function(id, callbackFn){
        this.http.get('/server/resource/'+id).subscribe(response => {
          if(response._body!==""){
            callbackFn(JSON.parse(response._body));
          }
          else{
            callbackFn();
          }
        });
    }
});
