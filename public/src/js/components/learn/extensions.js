app.Extensions = ng.core
  .Component({
    selector: 'playground-extensions',
    templateUrl: '/views/learn/extensions.html',
    styles: [
      'iframe { width: 100%; margin-left: -35px; height: 100%; border: 0; }'
    ]
  })
  .Class({
    constructor: [
      ng.router.ActivatedRoute,
      ng.platformBrowser.DomSanitizationService,
      function(route, sanitizationService) {
        route.params.subscribe(params => {
            this.iframesrc = sanitizationService.bypassSecurityTrustResourceUrl(
                `https://qlik-branch.github.io/qlik-sense-extension-tutorial/${params.page}`
              )
        })
      }
    ]
  })
