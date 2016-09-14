class PlaygroundComponentBase{
  constructor(id, options={}, className){
    let element = document.createElement('div');
    element.id = id;
    element.classList.add(className);
    this.id = id;
    var html = this.templateHTML.replace(/{id}/gim, id);
    element.innerHTML = html;
    this.settings = Object.assign({}, this.defaults, options);
    let oldElement = document.getElementById(id);
    for(let i=0;i<oldElement.classList.length;i++){
      element.classList.add(oldElement.classList[i]);
    }
    if (oldElement) {
        if (oldElement.insertAdjacentElement) {
            oldElement.insertAdjacentElement("afterEnd", element);
        } else {
            oldElement.insertAdjacentHTML("afterEnd", element.outerHTML);
        }
        for (let i = 0; i < oldElement.attributes.length; i++) {
            this[oldElement.attributes[i].name] = oldElement.attributes[i].value;
        }
        oldElement.parentNode.removeChild(oldElement);
    }
    this.elementHTML = element.outerHTML;
    return this;
  }
  get templateHTML(){
    return `

    `
  }
  get defaultSettings(){
    return {}
  }
  set defaultSettings(value){

  }
  get settings(){
    return {}
  }
  set settings(value){

  }
}

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


class PlaygroundUI{
  constructor(){
    this.components = {};
    let uiComponents = document.getElementsByTagName('playground');
    for(let i=0;i<uiComponents.length;){
      let componentType = uiComponents[i].attributes["component"].value;
      let id = uiComponents[i].id;
      switch(componentType){
        case "notifier":
          let component = new PlaygroundNotifier(id);
          this.components[id] = component;
          break;
      }
    };
  }
}

var playgroundUI = new PlaygroundUI();
