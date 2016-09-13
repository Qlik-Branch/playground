app.Noobs = ng.core.Component({
  selector: 'playground-noobs',
  templateUrl: '/views/noobs.html'
})
.Class({
  constructor: [ng.core.ChangeDetectorRef, app.DataConnectionService, app.QSocksService, function(cdr, dataConnectionService, qsocksService){
    this.cdr = cdr;
    this.dataConnectionService = dataConnectionService;
    this.qsocksService = qsocksService;
    this.fields = [];
    this.dataConnectionService.getConnectionInfo("noobs", (connInfo)=>{
        this.qsocksService.connect(connInfo, (err, global, app)=>{
          if(err){
            this.connectionStatus = "Error!";
            this.connectionDetail = err;
          }
          if(app){
            this.fields = [
              "Doctor",
              "Patient",
              "Drug",
              "Cost"
            ]
            this.cdr.detectChanges();
          }
        });
    });
  }]
});
