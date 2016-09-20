var config = {
	host: "playground.qlik.com",
	prefix: "/showcase/",
	port: "443",
	isSecure: true,
	rejectUnauthorized: false,
	appname: "a2499054-5dbc-47b7-a5ef-b735a9a7fe32"
};

function authenticate(){

    window.location.pathname = "/liveshowcase/airBnBApp/main.html";

  // return;
}

function main () {

	require.config( {
		baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources",
	} );

	require( ['js/qlik'], function ( qlik ) {
			//we're now connected
			qlik.setOnError( function ( error ) {
				console.log( error );
			} );

			//Init map
			L.mapbox.accessToken = 'pk.eyJ1IjoiYXhlbHNzb25oYWthbiIsImEiOiJkMWx6UVFNIn0.nSTWOtW7gJQ94xDKHtq_tg';
			var map = L.mapbox.map( 'map', 'mapbox.streets' );
			var featureLayer = L.mapbox.featureLayer().addTo( map );

			//Fetching data
			//console.log("Connecting to appname: " + config.appname);
			var app = qlik.openApp( config.appname, config );
			window.app = app;

			// app.visualization.create( 'piechart', ["country", "=count([listing_id])"],
			// 	{"title": "airBnB per country"}
			// ).then( function ( vis ) {
			// 	vis.show( "QV01" );
			// } );
			//
			// app.visualization.create( 'com-qliktech-toolbar', null,
			// 	{"buttons": {"clear": true, "back": true, "forward": true}}
			// ).then( function ( vis ) {
			// 	vis.show( "QV02" );
			// } );

			app.createCube( {
				qDimensions: [{
					qDef: {
						qFieldDefs: ["City"]
					}
				}, {
					qDef: {
						qFieldDefs: ["Location"]
					}
				}, {
					qDef: {
						qFieldDefs: ["name"]
					}
				}, {
					qDef: {
						qFieldDefs: ["price"]
					}
				}, {
					qDef: {
						qFieldDefs: ["listing_url"]
					}
				}, {
					qDef: {
						qFieldDefs: ["accommodates"]
					}
				}, {
					qDef: {
						qFieldDefs: ["beds"]
					}
				}, {
					qDef: {
						qFieldDefs: ["street"]
					}
				}],
				qMeasures: [{
					qDef: {
						qDef: "1"
					}
				}],
				qInitialDataFetch: [{
					qTop: 0,
					qLeft: 0,
					qHeight: 100,
					qWidth: 10
				}]
			}, function ( reply ) {
				featureLayer.clearLayers();
				$( ".bnb-list" ).empty();

				reply.qHyperCube.qDataPages[0].qMatrix.forEach( function ( bnb ) {

					// console.log( bnb );
					var content = "<p><a href=\"" + bnb[4].qText + "\" target=\"_blank\">" + bnb[2].qText + "</a></p><hr><div id=\"usd\">" + bnb[3].qText + " pix</div><div id=\"group\">" + bnb[5].qText + " Guests</div><div id=\"bed\">" + bnb[6].qText + " Bed</div>";
					var location = JSON.parse( bnb[1].qText );

					$( '.bnb-list' ).append( '<li><div class="name">' + bnb[2].qText + '</div><div class="street">' + bnb[7].qText + '</div><div class="small-map"><span>No image avaliable</span></div></li>' );

					L.marker( [location[1], location[0]], {
						icon: L.mapbox.marker.icon( {
							'marker-size': 'large',
							'marker-symbol': 'lodging',
							'marker-color': '#FF7977'
						} )
					} ).bindPopup( content )
						.on( 'click', function ( e ) {
							map.setView( e.latlng, 13 );
							loadWeather( e.latlng.lat + "," + e.latlng.lng );
						} )
						.addTo( featureLayer );
					map.fitBounds( featureLayer.getBounds().pad( 0.5 ) );
				} )
			} );
		}
	)
	;

}

function doSelections ( str ) {
	require.config( {
		baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources",
	} );
	require( ['js/qlik'], function ( qlik ) {
		//we're now connected
		qlik.setOnError( function ( error ) {
			console.log( error );
		} );
		var app = qlik.openApp( config.appname, config );
		//app.clearAll(true);
		//app.field('City').selectValues([{qText: str}], true, true);
		app.clearAll( true );
		app.field( 'City' ).toggleSelect( str, true );
	} );
	$( ".select-country" ).removeClass( "selected" );
	$( "#" + str ).addClass( "selected" );
}

function selectFunc ( type, name ) {
	require.config( {
		baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources",
	} );
	require( ['js/qlik'], function ( qlik, $scope ) {
		//we're now connected
		qlik.setOnError( function ( error ) {
			console.log( error );
		} );

		var app = qlik.openApp( config.appname, config );
		var select = $( "." + type ).val();
		app.field( name ).clear();
		app.field( name ).toggleSelect( select, true );
	} );
}

function loadSelections () {
	require.config( {
		baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources",
	} );
	require( ['js/qlik'], function ( qlik, $scope ) {
		//we're now connected
		qlik.setOnError( function ( error ) {
			console.log( error );
		} );

		var app = qlik.openApp( config.appname, config );

		var city = app.field( 'City' );
		city.getData( {rows: 1000} ).OnData.bind( function () {
			var selected = $( ".select-city" ).val();
			$( '.select-city' ).empty();
			$( '.select-city' ).append( $( '<option>', {value: 'empty'} ) );
			city.rows.forEach( function ( city ) {
				$( '.select-city' ).append( $( '<option>', {value: city.qText} ).text( city.qText ) );
			} )
			$( '.select-city' ).val( selected );
		} );

		var date = app.field( 'date' );
		date.getData( {rows: 1000} ).OnData.bind( function () {
			var selected = $( ".select-date" ).val();
			$( '.select-date' ).empty();
			$( '.select-date' ).append( $( '<option>', {value: 'empty'} ) );
			date.rows.forEach( function ( date ) {
				$( '.select-date' ).append( $( '<option>', {value: date.qText} ).text( date.qText ) );
			} )
			$( '.select-date' ).val( selected );
		} );

		var room = app.field( 'room_type' );
		room.getData( {rows: 1000} ).OnData.bind( function () {
			var selected = $( ".select-room" ).val();
			$( '.select-room' ).empty();
			$( '.select-room' ).append( $( '<option>', {value: 'empty'} ) );
			room.rows.forEach( function ( room ) {
				$( '.select-room' ).append( $( '<option>', {value: room.qText} ).text( room.qText ) );
			} )
			$( '.select-room' ).val( selected );
		} );

		var beds = app.field( 'beds' );
		beds.getData( {rows: 1000} ).OnData.bind( function () {
			var selected = $( ".select-beds" ).val();
			$( '.select-beds' ).empty();
			$( '.select-beds' ).append( $( '<option>', {value: 'empty'} ) );
			beds.rows.forEach( function ( beds ) {
				$( '.select-beds' ).append( $( '<option>', {value: beds.qText} ).text( beds.qText ) );
			} )
			$( '.select-beds' ).val( selected );
		} );

		var price = app.field( 'weekly_price' );
		price.getData( {rows: 1000} ).OnData.bind( function () {
			var selected = $( ".select-price" ).val();
			$( '.select-price' ).empty();
			$( '.select-price' ).append( $( '<option>', {value: 'empty'} ) );
			price.rows.forEach( function ( price ) {
				$( '.select-price' ).append( $( '<option>', {value: price.qText} ).text( price.qText ) );
			} )
			$( '.select-price' ).val( selected );
		} );
	} );
}

function clearFunction () {
	require.config( {
		baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources",
	} );
	require( ['js/qlik'], function ( qlik ) {
		//we're now connected
		qlik.setOnError( function ( error ) {
			console.log( error );
		} );
		var app = qlik.openApp( config.appname, config );
		app.clearAll( true );
		$( '.select-city' ).val( "empty" );
		$( '.select-date' ).val( "empty" );
		$( '.select-room' ).val( "empty" );
		$( '.select-beds' ).val( "empty" );
		$( '.select-price' ).val( "empty" );
	} );
}

function loadWeather ( location, woeid ) {
	$.simpleWeather( {
		location: location,
		woeid: woeid,
		unit: 'c',
		success: function ( weather ) {
			html = '<h2><i class="wicon-' + weather.code + '"></i> ' + weather.temp + '&deg;' + weather.units.temp + '</h2>';
			html += '<ul><li>' + weather.city + ', ' + weather.region + '</li>';
			html += '<li class="currently">' + weather.currently + '</li>';

			$( "#weather" ).html( html );

			var options = {
				"api_key": "72a16a4e67705075bef0cb45b713b7f5",
				"method": "flickr.photos.search",
				"format": "json",
				"nojsoncallback": "1",
				"text": weather.city + "+landmark",
				"sort": "interestingness-desc",
				"is_getty": "true",
				"safe_search": "1"
			}

			makeFlickrRequest( options, function ( data ) {
				var photo = data.photos.photo[0];
				var photoURL = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg";
				console.log( photoURL );
				$( '#weather' ).css( "background-image", "url(" + photoURL + ")" );
			} );
		},
		error: function ( error ) {
			$( "#weather" ).html( '<p>' + error + '</p>' );
		}
	} );
}

var makeFlickrRequest = function ( options, cb ) {
	var url, item, first;

	url = "https://api.flickr.com/services/rest/";
	first = true;
	$.each( options, function ( key, value ) {
		url += (first ? "?" : "&") + key + "=" + value;
		first = false;
	} );

	$.get( url, function ( data ) { cb( data ); } );
};
