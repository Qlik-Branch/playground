app.Noobs = ng.core.Component({
  selector: 'playground-noobs',
  templateUrl: '/views/learn/noobs.html'
})
.Class({
  constructor: [ng.core.ChangeDetectorRef, app.DataConnectionService, app.QSocksService, function(cdr, dataConnectionService, qsocksService){
    this.cdr = cdr;
    this.dataConnectionService = dataConnectionService;
    this.qsocksService = qsocksService;
    this.fields = [];
    this.loading = true;
    this.connectionStatus = "Please wait...";
    this.connectionDetail = "Connecting";
    this.dataConnectionService.getConnectionInfo("noobs", (connInfo)=>{
        this.qsocksService.connect(connInfo, (err, global, app)=>{
          if(err){
            this.connectionStatus = "Error!";
            this.connectionDetail = err;
          }
          if(app){
            this.loading = false;
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
