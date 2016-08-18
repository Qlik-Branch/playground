app.PubSub = ng.core.Injectable({

})
.Class({
  constructor: [function(){
    this.publications = {};
  }],
  subscribe(publication, subscriber, fn){
    if(!this.publications[publication]){
      this.publications[publication] = {
        subscribers: {}
      }
    }
    this.publications[publication].subscribers[subscriber] = fn;
  },
  publish(publication, params){
    if(this.publications[publication]){
      for(let s in this.publications[publication].subscribers){
        this.publications[publication].subscribers[s].call(null, params);
      }
    }
  }
})
