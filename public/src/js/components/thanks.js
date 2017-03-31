app.Thanks = ng.core.Component({
  selector: 'playground-thanks',
  templateUrl: '/views/thanks.html'
})
.Class({
  constructor: [app.UserService, ng.router.ActivatedRoute, ng.router.Router, function(userService, route, router){
    this.trackingPixel
    userService.getUser(false, (user)=>{
      if(!user.user){
        router.navigate(["/login"])
      } else {
        userService.playgroundVisited(result => {
          if(result == null || result === false) {
            router.navigate(["/myplayground"])
          } else {
            var axel = Math.random()+"";
            var a = axel * 10000000000000;
            this.trackingPixel = `https://pubads.g.doubleclick.net/activity;xsp=212190;ord=${a}?`
          }
        })
      }
    })
  }]
});
