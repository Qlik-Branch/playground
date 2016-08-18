app.Showcase = ng.core.Component({
  selector: 'playground-showcase',
  templateUrl: '/views/showcase.html'
})
.Class({
  constructor: [app.DataConnectionService, app.UserService, function(dataConnectionService, userService){
    this.dataConnectionService = dataConnectionService;
    this.userService = userService;
    this.items;
    this.itemKeys;
    this.apiKey;
    this.userService.getUser(false, user=>{
      this.apiKey = user.user.apiKey;
    });
    this.dataConnectionService.getShowcaseItems(items=>{
      this.items = items;
      this.itemKeys = Object.keys(items);
      this.userService.getUserConnections(connections=>{
        let connectionList = connections.connections;
        for(let i in this.items){
          if(this.items[i].ownData){
            for(let c in connectionList){
              if(this.items[i].connectionId == connectionList[c].connection){
                if(connectionList[c].appid){
                  this.items[i].canUseOwnData = true;
                  this.items[i].appid = connectionList[c].appid;
                }
                break;
              }
            }
          }
        }
      });
    });
  }]
});
