/**
 * Created by ADD on 2016-08-30.
 */

$( document ).ready( function () {
	console.log( "ready!" );
	loadSelections ();

	$( ".nav-map" ).click( function () {
		$( 'html, body' ).animate( {
			scrollTop: $( ".map-wrap" ).offset().top
		}, 1500 );
	} );
	$( ".m-icon" ).click( function () {
		$( 'html, body' ).animate( {
			scrollTop: $( ".map-wrap" ).offset().top
		}, 1500 );
	} );
	$( ".nav-search" ).click( function () {
		$( 'html, body' ).animate( {
			scrollTop: $( ".search" ).offset().top
		}, 1500 );
	} );
	$( ".s-icon" ).click( function () {
		$( 'html, body' ).animate( {
			scrollTop: $( ".search" ).offset().top
		}, 1500 );
	} );
	$( ".nav-price" ).click( function () {
		$( 'html, body' ).animate( {
			scrollTop: $( ".price" ).offset().top
		}, 1500 );
	} );
	$( ".nav-review" ).click( function () {
		$( 'html, body' ).animate( {
			scrollTop: $( ".review" ).offset().top
		}, 1500 );
	} );
	$( ".w-icon" ).click( function () {
		$( 'html, body' ).animate( {
			scrollTop: $( ".review" ).offset().top
		}, 1500 );
	} );
	$( ".arrow" ).click( function () {
		$( 'html, body' ).animate( {
			scrollTop: $( ".header" ).offset().top
		}, 1500 );
	} );

	$( document ).scroll( function () {
		if ( $( document ).scrollTop() >= 50 ) {
			$( ".arrow" ).addClass( "visible" );
			$( ".nav" ).addClass( "visible" );
		} else {
			$( ".arrow" ).removeClass( "visible" );
			$( ".nav" ).removeClass( "visible" );
		}
	} );

} );



