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
  },
  {
    path: 'explorer',
    component: app.GenericDataDetailFieldExplorer
  },
  {
    path: 'delete',
    component: app.GenericDataDetailDelete
  }
];

let mainRoutes = [
  {
    path: '',
    component: app.Home
  },
  {
    path: 'learn',
    component: app.Learn,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'noobs'
      },
      {
        path: 'noobs',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'intro'
          },
          {
            path: 'intro',
            component: app.Noobs
          },
          {
            path: ':subject',
            component: app.APIContent
          }
        ]
      },
      {
        path: 'engine',
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
        path: ':tab',
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
  },
  {
    path: "login",
    component: app.Login
  },
  {
    path: "terms",
    component: app.Terms
  }
];

app.MainRoutingProvider = ng.router.RouterModule.forRoot(mainRoutes);
