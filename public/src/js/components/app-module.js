app.AppModule = ng.core.NgModule({
  imports: [ ng.platformBrowser.BrowserModule, app.MainRoutingProvider],
  declarations: [
    app.AppComponent,
    app.Header,
    app.FooterComponent,
    app.FooterList,
    app.Home,
    app.Noobs,
    app.Extensions,
    app.Engine,
    app.Learn,
    app.Terms,
    app.APIContent,
    app.reInvent,
    app.MyPlayground,
    app.MyPlaygroundMyData,
    app.MyDataList,
    app.GenericDataDetail,
    app.GenericDataDetailDelete,
    app.GenericDataDetailGettingStarted,
    app.GenericDataDetailTemplates,
    app.GenericDataDetailFieldExplorer,
    app.GenericDataDetail,
    app.Showcase,
    app.ListObject,
    app.Login
  ],
  providers: [
    ng.http.HTTP_PROVIDERS,
    app.ResourceCenterService,
    app.UserService,
    app.DataConnectionService,
    app.QSocksService,
    app.PubSub
  ],
  bootstrap: [ app.AppComponent ]
})
.Class({
  constructor: function() {}
});
