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
      this.genericObject = genericObject;
      this.getLayout();
    });
  },
  clearAll(){

  },
  search(){

  },
  getLayout(){
    this.listValues = [];
    this.genericObject.getLayout().then((layout)=>{
      let matrix = layout.qListObject.qDataPages[0].qMatrix;
      matrix.forEach((row, index)=>{
        this.listValues.push(row[0]);
      });
      this.cdr.detectChanges();
    });

  },
  toggleValue(elemNum){
    this.genericObject.selectListObjectValues("/qListObjectDef", [parseInt(elemNum)], true).then((response)=>{
      this.pubsub.publish('update');
    });
  }
});

// app.ListObject = (function(){
//   function ListObject(){
//
//   }
//   ListObject.prototype = Object.create(Object.prototype({
//     field: {
//       writable: true,
//       value: null
//     },
//
//   }));
// });
//
// app.ListObject.annotations = [
//   new ng.core.Component({
//     selector: 'playground-vis-listobject',
//     inputs: ['field:field'],
//     templateUrl: '/views/vis/list-object.html'
//   })
// ];
