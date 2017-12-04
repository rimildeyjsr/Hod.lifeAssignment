$(document).ready(function(){
    var dialog = document.querySelector('dialog');
    var result = document.getElementById("result");
    var totalPopulation = 0, noOfCountries = 0, averagePopulation = 0.0, highestPopulation = 0,
        lowestPopulation = 0;

    $.ajax({
        url: "https://restcountries.eu/rest/v2/all",
        dataType: "json",
        'type' : 'GET',
        success: function(data){
            console.log("got data!",data);

            lowestPopulation = parseInt(data[0].population);
            highestPopulation = parseInt(data[0].population);

            $.each(data, function(i, item) {
                var $tr = $('<tr>').append(
                    $('<td>').append($('<img class="flag-img">').attr("src",item.flag)),
                    $('<td>').text(item.name)
                ).appendTo('#table-body');

                console.log(item.population);
                totalPopulation += (parseInt(item.population));
                if (parseInt(item.population) > highestPopulation) {
                    highestPopulation = parseInt(item.population);
                }
                if (parseInt(item.population) < lowestPopulation) {
                    lowestPopulation = parseInt(item.population);
                }
                noOfCountries++;
            });

            averagePopulation = totalPopulation / noOfCountries;
            console.log(totalPopulation,highestPopulation,lowestPopulation,averagePopulation);

            $( "#dataTable tbody" ).on( "click", "tr", function() {
                $('.country-name').text(data[$(this).index()].name);
                $('.country-flag').attr("src",data[$(this).index()].flag);

                for (var prop in data[$(this).index()]) {

                    if (typeof (data[$(this).index()][prop]) === 'object') {

                        for (var item in data[$(this).index()][prop]) {

                            if(typeof (data[$(this).index()][prop][item]) === 'object'){

                                for (var obj in data[$(this).index()][prop][item]) {
                                    result.innerHTML += "<br/>" + prop + "  =  " + data[$(this).index()][prop][item][obj];
                                }

                            } else {
                                result.innerHTML += "<br/>" + prop + "  =  " + data[$(this).index()][prop][item];
                            }

                        }

                    } else {

                        result.innerHTML += "<br/>" + prop + "  =  " + data[$(this).index()][prop];
                    }

                }

                //population
                drawGraph(data[$(this).index()].name,data[$(this).index()].population);

                dialog.showModal();
            });

            dialog.querySelector('.close').addEventListener('click', function() {
                dialog.close();
            });

        },
        error: function(error){
            alert("Problems to retrieve data from the url! Sorry!");
        }
    });

    function drawGraph(country,population) {
        google.charts.load('current', {packages: ['corechart', 'bar']});
        google.charts.setOnLoadCallback(drawBasic);

        function drawBasic() {

            var data = google.visualization.arrayToDataTable([
                ['Country', 'Population', { role: 'style' }],
                ['Highest', highestPopulation, 'green'],
                ['Average', averagePopulation, 'blue'],
                ['Lowest', lowestPopulation, 'red'],
                [country, population, 'purple' ]
            ]);

            var options = {
                title: "Population with respect to the world",
                width: 600,
                height: 400,
                bar: {groupWidth: "95%"},
                legend: { position: "none" }
            };
            var chart = new google.visualization.ColumnChart(
                document.getElementById('chart_div'));

            chart.draw(data, options);
        }
    }

});

