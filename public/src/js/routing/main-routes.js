let genericDataDetailRoutes = [
  {
    path: '',
    redirectTo: 'gettingstarted',
    pathMatch: 'full'
  },
  {
    path: 'gettingstarted',
    component: app.GenericDataDetailGettingStarted
  },
  {
    path: 'templates',
    component: app.GenericDataDetailTemplates
  }
];

let mainRoutes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: "home",
    component: app.Home
  },
  {
    path: "noobs",
    component: app.Noobs
  },
  {
    path: 'apis',
    component: app.Apis,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'engine'
      },
      {
        path: 'engine',
        component: app.Engine,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'overview'
          },
          {
            path: ':subject',
            component: app.APIContent
          }
        ]
      },
      {
        path: 'capability',
        component: app.Capability,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'overview'
          },
          {
            path: ':subject',
            component: app.APIContent
          }
        ]
      }
    ]
  },
  {
    path: 'myplayground',
    component: app.MyPlayground,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'mydata'
      },
      {
        path: 'mydata',
        component: app.MyPlaygroundMyData,
        children: [
          {
            path: '',
            component: app.MyDataList
          },
          {
            path: ':id',
            component: app.GenericDataDetail,
            children: genericDataDetailRoutes
          }
        ]
      },
      {
        path: 'sampledata',
        component: app.MyPlaygroundSampleData,
        children: [
          {
            path: '',
            component: app.SampleDataList
          },
          {
            path: ':id',
            component: app.GenericDataDetail,
            children: genericDataDetailRoutes
          }
        ]
      },
      {
        path: 'connect',
        component: app.MyPlaygroundConnect
      }
    ]
  },
  {
    path: "showcase",
    component: app.Showcase
  }
];

app.MainRoutingProvider = ng.router.RouterModule.forRoot(mainRoutes);
