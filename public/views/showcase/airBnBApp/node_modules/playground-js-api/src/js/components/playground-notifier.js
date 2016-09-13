class PlaygroundNotifier extends PlaygroundComponentBase{
  constructor(id, options={}){
    super(id, options, "playground-notifier");
    Playground.notification.subscribe(this.onNotification.bind(this));
  }
  onNotification(options){
    this.show(options);
  }
  show(options){  //duration is in milli seconds
    let defaults = {
      sentiment: "info",
      title: "",
      message: ""
    }
    let settings = Object.assign({}, defaults, options);
    let html = this.messageHTML
                  .replace(/{sentiment}/gim, settings.sentiment)
                  .replace(/{title}/gim, settings.title)
                  .replace(/{message}/gim, settings.message);
    document.getElementById(this.id).classList.add('open');
    document.getElementById(this.id+'_message').innerHTML = html;
    if(settings.duration){
      setTimeout(()=>{
        this.hide();
      }, settings.duration)
    }
  }
  hide(){
    document.getElementById(this.id).classList.remove('open');
    document.getElementById(this.id+'_message').innerHTML = "";
  }
  get templateHTML(){
    return `
      <div id='{id}_notifier' class='playground-notifier-inner-container grey fog-bg'>
        <div id='{id}_loading' class='loading'>&#60;&nbsp;&#62;</div>
        <div id='{id}_message' class='message-container'></div>
      <div>
    `
  }
  get messageHTML(){
    return `
      <div data-sentiment={sentiment}>
        <div class='notifier-title'>{title}</div>
        <div class='notifier-message'>{message}</div>
      </div>
    `
  }
}
