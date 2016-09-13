include "./components/base.js"
include "./components/playground-notifier.js"

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
