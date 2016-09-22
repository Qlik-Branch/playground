app.ListObject = ng.core.Component({
  selector: 'playground-vis-listobject',
  directives: [ng.router.ROUTER_DIRECTIVES],
  inputs: ['field:field'],
  templateUrl: '/views/vis/list-object.html'
}).Class({
  constructor: [ng.core.ChangeDetectorRef, app.QSocksService, app.PubSub, function(cdr, qsocksService, pubsub){
    this.cdr = cdr;
    this.qsocksService = qsocksService;
    this.pubsub = pubsub;
    this.field = "";
    this.listValues = [];
    this.genericObject;
  }],
  ngOnInit(){
    let def = {
      qInfo:{
        qType: "ListObject"
      },
      qListObjectDef:{
        qDef: {
          qFieldDefs:[  //the name of the field to load
            this.field
          ],
          qFieldLabels:[  //the label we want to give the field
            this.field
          ],
          qSortCriterias: [
            {
              qSortByState: 1 //we sort by state first asc
            },
            {
              qSortByAscii: 1 //and then text value asc
            }
          ]
        },
        qInitialDataFetch:[ //an array of data pages we want to fetch when we first call 'getLayout()' on the list object
          {
              qTop: 0,
              qLeft: 0,
              qWidth: 1,
              qHeight: 100
          }
        ]
      }
    }
    this.qsocksService.app.createSessionObject(def).then((genericObject)=>{
      this.pubsub.subscribe('update', genericObject.handle, this.getLayout.bind(this));
      this.pubsub.subscribe('loading', genericObject.handle, this.setLoading.bind(this));
      this.genericObject = genericObject;
      this.getLayout();
    });
  },
  clearAll(){

  },
  search(field, event){
    this.pubsub.publish('loading');
    if(event.keyCode === 13){
      //confirm the search
      event.target.value = "";
      this.genericObject.acceptListObjectSearch("/qListObjectDef", true).then((response)=>{
        this.pubsub.publish('update');
      });
    }
    else if (event.keyCode === 27 || event.target.value.length == 0) {
      //cancel the search
      event.target.value = "";
      this.genericObject.abortListObjectSearch("/qListObjectDef").then((response)=>{
        this.pubsub.publish('update');
      });
    }
    else{
      if(event.target.value.length > 0){
        this.genericObject.searchListObjectFor("/qListObjectDef", event.target.value).then((response)=>{
          this.pubsub.publish('update');
        });
      }
      else{
        this.genericObject.abortListObjectSearch("/qListObjectDef").then((response)=>{
          this.pubsub.publish('update');
        });
      }
    }
    console.log('searching');
  },
  clearSearch(field, event){
    this.pubsub.publish('loading');
    var inputEl = document.getElementById(field+"_search_input");
    if(inputEl){
      inputEl.value = "";
      this.genericObject.abortListObjectSearch("/qListObjectDef").then((response)=>{
        this.pubsub.publish('update');
      });
    }
  },
  clearFieldSelections(){
    this.pubsub.publish('loading');
    this.genericObject.clearSelections("/qListObjectDef").then((response)=>{
      this.pubsub.publish('update');
    });
  },
  setLoading(){
    var loadingEl = document.getElementById(this.field+"_listbox_loading");
    if(loadingEl){
      loadingEl.classList.add('loading');
    }
  },
  getLayout(){
    this.genericObject.getLayout().then((layout)=>{
      this.listValues = [];
      let matrix = layout.qListObject.qDataPages[0].qMatrix;
      matrix.forEach((row, index)=>{
        this.listValues.push(row[0]);
      });
      this.cdr.detectChanges();
      var loadingEl = document.getElementById(this.field+"_listbox_loading");
      if(loadingEl){
        loadingEl.classList.remove('loading');
      }
    });

  },
  toggleValue(elemNum, event){
    this.pubsub.publish('loading');
    this.genericObject.selectListObjectValues("/qListObjectDef", [parseInt(elemNum)], true).then((response)=>{
      event.target.parentElement.scrollTop = 0;
      this.pubsub.publish('update');
    });
  }
});
