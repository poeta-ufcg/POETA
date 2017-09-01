const coresAtividades=['darkblue','lightgreen','lightblue','darkgreen','darkorange','lightpurple',
						'darkred','lightorange','darkpurple','lightred','darkgold','lightgold'];
const corSobreposicao="sobreposicao";
var nomesAtividades;
var prazos;
var filhos;

function exibirTimeline(d){
const element = document.getElementById('timelineGraf');
var inicioAtv;
var fimAtv;
filhos = [];
getLeafs(d,filhos);
var timelineGraf = d3.select(element);
nomesAtividades = getActivitiesName(d);
prazos = getActivitiesPrazos(d,filhos);

timelineGraf.style("height", (filhos.length*35 + 70) + "px");
var data = [];

var previsoes=[];
for(var i = 0; i < nomesAtividades.length; i++){
	previsoes.push({label: nomesAtividades[i],
					type: TimelineChart.TYPE.INTERVAL,
					from: converteData(prazos[i].inicio),
					to: makeDataWithTime(prazos[i].fim),
					customClass: coresAtividades[(i)%coresAtividades.length]});
}
data.push({label: "Planejamento",
			data: previsoes});
data.push({label: "",
			data: []});

var fimAtvAnterior;
var inicioAtvAtual;
var limiteAtvAtual;
var fimAtvAtual;
var inicioProxAtv;

for(var i = 0; i < filhos.length; i++){
	var entregas=[];
	for(var j = 1; j < d.depth; j++){
		limiteAtvAtual = filhos[i]["Data Fim "+(j)];
		fimAtvAtual = limiteAtvAtual;
		inicioProxAtv = filhos[i]["Data Inicio "+(j+1)];
		var fimProxAtv = filhos[i]["Data Fim "+(j+1)];
		console.log(fimAtvAtual);
		console.log(fimProxAtv);

		if(fimAtvAtual === '' || fimAtvAtual == undefined){ //Atividade não foi entregue
			continue;
		}

		if(fimAtvAnterior){ //Teve sobreposicao
			inicioAtvAtual = fimAtvAnterior;
			fimAtvAnterior = undefined;
		}
		else{
			inicioAtvAtual = converteData(filhos[i]["Data Inicio "+j]);
		}

		if((fimProxAtv !== '' && fimProxAtv !== undefined) && j < d.depth-1 && converteData(inicioProxAtv) <= converteData(fimAtvAtual)){
			fimAtvAnterior = makeDataWithTime(limiteAtvAtual);
			limiteAtvAtual = filhos[i]["Data Inicio "+(j+1)];

			entregas.push({label: nomesAtividades[j-1],
						type: TimelineChart.TYPE.INTERVAL,
						from: inicioAtvAtual,
						to: converteData(limiteAtvAtual),
						customClass: coresAtividades[(j-1)%coresAtividades.length]});

			entregas.push({label: 'Paralelo',
						type: TimelineChart.TYPE.INTERVAL,
						from: converteData(limiteAtvAtual),
						to: makeDataWithTime(fimAtvAtual),
						customClass: corSobreposicao,
						atividades: [j-1,j],
						aluno: i});
		}
		else{
			entregas.push({label: nomesAtividades[j-1],
						type: TimelineChart.TYPE.INTERVAL,
						from: inicioAtvAtual,
						to: makeDataWithTime(fimAtvAtual),
						customClass: coresAtividades[(j-1)%coresAtividades.length]});
		}
	}
	data.push({label: filhos[i]["Level18"],
				data: entregas});
}

        const timeline = new TimelineChart(element, data, {
            enableLiveTimer: true,
            tip: function(d) {
                return d.at || `${d.from}<br>${d.to}`;
            }
        });

        setOnMouseOver(timelineGraf);
}

function setOnMouseOver(timeline){
	var svg = timeline.select("svg");

        svg.selectAll("."+corSobreposicao)
					.on('mouseover', function(d){
							addTimelineDetalhe(d);
						})
					.on('mouseout', function(d){
							removeTimelineDetalhe();
						});
}

function addTimelineDetalhe(info){
	var timelineElement = document.createElement("div");
	timelineElement.id = "timelineDetalhe";
	document.body.appendChild(timelineElement);

	var timeline = d3.select(timelineElement);
	timeline.style("position","absolute")
			.style("background","#FFFFFF")
			.style("height", (info.atividades.length*35 + 70) + "px")
			.style("width","500px")
			.style("left", (d3.event.pageX - 200) + "px")
            .style("top", (d3.event.pageY + 30) + "px");

	var data = [];
	for(var i=0; i < info.atividades.length; i++){
		data.push({label: nomesAtividades[info.atividades[i]],
					data: [{label: "",
						type: TimelineChart.TYPE.INTERVAL,
						from: converteData(filhos[info.aluno]["Data Inicio "+(info.atividades[i]+1)]),
						to: makeDataWithTime(filhos[info.aluno]["Data Fim "+(info.atividades[i]+1)]),
						customClass: coresAtividades[(info.atividades[i])%coresAtividades.length]}]});
	}

	const x = new TimelineChart(timelineElement, data, {
            enableLiveTimer: true,
            tip: function(d) {
                return d.at || `${d.from}<br>${d.to}`;
            }
        });
}

function removeTimelineDetalhe(){
	var timelineDetalhe = document.getElementById('timelineDetalhe');
	if(timelineDetalhe){
		timelineDetalhe.parentNode.removeChild(timelineDetalhe);
	}
}

function getActivitiesName(d){
	var array = [];
	const depth = d.depth-2; //Retira dois pois as atividades começam na profundidade 2
	for(var i = 0; i <= depth; i++){
		array[depth - i] = d.key;
		d = d.parent;
	}
	return array;
}

function getActivitiesPrazos(d,filhos){
	var prazos=[];
	const depth = d.depth-1; //Retira 1 pois a primeira atividade na verdade é apenas a identificação da turna
	for(var i = 0; i < filhos.length; i++){
		if(filhos[i]["Data Fim "+depth]){
			for(var j=1; j < d.depth; j++){
				prazos.push({inicio: filhos[i]["Data Inicio "+j],
							fim: filhos[i]["Data Fim "+j]});
			}
			break;
		}
	}
	return prazos;
}

function makeDataWithTime(data){
	return new Date(Number(data.slice(6,10)), Number(data.slice(3,5)), Number(data.slice(0,2)),23,59,59,0);
}
