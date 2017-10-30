var minZoom = 2
var maxZoom = 5
var oceanGeoJson
var worldGeoJson
var oceanBlue = '#0077BE'

var mymap = L.map('mapid', {
  zoomDelta: 0.5,
  zoomSnap: 0,
  trackResize: true,
  scrollWheelZoom: false
}).setView([30, 2], 0)
mymap.on('resize', function(e) {
  mymap.fitBounds([
    [78.7376130545727, 180.2446852962772],
    [-65.94838222431271, -179.423608503526]
  ])
})

var oceanElements = []
var countriesElement = []

Promise.all([
  $.getJSON('/showcaseresources/decode-oct-2017/resources/oceans.json'),
  $.getJSON(
    'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json'
  )
]).then(([oceanGeoJson, worldGeoJson]) => {
  oceanGeoJson = L.geoJson(oceanGeoJson, {
    style: oceanStyle,
    onEachFeature: onEachOceanFeature
  }).addTo(mymap)
  mymap.setMaxBounds(oceanGeoJson.getBounds())

  worldGeoJson = L.geoJson(worldGeoJson, {
    style: () => ({ color: 'transparent' }),
    onEachFeature: (feature, layer) => {
      layer.on({
        mouseover: e => {
          var layer = e.target

          layer.setStyle({
            fillOpacity: 0.4
          })

          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront()
          }
          info.update(layer.feature.properties)
        },
        mouseout: e => {
          var layer = e.target

          layer.setStyle({
            fillOpacity: 0.2
          })

          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront()
          }
          info.update(layer.feature.properties)
        },
        click: () => {
          let clickedCountry = feature.properties.name
          app.field('Country').selectValues([clickedCountry], true, false)
        }
      })
      countriesElement.push(layer)
    }
  }).addTo(mymap)

  /*L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: maxZoom,
    id: 'mapbox.light',
    noWrap: true,
    continuousWorld: true,
    bounds: oceanGeoJson.getBounds(),
    maxBoundsViscosity: 1.0 //How much force you experience when going out of bounds
  }).addTo(mymap);*/

  L.tileLayer(
    'https://api.mapbox.com/styles/v1/seriousben/cj8qk0fysal2b2ss27kmivp75/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2VyaW91c2JlbiIsImEiOiJjajhxam9kdnEwa2c5MndxcHBtcjZiZGlxIn0.sPq1wEDyoXKrPW-9ZjUnMA',
    {
      maxZoom: maxZoom,
      minZoom: minZoom,
      attribution:
        'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      noWrap: true,
      continuousWorld: true,
      bounds: oceanGeoJson.getBounds(),
      maxBoundsViscosity: 1.0 //How much force you experience when going out of bounds
    }
  ).addTo(mymap)

  mymap.fitBounds([
    [78.7376130545727, 180.2446852962772],
    [-65.94838222431271, -179.423608503526]
  ])
})

// control that shows state info on hover
var info = L.control()

info.onAdd = function(map) {
  this._div = L.DomUtil.create('div', 'info')
  this.update()
  return this._div
}

info.update = function(props) {
  const title = '<h4>Commitments</h4>'
  let data = 'Hover over a selected Ocean basin or Country'
  if (props != undefined && props.numCommitments != undefined) {
    data =
      '<b>' +
      (props.name || props.NAME) +
      '</b>&nbsp;&nbsp;' +
      props.numCommitments
  }
  this._div.innerHTML = title + data
}
info.addTo(mymap)

function oceanStyle(feature) {
  return {
    //fillColor: "rgba(0,0,0,0)",
    //weight: 2,
    //opacity: 1,
    //color: 'white',
    //dashArray: '3',
    fillOpacity: 0.2,
    //fill: 'red',
    //fillColor: 'red',
    fillColor: oceanBlue,
    stroke: 'none',
    weight: 0
  }
}

function onEachOceanFeature(feature, layer) {
  layer.on({
    mouseover: highlightOceanFeature,
    mouseout: resetOceanHighlight,
    click: oceanCLicked
  })
  oceanElements.push(layer)
}

function highlightOceanFeature(e) {
  var layer = e.target

  layer.setStyle({
    //weight: 5,
    //color: '#666',
    //fill: e.target.options.fill,
    fillOpacity: 0.4
  })

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront()
  }

  info.update(layer.feature.properties)
}

function resetOceanHighlight(e) {
  e.target.setStyle({
    //weight: 2,
    //color: "white",
    //dashArray: '3',
    //fill: e.target.options.fill,
    //fillColor: e.target.options.fillColor
    fillOpacity: 0.2
  })

  info.update()
}

function oceanCLicked(e) {
  let clickedOcean = e.target.feature.properties.NAME
  app.field('Ocean Basins').selectValues([clickedOcean], true, false)
  // if(e.target.isClicked == null) {
  //   e.target.isClicked = true;
  // } else {
  //   e.target.isClicked = !e.target.isClicked;
  // }
  //
  // if(e.target.isClicked) {
  //   e.target.setStyle({ fillColor: '#FF0000', fill: true});
  // } else {
  //   e.target.setStyle({ fillColor: 'rgba(0,0,0,0)', fill: true});
  // }
}

function reloadOceansLayer(hypercube) {
  oceanElements.forEach(function(oceanElement) {
    const matrix = featureInCube(
      hypercube,
      oceanElement.feature.properties.NAME
    )
    if (matrix) {
      oceanElement.setStyle({ fillColor: oceanBlue })
      oceanElement.feature.properties.numCommitments = matrix[1].qText
    } else {
      oceanElement.setStyle({ fillColor: 'rgba(0,0,0,0)' })
      oceanElement.feature.properties.numCommitments = undefined
    }
  })
}

function reloadCountriesLayer(hypercube) {
  countriesElement.forEach(function(countryElement) {
    const matrix = featureInCube(
      hypercube,
      countryElement.feature.properties.name
    )
    if (matrix) {
      countryElement.setStyle({ fillColor: 'green' })
      countryElement.feature.properties.numCommitments = matrix[1].qText
    } else {
      countryElement.setStyle({ fillColor: 'transparent' })
      countryElement.feature.properties.numCommitments = undefined
    }
  })
}

function featureInCube(hypercube, featureName) {
  return hypercube.find(data => {
    return featureName.toLowerCase() == data[0].qText.toLowerCase()
  })
}
