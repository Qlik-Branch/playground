var app

function setupFilterBarHyperCube() {
  var hyperCubeDef = {
    qDimensions: [],
    qMeasures: [
      { qDef: { qDef: "=Count(Title)" } }
    ],
    qInitialDataFetch: [{
      qTop: 0,
      qLeft: 0,
      qHeight: 3333,
      qWidth: 3
    }]
  }

  app.createCube(hyperCubeDef, function (hypercube) {
    $('#commitments').html(hypercube.qHyperCube.qDataPages["0"].qMatrix["0"]["0"].qText)
  })
}
