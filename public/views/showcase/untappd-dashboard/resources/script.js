var config={
	host:"playground.qlik.com",
  prefix: "/showcase/",
	port:"443",
	isSecure:true,
	rejectUnauthorized:false,
	appname:"b7855f25-2c3f-48ef-801c-33bcd4b2df36"
};

function gup( name, url ) {
  if (!url) url = location.href;
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  return results == null ? null : results[1];
}
// gup('q', 'hxxp://example.com/?q=abc')

function authenticate(){
  var apiKey = gup('apikey');
  var appid = gup('appid');
  if(apiKey){
    config.prefix = "/playground/";
    config.apiKey = apiKey;
    config.appname = appid;
    config.redirectUrl = window.location.origin + window.location.pathname;
  }
  // return;
  Playground.authenticate(config);
}


function main(){
  var apiKey = gup('apikey');
  var appid = gup('appid');
  if(apiKey){
    config.prefix = "/playground/";
    config.apiKey = apiKey;
    config.appname = appid;
  }
	Playground.notification.deliver({
		title: "Please wait...",
		message: "Connecting"
	});
  require.config({
    baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port: "") + config.prefix + "resources",
  });

  require(['js/qlik'], function(qlik) {
		Playground.notification.deliver({
			title: "Ready",
			message: "Connecting",
			duration: 200
		});
    qlik.setOnError( function ( error ) {
      console.log(error);
			Playground.notification.deliver({
				title: "Error",
				message: error
			});
    });
    console.log(qlik);
    var app = qlik.openApp(config.appname, config);
    console.log(app);

    //create the definition for a qsSimpleKPI object (visualization extension)
    //to show the distinct beer count
    var dbDef = {
      qInfo:{
        qType: "qsSimpleKPI"
      },
      qHyperCubeDef:{
        qMeasures:[{
          qDef:{
            qDef: "=Count(DISTINCT Beer)",
            hideLabel: true
          }
        }],
        qInitialDataFetch:[{
          qTop: 0,
          qLeft: 0,
          qHeight: 1,
          qWidth: 1
        }]
      },
      showTitles: false,
      options:{
        autoSize: true
      }
    }

    //using the capability api we create a new 'qsSimpleKPI' object
    app.createGenericObject(dbDef).then(function(model){
      app.getObject("distinctBeers", model.id);
    });

    //create the definition for a qsSimpleKPI object (visualization extension)
    //to show the distinct brewery count
    var dbrDef = {
      qInfo:{
        qType: "qsSimpleKPI"
      },
      qHyperCubeDef:{
        qMeasures:[{
          qDef:{
            qDef: "=Count(DISTINCT Brewery)",
            hideLabel: true
          }
        }],
        qInitialDataFetch:[{
          qTop: 0,
          qLeft: 0,
          qHeight: 1,
          qWidth: 1
        }]
      },
      showTitles: false,
      options:{
        autoSize: true
      }
    }

    //using the capability api we create a new 'qsSimpleKPI' object
    app.createGenericObject(dbrDef).then(function(model){
      app.getObject("distinctBreweries", model.id);
    });

    //create the definition for a br.com.clever.wordcloud object (visualization extension)
    //to show the different beer styles
    var wcDef = {
      qInfo:{
        qType: "br.com.clever.wordcloud"
      },
      qHyperCubeDef:{
        qDimensions:[{
          qDef:{
            qFieldDefs:["[Beer Style]"]
          }
        }],
        qMeasures:[{
          qDef:{
            qDef: "=Count(DISTINCT checkin_id)",
            hideLabel: true
          },
          qSortBy: {
            qSortByNumeric: -1,
          }
        }],
        qInitialDataFetch:[{
          qTop: 0,
          qLeft: 0,
          qHeight: 20,
          qWidth: 2
        }],
        qInterColumnSortOrder: [1,0]
      },
      showTitles: false,
      MaxSize: 80,
      MinSize: 25,
      Orientations: 3,
      RadEnd: 90,
      RadStart: -90,
      Scale: "linear",
      ScaleColor: "category20"
    }

    //using the capability api we create a new 'br.com.clever.wordcloud' object
    app.createGenericObject(wcDef).then(function(model){
      app.getObject("wordCloud", model.id);
    });

    //create the definition for a CircularKPI object (visualization extension)
    //to show the top 5 beer styles
    var srDef = {
      qInfo:{
        qType: "CircularKPI"
      },
      qHyperCubeDef:{
        qDimensions:[{
          qDef:{
            qFieldDefs:["[Beer Style]"]
          }
        }],
        qMeasures:[
          {
            qDef:{
              qDef: "=Num(Avg(Rating)/5,'#,##0.00')",
              hideLabel: true
            },
            qSortBy: {
              "qSortByNumeric": -1,
            }
          },
          {
            qDef:{
              qDef: "=Num(Avg(Rating),'#,##0.00')",
              hideLabel: true
            },
            qSortBy: {
              qSortByNumeric: -1,
            }
          },
        ],
        qInitialDataFetch:[{
          qTop: 0,
          qLeft: 0,
          qHeight: 5,
          qWidth: 3
        }],
        qInterColumnSortOrder: [1,2,0]
      },
      showTitles: false,
      showdecimals: true,
      showPercentage: false,
      singlekpilabel: "",
      columns: 5,
      rows: 1,
      theme: [
        "#F8B195", "#F67280", "#C06C84", "#6C5B7B", "#355C7D"
      ]
    }

    //using the capability api we create a new 'CircularKPI' object
    app.createGenericObject(srDef).then(function(model){
      app.getObject("styleRatings", model.id);
    });


    //create the definition for a MGOImageGridv3 object (visualization extension)
    //to show some badges
    var badgeDef = {
      qInfo:{
        qType: "MGOImageGridv3"
      },
      qDef:{
        IMGBORDER: 0,
        IMGBORDERDEFCOL: "FFF",
        IMGBORDERDEFSIZE: 0,
        IMGHEIGHT: 120,
        IMGLINK: true,
        IMGLINKPOPLINK: "",
        IMGLINKPOPLINKTOG: false,
        IMGMEASDISPLAYSTYLE: false,
        IMGMEASDISPLAYSTYLEBARCOL1: "FFF",
        IMGMEASDISPLAYSTYLEBARCOL2: "FFF",
        IMGMEASGRIDDISPLAYTOG: true,
        IMGOBGCOL: false,
        IMGOBGCOLVAL: "FFF",
        IMGOPACITY: false,
        IMGOPACITYTYPE: "n",
        IMGOPACITYVAL: 100,
        IMGPAGING: false,
        IMGPAGINGSIZE: 100,
        IMGPAGINGTOG: false,
        IMGSCALEGRIDOPT: "a",
        IMGSIZING: true,
        IMGSRCLOCALMGO: "folder name",
        IMGSRCMGO: "",
        IMGSRCTYPEMGO: true,
        IMGWIDTH: 120,
        SINGLEIMGDISPLAY: true,
        SINGLEIMGDISPLAYOPT: "w",
        SINGLEIMGHEADER: true,
        SINGLEIMGLINKCUSTOM: false,
        SINGLEIMGLINKCUSTOMLINK: "",
        SINGLEIMGLINKCUSTOMNAME: "",
        SINGLEIMGLINKCUSTOMSOURCEHTML: "",
        SINGLEIMGLINKCUSTOMSOURCETOG: false,
        SINGLEIMGLINKCUSTOMSOURCETYPE: true,
        SINGLEIMGLINKCUSTOMSOURCEURL: "",
        SINGLEIMGMEASURE: false
      },
      qHyperCubeDef:{
        qDimensions:[{
            qDef:{
              qFieldDefs:[
                "[Badge Image Small]"
              ]
            }
        }],
        qInitialDataFetch:[{
          qTop: 0,
          qLeft: 0,
          qHeight: 8,
          qWidth: 1
        }]
      }
    }

    //using the capability api we create a new 'MGOImageGridv3' object
    app.createGenericObject(badgeDef).then(function(model){
      app.getObject("badges", model.id);
    });
  });

}
