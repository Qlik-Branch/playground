function openOverlay() {
    document.getElementById("qOverlay").style.animationName = "open-overlay";
    $('#qOverlay').show();
}

function closeOverlay() {
    document.getElementById("qOverlay").style.animationName = "close-overlay";
    setTimeout(()=>{
      $('#qOverlay').hide();
    }, 1000);

}

$(window).bind('mousewheel', function(event) {
    if (event.originalEvent.wheelDelta < 0) {
        closeOverlay();
    }
})
