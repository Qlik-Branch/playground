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
