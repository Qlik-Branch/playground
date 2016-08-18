app.QSocksService = ng.core.Injectable({

})
.Class({
    constructor: [ng.http.Http, app.PubSub, function(http, pubsub){
      this.http = http;
      this.pubsub = pubsub;
      this.currentAppId;
      this.global;
      this.app;
      this.ticket;
    }],
    connect: function(config, callbackFn){
      if(this.currentAppId!=config.appname){
        if(this.currentAppId){
          this.disconnect();
        }
        this.currentAppId = config.appname;
      }
      if(!this.global){
        this.authenticate(config, (err, ticket)=>{
          if(err){
            callbackFn(err);
          }
          else{
            config.ticket = ticket;
            qsocks.ConnectOpenApp(config).then((result)=>{
              this.global = result[0];
              this.app = result[1];
              callbackFn(null, this.global, this.app);
            });
          }
        })
      }
      else{
        config.ticket = this.ticket;
        qsocks.ConnectOpenApp(config).then((result)=>{
          this.global = result[0];
          this.app = result[1];
          callbackFn(null, this.global, this.app);
        });
      }
    },
    authenticate: function(config, callbackFn){
      this.http.get('/api/ticket?apikey='+config.apiKey).subscribe((response)=>{
        if(response._body!==""){
          response = JSON.parse(response._body);
          config.ticket = response.ticket;
          callbackFn(null, response.ticket)
        }
        else{
          console.log('error getting ticket');
          callbackFn('error getting ticket');
        }
      });
    },
    disconnect: function(){
      if(this.app && this.app.connection){
        this.app.connection.close();
      }
    },

});
