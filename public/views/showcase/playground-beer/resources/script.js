// Input your config 
var config = {};

function authenticate() {
  Playground.authenticate(config);
};

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

    //set clearAll onclick on clear selections buttons
    $(document).ready(function() {
      $(".clear-all").click(function() {
        app.clearAll();
      });
    });

    //Consumption by volume and country barchart
		app.visualization.create('barchart', //viz type
			[{qDef: {qDef: "=Sum([Consumption Vol (thousand kl)])", qLabel: "Consumption by volume (thousand kl)"}}, "Country"], //columns
			{orientation: "horizontal"} //options
		).then(function(viz){
			viz.show('LqGvcQ');
		});

		//Total consumption table
		app.visualization.create('table', 
			["Country", {qDef: {qDef: "=num(((Sum([Consumption Vol (thousand kl)])*1000)*1000)/ Sum(Population), '#,###.0')", qLabel: "Litres per capita"}}, {qDef: {qDef: "=Sum([Consumption Vol (thousand kl)])", qLabel: "Consumption by volume (thousand kl)"}}], //columns
			{} //options
		).then(function(viz) {
			viz.show('TeGQjDH');
		});

		//Brand consumption table
		app.visualization.create('table', 
			[{qDef: {qFieldDefs: ["=[Most Popular Beer] & ' (' & Country & ')'"], qFieldLabels: ["Brand (country)"]}}, {qDef: {qDef: "=num(((Sum([Consumption Vol (thousand kl)])*1000)*1000)/ Sum(Population), '#,###.0')", qLabel: "Litres per capita"}}, {qDef: {qDef: "=Sum([Consumption Vol (thousand kl)])", qLabel: "Consumption by volume (thousand kl)"}}], //columns
			{} //options
		).then(function(viz) {
			viz.show('SRRkTj');
		});

		//Piechart
		app.visualization.create('piechart', //viz type
			[{qDef: {qFieldDefs: ["=[Most Popular Beer]"], qFieldLabels: ["Most Popular Beer"]}, qOtherTotalSpec: {qOtherMode: "OTHER_COUNTED", qOtherCounted: "10"}}, "=Sum([Consumption Vol (thousand kl)])"], //columns
			{} //options
		).then(function(viz){
			viz.show('LeYur');
		});

		//Production linechart
		app.visualization.create('linechart', 
			[{qDef: {qFieldDefs: ["=Year"], qFieldLabels: ["Year"], qNumberPresentations: [{qType: "I", qFmt: "####"}]}}, "Region", {qDef: {qDef: "=sum([Production (mil hl)])", qLabel: "Beer Production (mil hl)"}}], //columns
			{dataPoint: {show: true}, dimensionAxis: {}, measureAxis: {autoMinMax: false, min: "=0", max: "=1000"}} //options
		).then(function(viz) {
			viz.show('kbNYjM');
		});

		//Production barchart
		app.visualization.create('barchart', //viz type
			[{qDef: {qDef: "=sum([Production (mil hl)])", qLabel: "Beer Production (mil hl)"}}, "Region"], //columns
			{orientation: "horizontal"} //options
		).then(function(viz){
			viz.show('PvJPX');
		});

		//Consumption linechart
		app.visualization.create('linechart', 
			[{qDef: {qFieldDefs: ["=Year"], qFieldLabels: ["Year"], qNumberPresentations: [{qType: "I", qFmt: "####"}]}}, "Region", {qDef: {qDef: "=(((Sum([Consumption Vol (thousand kl)])*1000)*10)/1000000)", qLabel: "Beer Consumption (mil hl)"}}], //columns
			{dataPoint: {show: true}, dimensionAxis: {}, measureAxis: {autoMinMax: false, min: "=0", max: "=1000"}} //options
		).then(function(viz) {
			viz.show('CgEXCx');
		});

		//Consumption barchart
		app.visualization.create('barchart', //viz type
			[{qDef: {qDef: "=(((Sum([Consumption Vol (thousand kl)])*1000)*10)/1000000)", qLabel: "Beer Consumption (mil hl)"}}, "Region"], //columns
			{orientation: "horizontal"} //options
		).then(function(viz){
			viz.show('ahNbPa');
		});

  });
};