<!--

 Copyright (c) 2014 BrightPoint Consulting, Inc.

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.

 -->

<!DOCTYPE html>
<head>
    <meta HTTP-EQUIV="X-UA-COMPATIBLE" CONTENT="IE=EmulateIE9">
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
    

    <title>POETA UFCG</title>
    <link type="text/css" rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/normalize.css">
    <link rel='stylesheet prefetch' href='http://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css'>
    <link rel="stylesheet" href="styles/menu_lateral1.css">
    <link rel="stylesheet" href="styles/balao.css">

	<script type="text/javascript" src="scripts/loader.js"></script>
    <script type="text/javascript" src="scripts/d3.min.js"></script>
    <script type="text/javascript" src="scripts/d3.tip.js"></script>
    <script type="text/javascript" src="scripts/main.js"></script>
    <script type="text/javascript" src="scripts/grafico_barras.js"></script>
    <script type="text/javascript" src="scripts/grafico_linhas.js"></script>
    <script type="text/javascript" src="scripts/funcoes_apoio.js"></script>
    <script src='scripts/jquery.min.js'></script>

</head>

<body onload="main()">
<div id="body" style="position: absolute; top:80px">
    <div id="toolTip" class="tooltip" style="opacity:0;">
        <div id="head" class="header"></div>
        <div id="header1" class="header1"></div>
        <div id="header2" class="header2"></div>
        <div style="position:absolute; left:10px">
            <div id="federalTip" class="tip" style="width:135px; left:0px; top:10px; position: absolute;">
                <div class="header3"><br>Alunos com nota >= 7</div>
                <div class="header-rule"></div>
                <div id="fedSpend" class="header4"></div>
            </div>
            <div id="stateTip" class="tip" style="width:125px; left:140px; top:10px; position: absolute;">
                <div class="header3"><br>Alunos com nota < 7</div>
                <div class="header-rule"></div>
                <div id="stateSpend" class="header4"></div>
            </div>
            <div id="localTip" class="tip" style="width:125px; left:270px; top:10px; position: absolute;">
                <div class="header3"><br>Desistentes</div>
                <div class="header-rule"></div>
                <div id="localSpend" class="header4"></div>
            </div>
        </div>
        <div class="tooltipTail"></div>
    </div>
</div>

<div id="toolTipAluno" class="tooltipAluno" style="opacity:0; top:-1000px;">
	<div id="headAluno" class="header">Notas</div>
    <div style="position:absolute; left:10px">
        <div id="grafico" style="width:125px; left:10px; top:0px; position: absolute;"></div>
	</div>
</div>

<div id="toolTipGrafLinha" class="tooltipGraf" style="opacity:0; top:-1000px;" >
	<div id="headGraf" class="header"></div>
            <div id="graficoLinhas"></div>
</div>

<div id="toolTipGrafTempo" class="tooltipGraf2" style="opacity:0; top:-1000px;">
	<div id="headGraf" class="header"></div>
            <div id="graficoTempo" class="tooltipGraf"></div>
</div>

<div id="nav" class="nav">
		<div class="icon">
			<ul>
				<li><a title="Home" href="#"><i class="fa fa-home "></i></a></li>
				<li><a href="#"><i class="fa fa-search "></i></a></li>
				<!-- <li><a href="#"><i class="fa fa-edit "></i></a></li> -->
				<li><a href="#"><i class="fa fa-cog "></i></a></li>
	
			</ul>
		</div>
		<div class="text">
			<ul>
				<li><a title="Home" href="#">Home</a></li>
					<li><a>
					<form>
						<INPUT id="federalButton" TYPE="RADIO" NAME="OPCAO" VALUE="op1" checked> Geral
						<INPUT id="stateButton" TYPE="RADIO" NAME="OPCAO" VALUE="op2"> Individual
					</form>
					</a>
</li>
	<!-- <li><a href="#" >Contact</a></li> -->
	<li><a href="#" >Settings</a></li>
			</ul>
		</div>
		<div class="info">
			<div>
			<p><input id="chck_dlt" id="faixa" type="checkbox" name="filtro" onclick="setar_opcoes('daltonico')"> 
			Usuário daltônico</p>
			<p><input id="chck_fx" id="faixa" type="checkbox" name="filtro" onclick="setar_opcoes('faixa_etaria')"> Faixa etária</p>
			de  <input class="info2" id="textDe" type="text" name="de" size="3">  até  <input class="info2" id="textAte" type="text" name="ate" size="3">
			</div>
			<div>
			<p>Sexo</p>
			<input id="chck_mas" type="checkbox" name="filtro" value="masculino" onclick="setar_opcoes('masculino')"> Masculino
			<input id="chck_fem" type="checkbox" name="filtro" value="feminino" onclick="setar_opcoes('feminino')"> Feminino
			</div>
			<p> Estado civil</p>
			<input id="chck_sol" type="checkbox" name="filtro" value="solteiro" onclick="setar_opcoes('solteiro')"> Solteiro
			<input id="chck_cas" type="checkbox" name="filtro" value="casado" onclick="setar_opcoes('casado')"> Casado
			<div>
			<p> Escola de origem</p>
			<input id="chck_pub" type="checkbox" name="filtro" value="publica" onclick="setar_opcoes('publica')"> Publica
			<input id="chck_par" type="checkbox" name="filtro" value="particular" onclick="setar_opcoes('particular')"> Particular
			</div>
			<br>
			<button class="info2" type="filtro" class="btn btn-primary" onclick="filtrar()">OK</button>
		</div>
	</div>
</body>
<script type="text/javascript" src="scripts/inicio.js"></script>
</html>
