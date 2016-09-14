var config = {
    host: "playground.qlik.com",
    prefix: "/showcase/",
    port: "443",
    isSecure: true,
    rejectUnauthorized: false,
    appname: "d8f60a81-5613-4c01-96a7-7888d8d18262"
};

var app;
var pokeName = "None";
var pokeInfo;

function authenticate(){
 
    window.location.pathname = "/liveshowcase/pokemonApp/main.html";
  
  // return;
}
function main() {
    require.config({
        baseUrl: (config.isSecure ? "https://" : "http://") + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources",
    });

    require(['js/qlik'], function (qlik) {
        //we're now connected
        qlik.setOnError(function (error) {
            console.log(error);
        });
        console.log("Connecting to appname: " + config.appname);
        app = qlik.openApp(config.appname, config);
        console.log(app);

        //app.visualization.create('table', ["Pokemon Name"],
        //{ "title": "On the fly barchart" }
        //).then(function (vis) {
        //    vis.show("myelement");
        //});

        app.createList({
            "qDef": {
                "qFieldDefs": [
                    "Pokemon Name"
                ]
            },
            "qInitialDataFetch": [{
                qTop: 0,
                qLeft: 0,
                qHeight: 1000,
                qWidth: 1
            }]
        }, function (reply) {
            var str = "<select class='lui-select'>";
            var i = 1;

            $.each(reply.qListObject.qDataPages[0].qMatrix, function (key, value) {
                if (i == 1 && pokeName.localeCompare("None") == 0) {
                    str += '<option value=' + i + ' selected pokeName="' + value[0].qText + '" pokeImg="https://img.pokemondb.net/artwork/' + value[0].qText + '.jpg">' + value[0].qText + '</option>';
                }
                else if (pokeName.localeCompare(value[0].qText) == 0) {
                    str += '<option value=' + i + ' selected pokeName="' + value[0].qText + '" pokeImg="https://img.pokemondb.net/artwork/' + value[0].qText + '.jpg">' + value[0].qText + '</option>';
                }
                else {
                    str += '<option value=' + i + ' pokeName="' + value[0].qText + '" pokeImg="https://img.pokemondb.net/artwork/' + value[0].qText + '.jpg">' + value[0].qText + '</option>';
                }
                i++;
            });
            str += "</select>";
            $('#list').html(str);

            ;
        });

        app.createList({
            "qDef": {
                "qFieldDefs": [
                    "Pokemon Name"
                ]
            },
            "qInitialDataFetch": [{
                qTop: 0,
                qLeft: 0,
                qHeight: 1000,
                qWidth: 1
            }]
        }, function (reply) {
            var str = "<select class='lui-select'>";
            var i = 1;

            $.each(reply.qListObject.qDataPages[0].qMatrix, function (key, value) {
                if (i == 1 && pokeName.localeCompare("None") == 0) {
                    str += '<option value=' + i + ' selected pokeName="' + value[0].qText + '" pokeImg="https://img.pokemondb.net/artwork/' + value[0].qText + '.jpg">' + value[0].qText + '</option>';
                }
                else if (pokeName.localeCompare(value[0].qText) == 0) {
                    str += '<option value=' + i + ' selected pokeName="' + value[0].qText + '" pokeImg="https://img.pokemondb.net/artwork/' + value[0].qText + '.jpg">' + value[0].qText + '</option>';
                }
                else {
                    str += '<option value=' + i + ' pokeName="' + value[0].qText + '" pokeImg="https://img.pokemondb.net/artwork/' + value[0].qText + '.jpg">' + value[0].qText + '</option>';
                }
                i++;
            });
            str += "</select>";
            $('#list').html(str);
            //self.field("Pokemon Name", ["Snorlax"], true);

            ;
        });

        pokeInfo = app.createTable(["Pokemon Name", "Base Happiness", "Attack", "Defense", "Evolution", "Gender", "Weight (kg)", "Speed"], { rows: 1 });
        var listener = function () {
            $('#pokeName').html(pokeInfo.rows[0].dimensions[0].qText);
            $('#pokeHappi').html(pokeInfo.rows[0].dimensions[1].qText);
            $('#pokeAttack').html(pokeInfo.rows[0].dimensions[2].qText);
            $('#pokeDefense').html(pokeInfo.rows[0].dimensions[3].qText);
            $('#pokeEvolution').html(pokeInfo.rows[0].dimensions[4].qText);
            $('#pokeGender').html(pokeInfo.rows[0].dimensions[5].qText);
            $('#pokeWeight').html(pokeInfo.rows[0].dimensions[6].qText + ' kg');
            $('#pokeSpeed').html(pokeInfo.rows[0].dimensions[7].qText);
            console.log(pokeInfo.rows[0].dimensions[0].qText);
            pokeInfo.OnData.unbind(listener);
        };
        pokeInfo.OnData.bind(listener); //bind the listener


        pokeAbility = app.createTable(["Ability Name"], { rows: 20 });
        var listener2 = function () {
            var abilities = "";
            var selAbilities = new Array();
            for (var j = 0; j < pokeAbility.rowCount; j++) {
                abilities += pokeAbility.rows[j].dimensions[0].qText + "<br>";
                selAbilities.push({ qText: pokeAbility.rows[j].dimensions[0].qText });
            }
            $('#pokeAbility').html(abilities);
            console.log(selAbilities);
            pokeAbility.OnData.unbind(listener2);

            app.clearAll();
            app.field('Ability Name').selectValues(selAbilities, false, true);

            setTimeout(loadAbilities, 1000);

            console.log(selAbilities);
        };
        pokeAbility.OnData.bind(listener2); //bind the listener


        $('#list').on('change', function () {
            var imgUrl = $('option:selected', this).attr('pokeImg');
            pokeName = $('option:selected', this).attr('pokeName');
            imgUrl = imgUrl.toLowerCase();
            $(".pokeImage").css('background-image', 'url(' + imgUrl + ')');
            app.field("Pokemon Name").selectValues([pokeName], false, true);
            pokeInfo.OnData.bind(listener); //bind the listener
            pokeAbility.OnData.bind(listener2); //bind the listener
        });

        function loadAbilities() {
            console.log("Create Table");
            pokeNames = app.createTable(["Pokemon Name"], { rows: 50 });
            var listener3 = function () {
                var str = "";
                console.log(pokeNames);
                console.log(pokeNames.rowCount);
                for (var j = 0; j < pokeNames.rowCount - 3; j++) {
                    console.log(pokeNames.rows[j]);
                    imgUrl = pokeNames.rows[j].dimensions[0].qText.toLowerCase();
                    str += '<div class="row"><div class="col-md-4"><img src="https://img.pokemondb.net/artwork/' + imgUrl + '.jpg" width="200px" /></div><div class="col-md-8">' + pokeNames.rows[j].dimensions[0].qText + '</div></div>'
                    $('#relatedPokemons').html(str);
                }
                pokeAbility.OnData.unbind(listener3);
            };
            pokeNames.OnData.bind(listener3); //bind the listener
        }


    });
}