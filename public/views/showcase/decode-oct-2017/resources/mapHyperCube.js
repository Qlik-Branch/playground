var app

function setupOceansHyperCube() {
  var hyperCubeDef = {
    qDimensions: [
      { qDef: { qFieldDefs: ["Ocean Basins"] } }
    ],
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
    const dataMatrix = hypercube.qHyperCube.qDataPages[0].qMatrix;
    const maxCommitment = hypercube.qHyperCube.qMeasureInfo[0].qMax;

    reloadOceansLayer(dataMatrix);
  })
}

function setupCountriesHyperCube() {
  var hyperCubeDef = {
    qDimensions: [
      { qDef: { qFieldDefs: ["Country"] } },
    ],
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
    const dataMatrix = hypercube.qHyperCube.qDataPages[0].qMatrix;
    const maxCommitment = hypercube.qHyperCube.qMeasureInfo[0].qMax;

    reloadCountriesLayer(dataMatrix);
  })
}
