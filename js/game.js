/**
 * Caça Palavras de Baunilha
 *
 * Release notes:
 * 		Version: 0.2
 * 		Date: 04/06/2016
 *
 * Changes:
 *
 *		## [0.2] - 15/09/2016
 *		### Changed
 *		- Corrigido o bug que permitia selecionar a mesma palavra multiplas vezes para ganhar o jogo
 * 		@author Giovanni Abate Neto
 * 		
 * Dev Notes:
 *		This code uses module design pattern
 *
 *TODO List:
 *		Validar os campos do input, tamanho e se esta vazio
 *      Remover algumas repeticoes de codigo
 *		Melhorar modulo Game
 *		Adicionar as palavras que precisam ser encontradas
 *      Não apagar qdo a palavra já estiver validada
 */

//Modulo de criacao do jogo
/*TODO melhorar esse modulo pois esta muito extenso assim dificultando a manutencao*/
var gameModule = (function(){

	//metodo para gerar aleatoriamente os caracteres que não fazem parte das palavras inseridas para o usuario
	var randomAlphabetLetter = function(){
		var char;
		var alphabet = "abcdefghijklmnopqrstuvwxyz";
		char = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
		return char;
		//retorne * para testar
		//return "*";
	}

	//metodo para gerar as posicoes 
	var generateWordPos = function(position,limit,isVert){
		if(isVert){
			if(position == "x"){
				return Math.floor(Math.random() * 10);
			}
			else{
				return Math.floor(Math.random() * limit);
			}			
		}
		else{
			if(position == "x"){
				return Math.floor(Math.random() * limit);
			}
			else{
				return Math.floor(Math.random() * 10);
			}
		}
		
	}

	//metodo para criar o objeto das palavras, as suas propriedades sao:
	//nome,array de seus caracteres,se e vertical ou nao,e posicoes 
	var createWord = function(word){
		
		WordObj = {
			name : word,
			arrChar : word.split(""),
			isVertical : Math.random() >= 0.5,
			size : word.split("").length
		};
		var limit = 10 - WordObj.size;		
		WordObj.positionX = generateWordPos("x",limit,WordObj.isVertical);
		WordObj.positionY = generateWordPos("y",limit,WordObj.isVertical);

		return WordObj;
	}

	//metodo para inserir os caracteres randomicamente
	var insertRandomChars = function(){
		console.log(randomAlphabetLetter());
		var tableCell =  document.querySelectorAll("td");
		for(i = 0;i<tableCell.length;i ++){
			if(tableCell[i].innerHTML == ""){
				tableCell[i].innerHTML = randomAlphabetLetter();
			}
		}

		
	}

	//metodo para criar a lista de palavras
	var createWordObjectList = function(wordsList){

		var arrWordsObj = [];
		for(var i = 0; i< wordsList.length; i ++){
			arrWordsObj[i] = createWord(wordsList[i]);
		}

		createEmptyTable();
		insertWordsList(arrWordsObj);


	}

	//metodo para inserir os caracteres das palavras
	var insertChar = function(wordObject,l){
		for(var l = 0; l < wordObject.arrChar.length; l ++){
			var x;
			var y;
			var tableCell;

			if(wordObject.isVertical){
				x = wordObject.positionX;					
				y = wordObject.positionY+l;

			}
			else{
				x = wordObject.positionX+l;
				y = wordObject.positionY;

			}	
			tableCell =  document.querySelector('[position-x="'+x+'"][position-y="'+y+'"]');
			tableCell.innerHTML = wordObject.arrChar[l];	
		}	
	}

	//metodo que verifica se a palavra pode ser inserida sem sobrescrever outra palavra ja inserida
	var testWordInsert = function(wordObject){

		for(var l = 0; l < wordObject.arrChar.length; l ++){
			var x;
			var y;
			var tableCell;

			if(wordObject.isVertical){
				x = wordObject.positionX;					
				y = wordObject.positionY+l;

			}
			else{
				x = wordObject.positionX+l;
				y = wordObject.positionY;

			}

			tableCell =  document.querySelector('[position-x="'+x+'"][position-y="'+y+'"]');
			if(tableCell.innerHTML != ""){
				if(tableCell.innerHTML != wordObject.arrChar[l]){
					return false;
				}
			}
			else{
				if(l == wordObject.arrChar.length-1){
					return true;
				}				
			}
		
		}
	}

	//metodo que insere as palavras no jogo
	var insertWord = function(wordObject,isFirstWord){

		if(isFirstWord){
			insertChar(wordObject);
		}
		else{
			if(testWordInsert(wordObject)){
				insertChar(wordObject);
			}
			else{
				var limit = 10 - wordObject.size;		
				wordObject.positionX = generateWordPos("x",limit,wordObject.isVertical);
				wordObject.positionY = generateWordPos("y",limit,wordObject.isVertical);

				insertWord(wordObject);
			}
		}

	}

	//metodo que cria a lista de palavras para serem inseridas
	var insertWordsList = function(wordObjList){
		for(var k = 0;k < wordObjList.length;k ++){	
			if(k == 0){
				insertWord(wordObjList[k],true);		
			}
			else{
				insertWord(wordObjList[k]);
			}			
									
		}
		insertRandomChars();
		dragAndDropModule.init();
	}

	//metodo que cria a tabela vazia
	var createEmptyTable = function(){
		var table = document.getElementById("game-table");
		var tableRow = [];
		var tableCell = [];
		for(var i = 0;i < 10;i ++){
			tableRow[i] = table.insertRow(i);	
			for(var j = 0;j < 10;j ++){
				tableCell[j] = tableRow[i].insertCell(j);
				tableCell[j].setAttribute("position-x", j);
				tableCell[j].setAttribute("position-y", i);
			}
		}
	};

	//metodo de inicializacao do modulo game
	var init = function(){
		var form = document.getElementById("gameConfigForm");
		var startButton = form.getElementsByTagName("button");

	
		startButton[0].onclick = function(e){
			e.preventDefault();
			var table = document.getElementById("game-table");
			table.innerHTML = "";
			var wordList = form.getElementsByTagName("input")[0].value;
			var arrWords = wordList.split(" ");
			createWordObjectList(arrWords);

		}
	};

return {
	init : init
};

})();

//Modulo dos eventos do mouse
var dragAndDropModule = (function(){

	//metodo de selecao do box
	var selectBox = function(box,boxList){
		box.style.backgroundColor = "yellow";
		for(var i = 0;i < boxList.length; i ++){
		boxList[i].onmouseover = function(){
			this.style.backgroundColor = "yellow";
		}; 		
	}
	};

	var insertFoundedWord = function(word){
		var textnode = document.createTextNode(word+" ");

		this.appendChild(textnode);
	}

	//metodo de validacao de selecao da palavra no box
	var validateBox = function(boxList){
		var form = document.getElementById("gameConfigForm");
		var wordList = form.getElementsByTagName("input")[0].value;
		var arrWords = wordList.split(" ");	
		var word = "";
		var div = document.getElementById("foundedWords");
		var foundedWords = div.getAttribute("data-words");

		for(var j = 0;j<boxList.length;j ++){
			boxList[j].onmouseover = function(){
				return false;
			}
			if(boxList[j].style.backgroundColor == "yellow"){
				word += boxList[j].textContent;
			}
		} 	

		if(arrWords.indexOf(word) > -1){
			for(var n = 0;n<boxList.length;n ++){
				if(boxList[n].style.backgroundColor == "yellow"){
					boxList[n].style.backgroundColor = "green";
				}
			}		
			if(foundedWords.indexOf(word) > -1){
				return false;
			}
			if(foundedWords != ""){
				foundedWords = foundedWords+","+word;	
			}
			else{
				foundedWords = word;	
			}

			div.setAttribute("data-words", foundedWords);
			insertFoundedWord.apply(div, [word]);

			return true;
		}
		else{
			for(var n = 0;n<boxList.length;n ++){
				if(boxList[n].style.backgroundColor == "yellow"){
					boxList[n].style.backgroundColor = "white";
				}
			}	
			return false;		
		}
		

		
	
	};

	//metodo de inicializacao do modulo de eventos do mouse
	var init = function(){
		var form = document.getElementById("gameConfigForm");
		var wordList = form.getElementsByTagName("input")[0].value;
		var arrWords = wordList.split(" ");			
		var table = document.getElementsByClassName("table-word")
		var boxChar = table[0].getElementsByTagName("td");
		var playerPoints = 0;
		for(var i = 0;i < boxChar.length; i ++){
			boxChar[i].onmousedown = function(){
				selectBox(this,boxChar);					
			}
			document.onmouseup = function(){
				if(validateBox(boxChar)){
					playerPoints ++;
				}
				if(arrWords.length == playerPoints)
				{
					alert("Parabéns você venceu!");
					location.reload();
				}				
			}


		}
		
	};

	return {
		init : init
	};

})();

gameModule.init();
