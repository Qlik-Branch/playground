ng.router.Routes([
  {
    path: "/",
    component: playground.home,
    useAsDefault: true
  },
  {
    path: "/gettingstarted",
    component: playground.gettingStarted
  },
  {
    path: '/**',
    redirectTo: ['/']
  }
]);
