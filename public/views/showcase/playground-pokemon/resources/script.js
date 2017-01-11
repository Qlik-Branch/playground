// Input your config 
var config = {
  host:"playground.qlik.com",
  prefix:"/showcase/",
  port:"443",
  isSecure:true,
  rejectUnauthorized:false,
  // apiKey:"gmxBn28r0xnoptRHkDbnFM4HGSu1cgOH",
  // appname:"d8f60a81-5613-4c01-96a7-7888d8d18262"
  appname: "2dd3bfd8-fc02-4516-9eb6-c932dc7b6393"

};

function authenticate(){
  // Playground.authenticate(config);
  window.location.pathname = "/liveshowcase/pokemonApp/main.html";
  // return;
};

var app;
var currentCubeID;
var matrixArray=[
  {id:"HP",value:"Hp"},
  {id:"Attack",value:"Attack"},
  {id:"Defense",value:"Defense"},
  {id:"Special attack",value:"Special-Attack"},
  {id:"Special defense",value:"Special-Defense"},
  {id:"Speed",value:"Speed"},
  {id:"Accuracy",value:"Accuracy"},
  {id:"Caputure rate",value:"capture_rate"},
  {id:"Happiness",value:"Base Happiness"},
  {id:"Height",value:"Height"},
  {id:"Weight",value:"Weight (kg)"}
]
var filterArray=[
  {id:"Color",value:"Color"},
  {id:"Habitat",value:"Habitat"},
  {id:"Type",value:"Type"}
]

function main() {
  require.config({
    baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port: "") + config.prefix + "resources"
  });

  /**
   * Load the entry point for the Capabilities API family
   * See full documention: http://help.qlik.com/en-US/sense-developer/Subsystems/APIs/Content/MashupAPI/qlik-interface-interface.htm
   */

  require(['js/qlik',"/showcaseresources/playground-pokemon/resources/d3.v3.min.js","/showcaseresources/playground-pokemon/resources/senseUtils.js"], function(qlik) {
    // We're now connected

    // Suppress Qlik error dialogs and handle errors how you like.
     qlik.setOnError( function ( error ) {
        console.log(error);
    });

    console.log(qlik);
    // Open a dataset on the server.  
    console.log("Connecting to appname: " + config.appname);
    app = qlik.openApp(config.appname, config);
    app.clearAll();
    console.log(app)
    createDropdownMenu();
    drawGraph();
  });
};

function createDropdownMenu()
{
  //create x-axis menu
  var xAxisDiv = document.getElementById("x-axis-matrix-div");
  var xAxisList = document.createElement("select");
  xAxisList.id = "x-axis-menu";
  xAxisDiv.appendChild(xAxisList);
  for (var i = 0; i < matrixArray.length; i++) {
      var option = document.createElement("option");
      option.value = matrixArray[i].value;
      option.text = matrixArray[i].id;
      xAxisList.appendChild(option);
  }
  //create y-axis menu
  var yAxisDiv = document.getElementById("y-axis-matrix-div");
  var yAxisList = document.createElement("select");
  yAxisList.id = "y-axis-menu";
  yAxisDiv.appendChild(yAxisList);
  for (var i = 0; i < matrixArray.length; i++) {
      var option = document.createElement("option");
      option.value = matrixArray[i].value;
      option.text = matrixArray[i].id;
      yAxisList.appendChild(option);
  }
  
  //set default value and redraw function on select event
  $("#x-axis-menu").val('Attack');
  $("#y-axis-menu").val('Defense');
  $("#x-axis-menu,#y-axis-menu").change(function(){
    drawGraph();
  });

  //create type menu
  var typeDiv = document.getElementById("type-div");
  var typeList = document.createElement("select");
  typeList.id = "type-menu";
  typeDiv.appendChild(typeList);

  var option = document.createElement("option");
  option.value = "All";
  option.text = "All";
  typeList.appendChild(option);

  console.log("asd1")
  console.log(app)
  app.createList({
    "qDef": {
      "qFieldDefs": [
        "Type"
      ]
    },
    "qInitialDataFetch": [{
        qTop : 0,
        qLeft : 0,
        qHeight : 30,
        qWidth : 1
      }]
    }, function(reply) {
       console.log("asd2")
      var typeVal;
      if ($('#type-menu').length){
        typeVal=$("#type-menu").val();
        $("#type-menu").remove();
      }
      else{
        typeVal='All';
      }

      //Append selection menu for pokemon type
      var typeDiv = document.getElementById("type-div");
      var typeList = document.createElement("select");
      typeList.id = "type-menu";
      typeDiv.appendChild(typeList);

      //Append the first option for all types
      var option = document.createElement("option");
      option.value = "All";
      option.text = "All";
      typeList.appendChild(option);

      //Interate through list and append pokemon types 
      $.each(reply.qListObject.qDataPages[0].qMatrix, function(key, value) {
        var option = document.createElement("option");
        option.value = value[0].qElemNumber;
        option.text = value[0].qText;
        typeList.appendChild(option);
      });

      $("#type-menu").val(typeVal);
      $("#type-menu").change(function(){
        app.field("Type").clear();
        if($("#type-menu").val()!="All")
        {
          app.field("Type").select([parseInt($("#type-menu").val())], true, true);
        }
      });
    });

}

//redraw function
function drawGraph(){
  var xVal=$("#x-axis-menu").val();
  var yVal=$("#y-axis-menu").val();
  if(currentCubeID){
    console.log("destroying cube:"+currentCubeID);
    app.destroySessionObject(currentCubeID);
  }

  //Create a new hypercube base on xVal and yVal
  var qHyperCubeDef={                
      qDimensions : [
        {
          qDef : {qFieldDefs : ["Pokemon Name"]}
        }
      ],
      qMeasures : [
        {
        qDef : {qDef : "Avg(["+xVal+"])"}
      },
      {
        qDef : {qDef : "Avg(["+yVal+"])"}
      }
    ],
    qSuppressZero : true,
    qSuppressMissing : true,
    qInitialDataFetch : [{
        qWidth :5,
        qHeight : 1500
    }]
  }
  app.createCube(qHyperCubeDef, function(reply) {
    //draw graph
    currentCubeID=reply.qInfo.qId;
    console.log(reply);
    viz($("#pokemonScatter"),reply,120);
    putInfo(reply.qHyperCube);
  });
}

//Put analysis info
function putInfo(data)
{
  console.log(data);
  var totalCount,currentCount;
  var maxXName=[],maxXValue,maxYName=[],maxYValue;
  var minXName=[],minXValue,minYName=[],minYValue;
  var maxXYName=[],maxXYValue=-1;
  var minXYName=[],minXYValue=99999;
  var sumX=0,sumY=0;
  var avgX,avgY;

  totalCount=data.qDimensionInfo[0].qCardinal;
  currentCount=data.qDimensionInfo[0].qStateCounts.qOption;
  maxXValue=data.qMeasureInfo[0].qMax;
  maxYValue=data.qMeasureInfo[1].qMax;
  minXValue=data.qMeasureInfo[0].qMin;
  minYValue=data.qMeasureInfo[1].qMin;

  $.each(data.qDataPages[0].qMatrix, function(key, value) {
    if(value[1].qNum==maxXValue)
      maxXName.push(value[0].qText);
    if(value[1].qNum==minXValue)
      minXName.push(value[0].qText);
    if(value[2].qNum==maxYValue)
      maxYName.push(value[0].qText);
    if(value[2].qNum==minYValue)
      minYName.push(value[0].qText);

    var tempXYSum=value[1].qNum+value[2].qNum;
    if(tempXYSum>maxXYValue){
      maxXYValue=tempXYSum;
      maxXYName=[];
      maxXYName.push(value[0].qText);
    }
    else if (tempXYSum==maxXYValue) {
      maxXYName.push(value[0].qText);
    }
    else if(tempXYSum<minXYValue){
      minXYValue=tempXYSum;
      minXYName=[];
      minXYName.push(value[0].qText);
    }
    else if(tempXYSum==minXYValue){
      minXYName.push(value[0].qText);
    }
    sumX+=value[1].qNum;
    sumY+=value[2].qNum;
  });

  avgX=(sumX/currentCount);
  avgY=(sumY/currentCount);

  var benchmarkPokemon=[],benchmarkDeviationValue=99999;
  $.each(data.qDataPages[0].qMatrix, function(key, value) {
    var xDeviation=(avgX-value[1].qNum)*(avgX-value[1].qNum);
    var yDeviation=(avgY-value[2].qNum)*(avgY-value[2].qNum);
    var tempBenchmarkValue=(xDeviation+yDeviation);
    if(tempBenchmarkValue<benchmarkDeviationValue){
      benchmarkDeviationValue=tempBenchmarkValue;
      benchmarkPokemon=[];
      benchmarkPokemon.push(value[0].qText);
    }
    else if (benchmarkDeviationValue==tempBenchmarkValue) {
      benchmarkPokemon.push(value[0].qText);
    }
    // console.log(benchmarkPokemon+" "+benchmarkDeviationValue);
  });

  infoDiv=$("#info-div");
  infoDiv.empty();
  infoDiv.append( "<p>Number of Pokemon in this category:"+currentCount+"/"+totalCount+"</p>");
  infoDiv.append( "<p>Pokemon with higest "+$("#x-axis-menu").val()+" : "+maxXName+"("+maxXValue+")</p>");
  infoDiv.append( "<p>Pokemon with higest "+$("#y-axis-menu").val()+" : "+maxYName+"("+maxYValue+")</p>");
  infoDiv.append( "<p>Pokemon with lowest "+$("#x-axis-menu").val()+" : "+minXName+"("+minXValue+")</p>");
  infoDiv.append( "<p>Pokemon with lowest "+$("#y-axis-menu").val()+" : "+minYName+"("+minYValue+")</p>");
  infoDiv.append( "<p>Strongest pokemon in this category:"+maxXYName+"("+$("#x-axis-menu").val()+"+"+$("#y-axis-menu").val()+"="+maxXYValue+")</p>");
  infoDiv.append( "<p>Weakest pokemon in this category:"+minXYName+"("+$("#x-axis-menu").val()+"+"+$("#y-axis-menu").val()+"="+minXYValue+")</p>");
  infoDiv.append( "<p>Average "+$("#x-axis-menu").val()+":"+avgX.toFixed(2)+" , "+"Average "+$("#y-axis-menu").val()+":"+avgY.toFixed(2)+"</p>");
  infoDiv.append( "<p>Benchmark pokemon is "+benchmarkPokemon+" , "+"(with deviation :"+benchmarkDeviationValue.toFixed(2)+")</p>");
}

//Graph rendering
var viz = function($element, layout,logoSize) {
  $element.empty();
  var id = senseUtils.setupContainer($element,layout,"scatter"),
  ext_width = $element.width(),
  ext_height = $element.height(),
  classDim = layout.qHyperCube.qDimensionInfo[0].qFallbackTitle.replace(/\s+/g, '-');    

  var data = layout.qHyperCube.qDataPages[0].qMatrix;

  var margin = {top: 50, right: 50, bottom: 50, left: 50 },
    width = ext_width - margin.left - margin.right,
    height = ext_height - margin.top - margin.bottom;

  var x = d3.scale.linear()
    .range([0, width]);
  var y = d3.scale.linear()
    .range([height, 0]);

  var xMax = d3.max(data, function(d) { return d[1].qNum; })*1.02,
    xMin = d3.min(data, function(d) { return d[1].qNum; })*0.98,
    yMax = d3.max(data, function(d) { return d[2].qNum; })*1.02,
    yMin = d3.min(data, function(d) { return d[2].qNum; })*0.98;
    
    var xMin2 = xMin == xMax ? xMin*0.5 : xMin;
    var xMax2 = xMin == xMax ? xMax*1.5 : xMax;
    var yMin2 = yMin == yMax ? yMin*0.5 : yMin;
    var yMax2 = yMin == yMax ? yMax*1.5 : yMax;
   
     x.domain([xMin2, xMax2]).nice();
     y.domain([yMin2, yMax2]).nice();    
   
  var color = d3.scale.category20();

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(-height)
      .tickFormat(d3.format(".2s")); 

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")  
      .tickSize(-width)       
      .tickFormat(d3.format(".2s"));

  var zoomBeh = d3.behavior.zoom()
      .x(x)
      .y(y)
      .scaleExtent([0, 500])
      .on("zoom", zoom);

  var svg = d3.select("#" + id)    
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")") 
     .call(zoomBeh);

  svg.append("rect")
    .attr("width", width)
    .attr("height", height);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", margin.bottom - 10)
    .style("text-anchor", "end")
    .text(senseUtils.getMeasureLabel(1,layout));

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text(senseUtils.getMeasureLabel(2,layout));  

  var plot = svg.append("svg")
    .classed("objects", true)
      .attr("width", width)
      .attr("height", height);  


    plot.selectAll(".dot")
        .data(data)
        .enter().append("svg:image")
        .attr("width", logoSize)
        .attr("height", logoSize)
        .attr("xlink:href", function(d) {
          console.log(d[0].qText+":"+d[1].qNum+","+d[2].qNum);
          if(d[1].qNum!="NaN" && d[2].qNum!="NaN"){
            var ref="https://img.pokemondb.net/sprites/x-y/normal/"+d[0].qText.toLowerCase()+".png";
            return ref;
          }
          else
            return null;
        })
        .attr("class", "dot "+classDim)
        .attr("transform", transform)
        .attr("id", function(d) { return d[0].qText.replace(/[^A-Z0-9]+/ig, "-"); })
        //.attr("cx", function(d) { return x(d.measure(1).qNum); })
        //.attr("cy", function(d) { return y(d.measure(2).qNum); })
        .style("fill", function(d) { return color(d[0].qText); })
        .on("mouseover", function(d){
          d3.selectAll($("."+classDim+"#"+d[0].qText.replace(/[^A-Z0-9]+/ig, "-"))).classed("highlight",true);
              d3.selectAll($("."+classDim+"[id!="+d[0].qText.replace(/[^A-Z0-9]+/ig, "-")+"]")).classed("dim",true);
          })
          .on("mouseout", function(d){
              d3.selectAll($("."+classDim+"#"+d[0].qText.replace(/[^A-Z0-9]+/ig, "-"))).classed("highlight",false);
              d3.selectAll($("."+classDim+"[id!="+d[0].qText.replace(/[^A-Z0-9]+/ig, "-")+"]")).classed("dim",false);
          })
            .append("title")
            .html(function(d) {
              var tempHtml=senseUtils.getDimLabel(1,layout) + ": " + d[0].qText;
              for(i=1;i<=layout.qHyperCube.qMeasureInfo.length;i++) {
                tempHtml += "<br/>" + senseUtils.getMeasureLabel(i,layout) + ": " + d[i].qText;
              }
              return tempHtml;
            });
    
    d3.select("input").on("click", change);

    $("image").error(function(){
            $(this).hide();
    });

    function change() {
      var xMax3 = d3.max(data, function(d) { return d[1].qNum; })*1.02;
      var xMin3 = d3.min(data, function(d) { return d[1].qNum; })*0.98;
      var yMax3 = d3.max(data, function(d) { return d[2].qNum; })*1.02;
      var yMin3 = d3.min(data, function(d) { return d[2].qNum; })*0.98;

      
      zoomBeh
        .x(x.domain([xMin3, xMax3]).nice())
        .y(y.domain([yMin3, yMax3]).nice());

      var svg = d3.select("#" + id).transition();

      svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(senseUtils.getMeasureLabel(1,layout));
      svg.select(".y.axis").duration(750).call(yAxis).select(".label").text(senseUtils.getMeasureLabel(2,layout));

      plot.selectAll(".dot").transition().duration(1000).attr("transform", transform);
    }

    function zoom() {
      svg.select(".x.axis").call(xAxis);
      svg.select(".y.axis").call(yAxis);

      svg.selectAll(".dot")
          .attr("transform", transform);
    }

    function transform(d) {    
      
      return "translate(" + x(d[1].qNum) + "," + y(d[2].qNum) + ")";

    }
}