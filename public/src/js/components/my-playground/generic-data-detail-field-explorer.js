app.GenericDataDetailFieldExplorer = ng.core.Component({
  selector: 'playground-my-playground-generic-data-detail-field-explorer',
  directives: [ng.router.ROUTER_DIRECTIVES],
  templateUrl: '/views/my-playground/generic-data-detail-field-explorer.html'
})
.Class({
  constructor: [ng.router.ActivatedRoute, ng.core.ChangeDetectorRef, app.UserService, app.DataConnectionService, app.QSocksService, function(route, cdr, userService, dataConnectionService, qsocksService){
    this.userService = userService;
    this.dataConnectionService = dataConnectionService;
    this.qsocksService = qsocksService;
    this.cdr = cdr;
    this.connectionStatus = "Please wait...";
    this.connectionDetail = "Connecting";
    this.connectionId = route.parent.url.value[0].path;
    this.loading = true;
    this.fields = {};
    this.fieldKeys;
    this.selectedFields = [];
    this.userService.getUser(false, (user)=>{
      this.dataConnectionService.getConnectionInfo(this.connectionId, (connInfo)=>{
          this.qsocksService.connect(connInfo, (err, global, app)=>{
            if(err){
              this.connectionStatus = "Error!";
              this.connectionDetail = err;
            }
            if(app){
              let fieldListDef = {
                qInfo:{
                  qType: "FieldList"
                },
                qFieldListDef: {}
              }
              app.createSessionObject(fieldListDef).then((fieldsObject)=>{
                fieldsObject.getLayout().then((layout)=>{
                  this.loading = false;
                  layout.qFieldList.qItems.forEach((item, index)=>{
                    this.fields[item.qName]={ selected: false};
                  });
                  console.log(this.fields);
                  this.fieldKeys = Object.keys(this.fields).sort();
                  this.cdr.detectChanges();
                });
              });
            }
          })
      });

    });
  }],
  toggleField: function(field){
    let fieldIndex = this.selectedFields.indexOf(field);
    if(fieldIndex==-1){
      this.selectedFields.push(field);
    }
    else{
      this.selectedFields.splice(fieldIndex, 1);
    }
  }
})
