function comp(a, b){
	if (a[0] < b[0]) return -1;
	if (a[0] > b[0]) return 1;
	return 0;
}

$('.rightColumn').append('<div id="hiddenIframes" style="display:none"></div>');
$('.rightColumn').append('<img id="icanhazcheeseburger" src="https://i.imgur.com/gLghgPU.gif"></img><div id="chartContainer"></div>');

var chart = Highcharts.chart({
	chart: {
		defaultSeriesType: 'line',
		renderTo: 'chartContainer'
	},
	title: {
		text: ''
	},
	yAxis: {
		title: {
			text: 'Hind'
		}
	},
	xAxis: {
		type: 'datetime',
		dateTimeLabelFormats: {
			month: '%e. %b',
			year: '%b'
		},
		title: {
			text: 'Kuupäev'
		}
	},

	plotOptions: {
		series: {
			label: {
				connectorAllowed: false
			}
		}
	},
	tooltip: {
		valueSuffix: " €"
	}
});

var i = 0;
var j = 0;
var powers = [];
var heats = [];
var waters = [];
var dates = [];
var total = [];
$('#ctl00_ContentPlaceHolder1_YyrnikuArved1_GridView1 tr:contains("Üüriarve")').each(function(){
	var uri = $(this).find("td:eq(1) a").attr("href");
	if(uri != undefined){
		var t = parseFloat($(this).find("td:eq(4)")[0].innerText.replace(",","."));
		var d = $(this).find("td:eq(0)")[0].innerText.split(".");
		d = Date.UTC(parseInt(d[2]),parseInt(d[1])-1,parseInt(d[0]));
		total.push([d,t]);
		uri = "https://e-kyla.campusttu.ee/Tenant/"+uri;
		console.log(uri);
		$("<iframe id='ifr"+i+"'></iframe>").appendTo($("#hiddenIframes"));
		$("#ifr"+i).on("load",function(){
			var power = parseFloat($(this).contents().find(".listTable tr:contains('Elekter') td:eq(1)")[0].innerText.replace(",","."));
			var heat = parseFloat($(this).contents().find(".listTable tr:contains('Soojus') td:eq(1)")[0].innerText.replace(",","."));
			var water = parseFloat($(this).contents().find(".listTable tr:contains('Vesi') td:eq(1)")[0].innerText.replace(",","."));
			var dt = $(this).contents().find("#ctl00_ContentPlaceHolder1_TenantContractAccountDetails1_LabelAccountDate")[0].innerText.split(".");
			console.log(dt);
			dt = Date.UTC(parseInt(dt[2]),parseInt(dt[1])-1,parseInt(dt[0]));
			powers.push([dt,power]);
			heats.push([dt,heat]);
			waters.push([dt,water]);
			console.log(dt);
			console.log(power);
			console.log(heat);
			console.log(water);
			j++;
			console.log(j);
			console.log(i);
			if(i-1==j){
				powers.sort(comp);
				heats.sort(comp);
				waters.sort(comp);
				chart.addSeries({
					color: '#2389DA',
					name: 'Vesi',
					data: waters
				});
				chart.addSeries({
					color: '#DDFF51',
					name: 'Elekter',
					data: powers
				});
				chart.addSeries({
					color: '#FF0000',
					name: 'Soojus',
					data: heats
				});
				$("#icanhazcheeseburger").remove();
			}
		});
		$("#ifr"+i).attr("src",uri);
		i++;
	}
});
total.sort(comp);
chart.addSeries({
	color: '#000000',
	name: 'Kokku',
	data: total
});