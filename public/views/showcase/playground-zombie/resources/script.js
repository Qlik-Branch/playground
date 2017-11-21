// Input your config 
var config = {
	host: "playground.qlik.com",
	prefix: "/showcase/",
	port: "443",
	isSecure: true,
	rejectUnauthorized: false,
	appname: "59c5305d-2bbe-4370-bb1d-d7ea8432d49d"
};

function authenticate(){

    window.location.pathname = "/liveshowcase/playground-zombie/main.html";

  // return;
}

function main() {
  
  require.config({
    baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port: "") + config.prefix + "resources"
  });

  /**
   * Load the entry point for the Capabilities API family
   * See full documention: http://help.qlik.com/en-US/sense-developer/Subsystems/APIs/Content/MashupAPI/qlik-interface-interface.htm
   */

  require(['js/qlik'], function(qlik) {
    // We're now connected

    // Suppress Qlik error dialogs and handle errors how you like.
     qlik.setOnError( function ( error ) {
        console.log(error);
    });

    // Open a dataset on the server.  
    console.log("Connecting to appname: " + config.appname);
    var app = qlik.openApp(config.appname, config);
    
    //Clear button
    $(".clear-selections").click(function() {
	    app.clearAll();
	  });

    //Total walker kills KPI
    app.visualization.create('kpi', //viz type
      [{qDef: {qDef: "=Sum([Kills])", qLabel: "Total walker kills", qNumFormat: {qType: "I", qFmt: "##,###", qUseThou: true, qThou: ","}}}], //columns
      {} //options
    ).then(function(viz){
      viz.show('QV01');
    });

    //Average per episode KPI
    app.visualization.create('kpi', //viz type
      [{qDef: {qDef: "=if(GetSelectedCount(Characters)=0, Avg(Aggr(Sum([Kills]), [Episode Label])), if(Characters='Misc.', sum(Kills)/count(distinct {1} [Episode Label]), sum(Kills) / if(GetSelectedCount([Episode Label])=0, sum(Appearances), count(distinct [Episode Label]))))", qLabel: "Average per episode"}}], //columns
      {} //options
    ).then(function(viz){
      viz.show('QV02');
    });

    //Max in one episode KPI
    app.visualization.create('kpi', //viz type
      [{qDef: {qDef: "=Max(Aggr(Sum([Kills]), [Episode Label]))", qLabel: "Max in one episode"}}], //columns
      {} //options
    ).then(function(viz){
      viz.show('QV03');
    });

    //Walker kills per season barchart
    app.visualization.create('barchart', //viz type
      ["Season Label",{qDef: {qDef: "=Sum([Kills])", qLabel: "Kills"}}], //columns
      {title:"Walker kills per season", color: {auto: false, mode: "byMeasure", measureScheme: "sc"}} //options
    ).then(function(viz){
      viz.show('QV04');
    });

    //Walker kills per episode barchart
    app.visualization.create('barchart', //viz type
      ["Episode Label",{qDef: {qDef: "=Sum([Kills])", qLabel: "Kills"}}], //columns
      {title:"Walker kills per episode", color: {auto: false, mode: "byMeasure", measureScheme: "sc"}} //options
    ).then(function(viz){
      viz.show('QV05');
    });

    //Walker kills per character barchart
    app.visualization.create('barchart', //viz type
      ["Characters",{qDef: {qDef: "=Sum([Kills])", qLabel: "Kills"}}], //columns
      {title:"Walker kills per character", color: {auto: false, mode: "byMeasure", measureScheme: "sc"}} //options
    ).then(function(viz){
      viz.show('QV06');
    });


  });
};