var ConfigService =
    ng.core.Injectable({

        })
        .Class({
            constructor: [ng.http.Http, function(http){
                this.http = http;
            }],
            getConfigs: function(callbackFn){
                this.http.get('/server/configs').subscribe(response => {
                    if(response._body!==""){
                    callbackFn(JSON.parse(response._body));
                }
                else{
                    callbackFn();
                }
            });
            }
        });
