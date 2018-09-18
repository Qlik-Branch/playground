var config={
	host:"playground-sense.qlik.com",
  prefix: "/showcase/",
	port:"443",
	isSecure:true,
	rejectUnauthorized:false,
	appname: "2b10add1-472f-4192-aac9-44a99125825c",
	appname2: "7cf92dad-43a4-46c5-862a-1b939a6d6ede"
};
var clearAll;

function authenticate(){

    window.location.pathname = "/liveshowcase/airBnB-booze/main.html";

  // return;
}
function main () {
	require( ["/liveshowcase/airBnB-booze/extensions/br.com.clever.wordcloud/br.com.clever.wordcloud"], function ( Wordcloud ) {
		require.config( {
			baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources",
			paths: {
				async: '/showcaseresources/airBnB-booze/resources/async'
			}
		} );

		require( ['js/qlik', 'async!https://maps.google.com/maps/api/js?key=AIzaSyCkmK2gx7-29Xm15K9LSU9ZCB8uu57C-4Y'], function ( qlik ) {
			//we're now connected
			qlik.setOnError( function ( error ) {
				console.log( error );
			} );

			qlik.registerExtension( 'Wordcloud', Wordcloud );

			//google maps
			var map;
			var mapStyle = [{"stylers": [{"visibility": "on"}, {"saturation": -100}, {"gamma": 0.54}]}, {
				"featureType": "road",
				"elementType": "labels.icon",
				"stylers": [{"visibility": "off"}]
			}, {"featureType": "water", "stylers": [{"color": "#4d4946"}]}, {
				"featureType": "poi",
				"elementType": "labels.icon",
				"stylers": [{"visibility": "off"}]
			}, {
				"featureType": "poi",
				"elementType": "labels.text",
				"stylers": [{"visibility": "simplified"}]
			}, {
				"featureType": "road",
				"elementType": "geometry.fill",
				"stylers": [{"color": "#ffffff"}]
			}, {
				"featureType": "road.local",
				"elementType": "labels.text",
				"stylers": [{"visibility": "simplified"}]
			}, {
				"featureType": "water",
				"elementType": "labels.text.fill",
				"stylers": [{"color": "#ffffff"}]
			}, {
				"featureType": "transit.line",
				"elementType": "geometry",
				"stylers": [{"gamma": 0.48}]
			}, {
				"featureType": "transit.station",
				"elementType": "labels.icon",
				"stylers": [{"visibility": "off"}]
			}, {"featureType": "road", "elementType": "geometry.stroke", "stylers": [{"gamma": 7.18}]}];
			var marker, i;
			var markers = [];
			var markerCluster;
			var geocoder = new google.maps.Geocoder();

			map = new google.maps.Map( document.getElementById( 'map' ), {
				center: {lat: 46.8416339, lng: -0.3017863},
				zoom: 6,
				panControl: false,
				zoomControl: true,
				minZoom: 3,
				mapTypeControl: false,
				streetViewControl: false,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				scrollwheel: false,
				styles: mapStyle
			} );

			// Sets the map on all markers in the array.
			function setMapOnAll ( map ) {
				if ( markers ) {
					for ( var i = 0; i < markers.length; i++ ) {
						markers[i].setMap( map );
					}
				}
			}

			var itemsArr = [];
			// Removes the markers from the map, but keeps them in the array.
			function clearMarkers () {
				itemsArr = [];
				markers = [];
				//setMapOnAll( null );
				if ( markerCluster ) {
					//markerCluster.setMap( null );
					console.log( 'markerCluster set map null called' );
					markerCluster.clearMarkers();
				}
			}

			// Deletes all markers in the array by removing references to them.
			function deleteMarkers () {
				clearMarkers();
				markers = [];
			}

			var app = qlik.openApp( config.appname, config );

			var app2 = qlik.openApp( config.appname2, config );
			app.clearAll();
			app2.clearAll();
			app.getList( "SelectionObject", function ( res ) {console.log( "selectionsin app 1", res );} );
			//listen to selections in app2
			app2.getList( "SelectionObject", function ( res ) {console.log( "selectionsin app 2", res );} );

			//var markerCluster;
			app.createCube( {
				qDimensions: [{
					qDef: {
						qFieldDefs: ["Location"]
					}
				}, {
					qDef: {
						qFieldDefs: ["host_location"]
					}
				}, {
					qDef: {
						qFieldDefs: ["name"]
					}
				}, {
					qDef: {
						qFieldDefs: ["price_bucket"]
					}
				}, {
					qDef: {
						qFieldDefs: ["property_type"]
					}
				}, {
					qDef: {
						qFieldDefs: ["review_scores_rating"]
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
					qHeight: 1000,
					qWidth: 6
				}]
			}, function ( reply ) {

				if ( !currentSelection ) {
					return;
				}

				clearMarkers();
				//itemsArr = [];

				$.each( reply.qHyperCube.qDataPages[0].qMatrix, function ( key, value ) {
					var res = eval( value[0].qText );

					res = {
						lat: res[1],
						lng: res[0]
					};

					itemsArr.push( {
						latLng: res,
						name: value[2].qText,
						location: value[1].qText,
						propertyType: value[4].qText,
						price: value[3].qText,
						review: value[5].qText
					} );

				} );
				console.log( 'we have data' );
				// Adds a marker to the map and push to the array.
				function addMarker ( item ) {

					marker = new google.maps.Marker( {
						position: item.latLng,
						icon: 'http://gdurl.com/kVn2'
					} );
					var content = '<div id="iw-container">' +
						'<div class="iw-title">' + item.name + '</div>' +
						'<div class="iw-content">' +
						'<div class="iw-subTitle">' + item.location + '</div>' +
						'<img src="http://maps.marnoto.com/en/5wayscustomizeinfowindow/images/vistalegre.jpg" alt="Porcelain Factory of Vista Alegre" height="115" width="83">' +
						'<p>[' + item.propertyType + '] price: ' + item.price + '</p>' +
						'<div class="iw-subTitle">Review : ' + item.review + '</div>' +
						'</div>' +
						'<div class="iw-bottom-gradient"></div>' +
						'</div>';

					// A new Info Window is created and set content
					var infowindow = new google.maps.InfoWindow( {
						content: content,
						position: item.latLng
						// Assign a maximum value for the width of the infowindow allows
						// greater control over the various content elements
						// maxWidth: 350
					} );
					marker.addListener( 'click', function () {
						infowindow.open( map, marker );
					} );
					markers.push( marker );
				}

				for ( i = 0; i < itemsArr.length; i++ ) {
					addMarker( itemsArr[i] );
				}

				markerCluster = new MarkerClusterer( map, markers, {
					imagePath: 'resources/images/airbnb',
					textSize: 30,
					textColor: 'green'
				} );
			} );

			/*
				Objects
			 */

			var qdefPieChart = { qDef :{
				qFieldDefs: ["review_scores_value"],
				qFieldLabels: ["Review Score"],
				qSortCriterias: [{qSortByNumeric:1}]
			}};
			app.visualization.create( "piechart", [qdefPieChart, "=Count([review_scores_value])"]
			).then( function ( vis ) {
				vis.show( "col1" );
			} ).catch( function ( err ) {
				console.error( err );
			} );

			app.visualization.create( "kpi", [{qDef:{
				qDef:"=Count([Location])",
				qLabel: "Total number of AirBNB's"
			}}] ).then( function ( vis ) {//
				vis.show( "col2" );
			} ).catch( function ( err ) {
				console.error( err );
			} );

			app2.visualization.create( "piechart", ["Varugrupp", "=Count([ArtikelNr])"] ).then( function ( vis ) {
				vis.show( "col3" );
			} ).catch( function ( err ) {
				console.error( err );
			} );

			app2.visualization.create( "kpi", [{qDef:{
				qDef:"=Count([ArtikelNr])",
				qLabel: "Total number of different liquors"
			}}] ).then( function ( vis ) {
				vis.show( "col4" );
			} ).catch( function ( err ) {
				console.error( err );
			} );


			/**
			 * extra
			 */
			var mapSVTrans = {
				"Australia": "Australien",
				"France": "Frankrike",
				"Netherlands": "Nederländerna",
				"Spain": "Spanien",
				"United Kingdom": "Storbritannien",
				"United States": "USA",
				"Vanuatu": ""
			};

			clearAll = function () {
				app.clearAll();
				app2.clearAll();
				clearMarkers();
				currentSelection = null;
			};
			//filling in countryList
			var ulCountryList = document.getElementById( "country-list" );
			var countryList = app.field( "country" );
			var currentSelection = null;
			countryList.getData().OnData.bind( function () {
				while ( ulCountryList.firstChild ) {
					ulCountryList.removeChild( ulCountryList.firstChild );
				}
				countryList.rows.forEach( function ( item ) {
					if ( item.qText ) {
						var li = document.createElement( "li" );
						var a = document.createElement( "a" );
						a.innerHTML = item.qText;
						a.onclick = function () {
							currentSelection = item.qText;
							app.field( "country" ).selectValues( [currentSelection], false, true );
							app2.field( "Ursprunglandnamn" ).selectValues( [mapSVTrans[item.qText]], false, true );
							var cnt = document.getElementById( "cnt_syst" );
							cnt.style.display = "block";
							var qdef = {
								qDef: {
									"qDef": "=Count(Distinct([Artikelid]))"
									, "qLabel": "Article count"
								},
								qSortBy: {"qSortByNumeric": -1}
							};
							app2.visualization.create( 'barchart', null,
								{
									"title": "Amount of liquor types"
									,
									qHyperCubeDef: {
										qDimensions: [{
											qDef: {qFieldDefs: ['Varugrupp']}
										}],
										qMeasures: [qdef],
										qInterColumnSortOrder: [1, 0]
									}
								}
							).then( function ( vis ) {
								vis.show( "barchart" );
							} ).catch( function ( err ) {
								console.err( err );
							} );
							app2.visualization.create( 'Wordcloud', ["Varugrupp", "=Count([ArtikelNr])"],
								{"title": "Word Cloud"}
							).then( function ( vis ) {
								vis.show( "list" );
							} ).catch( function ( err ) {
								console.err( err );
							} );



							geocoder.geocode( {'address': item.qText}, function ( results, status ) {
								if ( status == google.maps.GeocoderStatus.OK ) {
									map.setCenter( results[0].geometry.location );
									map.fitBounds( results[0].geometry.bounds );
								} else {
									alert( "Geocode was not successful for the following reason: " + status );
								}
							} );
						};
						li.appendChild( a );
						ulCountryList.appendChild( li );
					} else {
						console.warn( 'Error (invalid row) ', item );
					}
				} );
			} );
		} );
	} );
}