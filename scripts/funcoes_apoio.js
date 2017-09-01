function converteData(data){
	 return new Date(Number(data.slice(6,10)), Number(data.slice(3,5)), Number(data.slice(0,2)));
 }

function removeEmptyNodes(node,parent,id) {
		if(!node.values) return
        if(node.key === ""){
			var tam = parent.values.length;
			for(var k = 0; k < node.values.length-1; k++){
				parent.values[k+tam] = parent.values[id+k+1];
			}
			for(var j = 0; j < node.values.length; j++){
				parent.values[id+j] = node.values[j];
			}
			node = parent.values[id];
			if(!node.values) return
		}
		for(var i = 0; i < node.values.length; i++){
			removeEmptyNodes(node.values[i],node,i);
			if(node.values[i].key === "") i--;
		}
    }

    var nos_apagados = [];
    var opcoes = [false, true, true, true, true, true, true, false];

function setar_opcoes(op){
		switch (op){
			case "faixa_etaria":
				opcoes[0] = !opcoes[0];
				break;
			case "masculino":
				opcoes[1] = !opcoes[1];
				break;
			case "feminino":
				opcoes[2] = !opcoes[2];
				break;
			case "solteiro":
				opcoes[3] = !opcoes[3];
				break;
			case "casado":
				opcoes[4] = !opcoes[4];
				break;
			case "publica":
				opcoes[5] = !opcoes[5];
				break;
			case "particular":
				opcoes[6] = !opcoes[6];
				break;
			case "daltonico":
				opcoes[7] = !opcoes[7];
				break;
		}
	}

  function filtrar(){
		//console.log(root);
		if(opcoes[7]) {
			escala = d3.scale.linear().range(coresDaltonico);
			escalaNota = d3.scale.linear().range(coresDaltonico);
		}else{
		 	escala = d3.scale.linear().range(cores);
			escalaNota = d3.scale.linear().range(cores);
		}
		escala.domain(dominio);
		escalaNota.domain(dominioNotas);
		recuperarNosFiltrados();
		var folhas = [];
		getLeafs(root,folhas);
		for(var i=0; i < folhas.length; i++){
			if(!opcoes[1] && folhas[i]["sexo"]==="M"
				|| !opcoes[2] && folhas[i]["sexo"]==="F"
				|| !opcoes[3] && folhas[i]["estadoCivil"]==="SOLTEIRO"
				|| !opcoes[4] && folhas[i]["estadoCivil"]==="CASADO"
				|| !opcoes[5] && folhas[i]["escola"]==="PUBLICA"
				|| !opcoes[6] && folhas[i]["escola"]==="PARTICULAR"){


				if(folhas[i].parent.children == null){
					folhas[i].parent.children = folhas[i].parent._children;
					folhas[i].parent._children = null;
				}
				var filhos = folhas[i].parent.children;

				for(var j=0; j < filhos.length; j++){
					if (filhos[j] === folhas[i]){
						nos_apagados.push([filhos[j],j]);
						filhos.splice(j,1);
						break;
					}
				}
			}

			else if(opcoes[0]){
				var de = document.getElementById("textDe");
				var ate = document.getElementById("textAte");
				if(Number(folhas[i]["idade"]) < Number(de.value) || Number(folhas[i]["idade"]) > Number(ate.value)){
					var filhos = folhas[i].parent.children;
					for(var j=0; j < filhos.length; j++){
						if (filhos[j] === folhas[i]){
							nos_apagados.push([filhos[j],j]);
							filhos.splice(j,1);
							break;
						}
					}
				}
			}
		}
		update(root);
	}

function recuperarNosFiltrados(){
		var pai;
		for(var i=nos_apagados.length-1; i >= 0; i--){
			if(opcoes[1] && nos_apagados[i][0]["sexo"]==="M"
				|| opcoes[2] && nos_apagados[i][0]["sexo"]==="F"
				|| opcoes[3] && nos_apagados[i][0]["estadoCivil"]==="SOLTEIRO"
				|| opcoes[4] && nos_apagados[i][0]["estadoCivil"]==="CASADO"
				|| opcoes[5] && nos_apagados[i][0]["escola"]==="PUBLICA"
				|| opcoes[6] && nos_apagados[i][0]["escola"]==="PARTICULAR"
				){

					pai = nos_apagados[i][0].parent;
					if(pai.children == null){
						pai.children = pai._children;
						pai._children = null;
					}
					pai.children.splice(nos_apagados[i][1],0,nos_apagados[i][0]);
					nos_apagados.splice(i,1);
				}
		}
	}

function setAnimacao(nodes) {
        for (var y = 0; y < nodes.length; y++) {
            var node = nodes[y];
           if (node.children) {
                setAnimacao(node.children);
               for (var z = 0; z < node.children.length; z++) {
                   var child = node.children[z];
                   for (var i = 0; i < sumFields.length; i++) {
                        if (isNaN(node["sum_" + sumFields[i]])) node["sum_" + sumFields[i]] = 0;
                        node["sum_" + sumFields[i]] += Number(child["sum_" + sumFields[i]]);
                   }
               }
           }
           else {
              for (var i = 0; i < sumFields.length; i++) {
                    node["sum_" + sumFields[i]] = Number(node[sumFields[i]]);
                    if (isNaN(node["sum_" + sumFields[i]])) {
                        node["sum_" + sumFields[i]] = 0;
                    }
               }
          }

       }
    }

function getLeafs(node,leafs){
		var childrens;
		if(node.children){
			node[campo[4]] = 0;
			node[campo[3]] = 0;
			node[campo[2]] = 0;
			node[campo[1]] = 0;
			node[campo[0]] = 0;
			childrens = node.children;
		}
		if(node._children){
			childrens = node._children;
		}
		if(childrens){
			for(var i = 0; i < childrens.length; i++){
				getLeafs(childrens[i],leafs);
			}
		}
		else{
			if(typeof node.id_num !== "string" || (typeof node.id_num === "string" && node.id_num.indexOf("noGeral") === -1)) {
				leafs.push(node);
			}
		}
	}

function colocarBalao(node){
		if(!node.children){
			return;
		}

		if(typeof node[campo[3]] != "undefined"){
			if(node[campo[3]] > 0){
				var qntBaloes = d3.selectAll(document.getElementsByName("balao"))[0].length;

				d3.select(document.getElementById("body")).append("div")
						.attr("name","balao")
						.attr("class","balao2")
						.attr("id", node.id_num)
						.style("left", (node.y+68)+"px")
						.style("top", (node.x-949-65*qntBaloes)+"px")
						.text(""+node[campo[3]]+" Desistência(s)");
			}
		}
		for(var i = 0; i < node.children.length; i++){
			colocarBalao(node.children[i]);
		}
	}

function removerBalao(){
		d3.selectAll(document.getElementsByName("balao")).remove();
	}

var formatCurrency = function (d) {
        return d
    };

function esconderGrafico(d) {

					var timeline = document.getElementById('timelineGraf');
					if(timeline){
						timeline.parentNode.removeChild(timeline);
					}

					toolTipGrafLinhas.transition()
					.duration(200)
					.style("opacity", "0")
					.transition()
					.duration(0)
					.style("top","-1000px");

					 toolTip.transition()
					.duration(200)
					.style("opacity", "0")
					.transition()
					.duration(0)
					.style("top","-1000px");

					toolTipGrafTempo.transition()
					.duration(200)
					.style("opacity", "0")
					.transition()
					.duration(0)
					.style("top","-1000px");

					toolTipAluno.transition()
					.duration(200)
					.style("opacity", "0")
					.transition()
					.duration(0)
					.style("top","-1000px");
					apagaGrafBarras();
          // d3.select(circles[d.key]).transition().style("fill-opacity",0.3);
        }

function exibirGrafico(d) {
	if(isLeaf(d)) {
		if(detalhes){
				geraGraficoTempo(d);
				toolTipGrafTempo.transition()
					.duration(200)
					.style("opacity", "1");
				toolTipGrafTempo.style("left", (d3.event.pageX - 700) + "px")
					.style("top", (d3.event.pageY + 30) + "px");
		}
		else{
				desenharGrafBarras(d);
				toolTipAluno.transition()
					.duration(200)
					.style("opacity", "1");
				toolTipAluno.style("left", (d3.event.pageX - 220) + "px")
					.style("top", (d3.event.pageY + 30) + "px");
		}
	}
		else {
			if (detalhes){
					geraGraficoLinhas(d);
					toolTipGrafLinhas.transition()
							.duration(200)
							.style("opacity", "1");
					toolTipGrafLinhas.style("left", (d3.event.pageX - 400) + "px")
              .style("top", (d3.event.pageY + 30) + "px");
			}
			else{
				sumNodesCopia(d);
				toolTip.transition()
               .duration(200)
               .style("opacity", "1");

				document.getElementById("quadro_1").innerText = "Alunos com nota >= 7";
				document.getElementById("quadro_2").innerText = "Alunos com nota < 7";
				document.getElementById("quadro_3").innerText = "Desistentes";
				document.getElementById("btnEntregas").innerText = "Prazos";
				header.text(d["source_Level1"]);
				header1.text("Atividade: " + d.key);
				header2.html("");
				fedSpend.text(d[campo[0]]);
				stateSpend.text(d[campo[1]]);
				localSpend.text(d[campo[2]]);
				toolTip.style("left", (d3.event.pageX - 220) + "px")
               .style("top", (d3.event.pageY - 60) + "px");
			}
		}
}

function setTextModoPesquisa(){
	var div_mode_pesq = document.getElementById("modo_pesquisa");
	if(detalhes)
		div_mode_pesq.innerText = "Modo de visualização Individual";
	else
		div_mode_pesq.innerText = "Modo de visualização Geral";
}

function exibirPrazos(){
	esconderGrafico(d3.select(document.getElementById("node_"+lastNodeId)));
	var timeline = document.createElement("div");
	timeline.id = "timelineGraf";
	document.body.appendChild(timeline);

	var button  = document.createElement("button");
	button.id = "sairTimelineGraf";
	button.innerText = "X";
	timeline.appendChild(button);

	d3.select(document.getElementById('sairTimelineGraf'))
				.style("position","absolute")
				.style("left", 800 + "px")
			  .style("top", -2 + "px");

	d3.select(document.getElementById("sairTimelineGraf"))
								.on("click", function(d){
									sair();
	});

	timeline = d3.select(document.getElementById('timelineGraf'));

	timeline.style("position","absolute")
				.style("width","800px")
				.style("height","200px")
				.style("background", "#FFFFFF");

	exibirTimeline(lastNode);

	timeline.style("left", (d3.event.pageX - 100) + "px")
            .style("top", (d3.event.pageY + 10) + "px");
}

function exibirEntregas(){
			var filhos = [];
			var node = lastNode;
			getLeafs(node, filhos);
			var inicioAtv = filhos[0]["Data Inicio " + (lastNode.depth-1)];
			var fimAtv = filhos[0]["Data Fim "+(lastNode.depth-1)];
			var em_dia = 0, atrasados = 0, nao_entregaram = 0;

			document.getElementById("quadro_1").innerText = "No prazo";
			document.getElementById("quadro_2").innerText = "Atrasados";
			document.getElementById("quadro_3").innerText = "Não entregue";
			document.getElementById("btnEntregas").innerText = "Notas";
			header2.html( " inicio: " + inicioAtv + " - " + " fim: " + fimAtv);

			for(var i = 0; i < filhos.length; i++){
				var filhoAtual = filhos[i];
				if(''=== filhoAtual["Data Fim "+(lastNode.depth-1)]) nao_entregaram++;
				else if(converteData(filhoAtual["Data Fim "+(lastNode.depth-1)]) <= converteData(fimAtv)) em_dia++;
				else  atrasados ++;
			}

			fedSpend.text(formatCurrency(em_dia));
			stateSpend.text(formatCurrency(atrasados));
			localSpend.text(formatCurrency(nao_entregaram));
}

function esconderFolhas(d){
	var folhas = [];
	var parentsId = [];
	getLeafs(d,folhas);
	for(var i = 0; i < folhas.length; i++){
		if(contains(folhas[i].parent.id_num, parentsId)){
			d3.select(document.getElementById("node_"+folhas[i].id_num)).remove();
			// d3.select(document.getElementById("link_" + folhas[i].target.key)).remove();
		}else
			parentsId.push(folhas[i].parent.id_num);
	}
}

function contains(element,list){
	for(var i = 0; i < list.length; i++)
		if(list[i] == element)
			return true;
	return false;
}

function onClickNo(d){
	if(clickada){
			d3.select(labels[d.id_num]).transition().style("font-weight","bold").style("font-size","16");
			if(d.linkColor == cor_AtividadeSemNota && !detalhes)
				msgAttSemNota();
			else
					exibirGrafico(d);
			d3.select(document.getElementById("node_" + d.id_num))
									.select("circle")
									.attr("r", raio+20);
	}
	else{
		d3.select(labels[d.id_num]).transition().style("font-weight","normal").style("font-size","12");
		if(document.getElementById("attSemNota"))
				document.getElementById("attSemNota").remove();
		else {
				esconderGrafico(d);
				d3.select(document.getElementById("divEntregas")).remove();
		}
		d3.select(document.getElementById("node_" + lastNodeId))
									.select("circle")
									.attr("r", raio+10);
	}

	clickada = !clickada;
}

function msgAttSemNota(){
	var attSemNota = document.createElement("div");
	attSemNota.id = "attSemNota";
	document.body.appendChild(attSemNota);
	document.getElementById("attSemNota").innerText = "Atividade sem nota";
	attSemNota = document.getElementById("attSemNota");
	attSemNota.style.position = "absolute";
	attSemNota.style.width = "280px"
	attSemNota.style.left = (d3.event.pageX - 105) + "px";
	attSemNota.style.top = (d3.event.pageY - 65) + "px";
	attSemNota.style.fontSize = "x-large";
}

function isLeaf(d){
	return !(d.children || d._children);
}

function setToolTip(){
	if(document.getElementById("quadro_1").textContent == "Alunos com nota >= 7")
			exibirEntregas();
	else{
		sumNodesCopia(lastNode);
		document.getElementById("quadro_1").innerText = "Alunos com nota >= 7";
		document.getElementById("quadro_2").innerText = "Alunos com nota < 7";
		document.getElementById("quadro_3").innerText = "Desistentes";
		document.getElementById("btnEntregas").innerText = "Prazos";
		header2.html("");
		fedSpend.text(lastNode[campo[0]]);
		stateSpend.text(lastNode[campo[1]]);
		localSpend.text(lastNode[campo[2]]);
	}
}

function sair(){
	esconderGrafico(lastNode);
	d3.select(document.getElementById("node_" + lastNodeId))
								.select("circle")
								.attr("r", raio+10);
	d3.select(labels[lastNode.id_num]).transition().style("font-weight","normal").style("font-size","12");
	clickada = !clickada;
}

function createNosGerais(r){
	var leafs = [];
	getLeafs(r, leafs);
	var lastParentId = leafs[0].parent.id_num;
	var noGeralDaVez = criarNoGeral(leafs[0]);
	var qntAlunos = 1;
	for(var i = 1; i < leafs.length; i++){
		if(leafs[i].parent.id_num != lastParentId){
			lastParentId = leafs[i].parent.id_num;
			calcularMediaNotas(noGeralDaVez, qntAlunos);
			noGeralDaVez = criarNoGeral(leafs[i]);
			qntAlunos = 0;
		}
		else{
			inserirInformacoesNoGeral(noGeralDaVez, leafs[i]);
		}
		qntAlunos++;
	}


	//Cria um nó geral que inicialmente irá conter uma cópia das informações de atividades e notas do nó pasado como parâmetro
	//O nó geral será inserido na lista de filhos ainda não exibido do pai do nó passado como parâmetro
	function criarNoGeral(node) {
 		var noGeral = {};
 		for(var i = 1; node["Level"+i] != "" && node["Level"+i] != undefined; i++){
 			noGeral["Level"+i] = node["Level"+i];
			if(!parseInt(node["Nota"+i])) noGeral["Nota"+i] 	= 0;
			else
 				noGeral["Nota"+i] = node["Nota"+i];
 		}
 		noGeral.parent = node.parent;
 		noGeral.id_num = "noGeral"+node.id_num;
 		node.parent._children.push(noGeral);

  		return noGeral;
	}

	function inserirInformacoesNoGeral(noGeral,node){
		for(var i = 1; node["Level"+i] != "" && node["Level"+i] != undefined; i++){
			if(!parseInt(node["Nota"+i])) noGeral["Nota"+i] += 0;
			else
 				noGeral["Nota"+i] += node["Nota"+i];
 		}
	}

	function calcularMediaNotas(noGeral, qntAlunos){
		for(var i = 1; noGeral["Level"+i] != "" && noGeral["Level"+i] != undefined; i++){
 			noGeral["Nota"+i] = noGeral["Nota"+i]/qntAlunos;
 		}
	}
}

function getNosGerais(node,nosGerais){
	if(String(node.id_num).indexOf("noGeral") !== -1){
		nosGerais.push(node);
	}
	else {
		if(node.children){
			for(var i = 0; i < node.children.length; i++)
				getNosGerais(node.children[i], nosGerais);
		}
	}
}

function circuloNoGeral(d){
	var nosGerais = [];
	getNosGerais(d, nosGerais);
	for(var i = 0; i < nosGerais.length; i++){
			d3.select(document.getElementById("node_"+nosGerais[i].id_num)).append("svg:circle")
			.attr("r", "10")
			.style("fill-opacity", "1")
			.style("stroke", "#000000");
		}
}
