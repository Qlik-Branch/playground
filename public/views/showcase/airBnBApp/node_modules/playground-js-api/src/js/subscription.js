class PSubscription{
  constructor(){
    this.callbackList = [];
  }
  subscribe(fn){
    this.callbackList.push(fn);
  }
  deliver(args){
    this.callbackList.forEach(function(item, index){
      item(args);
    });
  }
}
