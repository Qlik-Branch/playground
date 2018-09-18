// Input your config
var config = {
  host: 'playground-sense.qlik.com',
  prefix: '/showcase/',
  port: '443',
  isSecure: true,
  rejectUnauthorized: false,
  appname: '0b0fc6d5-05ce-44d7-95aa-80d0680b3559'
}

function main() {
  require.config({
    baseUrl:
      (config.isSecure ? 'https://' : 'http://') +
      config.host +
      (config.port ? ':' + config.port : '') +
      config.prefix +
      'resources'
  })

  /**
   * Load the entry point for the Capabilities API family
   * See full documention: http://help.qlik.com/en-US/sense-developer/Subsystems/APIs/Content/MashupAPI/qlik-interface-interface.htm
   */
  require(['js/qlik'], function(qlik) {
    // We're now connected

    // Suppress Qlik error dialogs and handle errors how you like.
    qlik.setOnError(function(error) {
      console.log('ERROR', error)
    })

    // Open a dataset on the server
    app = qlik.openApp(config.appname, config)
    let field = app.field('Goal ID')
    field.selectValues(['Goal 14'], false, true)
    field.lock()
    setupCountriesHyperCube()
    setupOceansHyperCube()
    setupFilterBarHyperCube()

    var selState = app.selectionState()
    var listener = function() {
      updateFilterBar(selState.selections)
    }
    //bind the listener
    selState.OnData.bind(listener)
    createGoalsAndSDGTargets()
    createCommitmentList()
    createLeadEntityTypesList()
    createLeadEntityList()
  })
}

function createGoalsAndSDGTargets() {
  var hyperCubeDef = {
    qDimensions: [
      {
        qDef: {
          qFieldDefs: ['Target Title']
        }
      },
      {
        qDef: {
          qFieldDefs: ['Target Icon']
        }
      },
      {
        qDef: {
          qFieldDefs: ['Goal ID']
        }
      }
    ],
    qMeasures: [
      {
        qDef: { qDef: '=Count(OceanActionID) + (0 * Count({1}OceanActionID))' },
        qSortBy: { qSortByNumeric: -1 }
      }
    ],
    qInterColumnSortOrder: [2, 0, 1],
    qInitialDataFetch: [
      {
        qTop: 0,
        qLeft: 0,
        qHeight: 200,
        qWidth: 4
      }
    ]
  }
  app.createCube(hyperCubeDef, hypercube => {
    let matrix = hypercube.qHyperCube.qDataPages[0].qMatrix
    var targets = document.getElementById('targets')
    targets.innerHTML = ''
    matrix = matrix.filter(row => row[2].qText === 'Goal 14')
    matrix.forEach((row, index) => {
      var percentage = row[3].qNum / hypercube.qHyperCube.qGrandTotalRow[0].qNum
      percentage = Math.round(percentage * 100)
      var target = $(`<div class="kpiElements"></div>`)
      if (row[0].qState === 'X') {
        target.addClass('inactive')
      }
      target.append(`<h5>${row[0].qText}</h5>`)
      target.append(
        `<img src="/showcaseresources/decode-oct-2017/resources/icons/${row[1]
          .qText}.svg"></img>`
      )
      target.append(`<h5>${row[3].qText}</h5>`)
      target.append(`<h5>${percentage}%</h5>`)
      target.click(function() {
        let field = app.field('Target Title')
        field.selectValues([row[0].qText], true, true)
      })
      $(`#targets`).append(target)
    })
  })
}

function createGoalCountKpi(target) {
  var listCols = ["=Count({<[SDG Target]={'" + target + "'}>}OceanActionID)"]
  app.visualization
    .create('kpi', listCols, {
      title: target + ' Commitments',
      showTitles: true,
      showMeasureTitle: false
    })
    .then(function(kpi) {
      kpi.show('goals-count-kpi-' + target)
    })
}

function clearState(state) {
  state = state || '$'
  app.clearAll(false, state)
  //except for Goal 14
  app.field('Goal ID').selectValues(['Goal 14'], false, false)
}

function createCommitmentList() {
  var hyperCubeDef = {
    qDimensions: [
      {
        qDef: {
          qFieldDefs: ['Title'],
          qSortCriterias: [{ qSortByAscii: 1 }]
        }
      },
      {
        qDef: {
          qFieldDefs: ['Commitment Url']
        }
      }
    ],
    qMeasures: [],
    qInitialDataFetch: [
      {
        qTop: 0,
        qLeft: 0,
        qHeight: 2000,
        qWidth: 2
      }
    ]
  }

  app.createCube(hyperCubeDef, hypercube => {
    let matrix = hypercube.qHyperCube.qDataPages[0].qMatrix
    const $list = $('#commitmentList')
    $list.empty()
    matrix.forEach(row => {
      let anchor = $(
        `<a target='_blank' href='${row[1].qText}'>${row[0].qText}</a>`
      )
      let item = $(`<div></div>`)
      item.append(anchor)
      $list.append(item)
    })
  })
}

function createLeadEntityTypesList() {
  const $list = $('#leadEntityTypeList')
  app.createList(
    {
      qDef: {
        qFieldDefs: ['Lead entity type'],
        qSortCriterias: [{ qSortByState: 1 }, { qSortByAscii: 1 }]
      },
      qInitialDataFetch: [
        {
          qTop: 0,
          qLeft: 0,
          qHeight: 2000,
          qWidth: 1
        }
      ]
    },
    function(reply) {
      $list.empty()
      reply.qListObject.qDataPages[0].qMatrix.forEach(row => {
        let item = $(`<div>${row[0].qText}</div>`)
        if (row[0].qState === 'X') {
          item.addClass('inactive')
        }
        item.click(() => {
          app.field('Lead entity type').selectValues([row[0].qText], true, true)
        })
        $list.append(item)
      })
      $list.scrollTop(0)
    }
  )
}

function createLeadEntityList() {
  const $list = $('#leadEntityList')
  app.createList(
    {
      qDef: {
        qFieldDefs: ['Lead entity'],
        qSortCriterias: [{ qSortByState: 1 }, { qSortByAscii: 1 }]
      },
      qInitialDataFetch: [
        {
          qTop: 0,
          qLeft: 0,
          qHeight: 2000,
          qWidth: 1
        }
      ]
    },
    function(reply) {
      $list.empty()
      reply.qListObject.qDataPages[0].qMatrix.forEach(row => {
        let item = $(`<div>${row[0].qText}</div>`)
        if (row[0].qState === 'X') {
          item.addClass('inactive')
        }
        item.click(() => {
          app.field('Lead entity').selectValues([row[0].qText], true, true)
        })
        $list.append(item)
      })
      $list.scrollTop(0)
    }
  )
}
