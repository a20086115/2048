var documentWidth;
var gridContainerWidth;
var cellSpace;
var cellSideLength;
(function(doc, win) {
	console.log("a");
    setRem();
    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
      recalc = function() {
     	 setRem();
     	 
     	 updateBoardView();
      };
    if (!doc.addEventListener) {
		return;
	}
    win.addEventListener(resizeEvt, recalc, false);
})(document, window);

function setRem() {
    var docEl = document.documentElement;
    documentWidth  = docEl.clientWidth;
    if (!documentWidth) {
      return;
    }
    if(documentWidth > 500){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    } else {
    	console.log(documentWidth);
    	gridContainerWidth = 0.90 * documentWidth;
		cellSideLength = 0.18 * documentWidth;
		cellSpace = 0.036*documentWidth;
    }
    $('#grid-container').css('width',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius',0.02*gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02*cellSideLength);
}


function getPosTop(i,j){
	return cellSpace + i*( cellSpace + cellSideLength );
}

function getPosLeft(i,j){
	return cellSpace + j*( cellSpace + cellSideLength );
}

function getNumberBackgroundColor(number){
	switch(number){
        case 0:return "#eee4da";break;
        case 1:return "#ede0c8";break;
        case 2:return "#f2b179";break;
        case 4:return "#f59563";break;
        case 8:return "#f67c5f";break;
        case 16:return "#f65e3b";break;
        case 32:return "#edcf72";break;
        case 64:return "#edcc61";break;
        case 128:return "#9c0";break;
        case 256:return "#33b5e5";break;
        case 512:return "#09c";break;
        case 1024:return "#a6c";break;
        case 2048:return "#93c";break;
    }
	return "black";
}

function getNumberColor(number){
	if( number <= 1 ){
		return "#776e65";
	}
    return "white";
}
function nospace( board ){
    for( var i = 0 ; i < 4 ; i ++ ){
    	for( var j = 0 ; j < 4 ; j ++ ){
    		  if( board[i][j] == 0 ){
                return false;
    		  }
    	}
    }
    return true;
}

function canMoveLeft( board ){
    for( var i = 0 ; i < 4 ; i ++ ){
        for( var j = 1; j < 4 ; j ++ ){
            if( board[i][j] != 0 ){
                  if( board[i][j-1] == 0 || board[i][j-1] == board[i][j] ){
                    return true;
                   }
               }
           }
       }
    return false;
}

function canMoveRight( board ){

    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 2; j >= 0 ; j -- )
            if( board[i][j] != 0 )
                if( board[i][j+1] == 0 || board[i][j+1] == board[i][j] )
                    return true;

    return false;
}

function canMoveUp( board ){

    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 1 ; i < 4 ; i ++ )
            if( board[i][j] != 0 )
                if( board[i-1][j] == 0 || board[i-1][j] == board[i][j] )
                    return true;

    return false;
}

function canMoveDown( board ){

    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 2 ; i >= 0 ; i -- )
            if( board[i][j] != 0 )
                if( board[i+1][j] == 0 || board[i+1][j] == board[i][j] )
                    return true;

    return false;
}



function generateOneNumber(){

    if( nospace( board ) )
        return false;

    //随机一个位置
    var randx = parseInt( Math.floor( Math.random()  * 4 ) );
    var randy = parseInt( Math.floor( Math.random()  * 4 ) );

    var times = 0;
    while( times < 50 ){
        if( board[randx][randy] == 0 )
            break;

        randx = parseInt( Math.floor( Math.random()  * 4 ) );
        randy = parseInt( Math.floor( Math.random()  * 4 ) );

        times ++;
    }
    if( times == 50 ){
        for( var i = 0 ; i < 4 ; i ++ )
            for( var j = 0 ; j < 4 ; j ++ ){
                if( board[i][j] == 0 ){
                    randx = i;
                    randy = j;
                }
            }
    }

    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation( randx , randy , randNumber );

    return true;
}

function showNumberWithAnimation( i , j , randNumber ){
	var numberCell = $('#number-cell-'+i+'-'+j);
	numberCell.css("background-color",getNumberBackgroundColor(randNumber));
	numberCell.css("color",getNumberColor(randNumber));
	numberCell.text(randNumber);
	
	numberCell.animate({
		width:cellSideLength,
		height:cellSideLength,
		top:getPosTop(i,j),
		left:getPosLeft(i,j)
	},50)
}

function showMove(fromx,fromy,tox,toy){
	var numberCell = $('#number-cell-'+fromx+'-'+fromy);
	numberCell.animate({
		top:getPosTop(tox,toy),
		left:getPosLeft(tox,toy)
	},200)
}

function noBlockHorizontal( row , col1 , col2 , board ){
    for( var i = col1 + 1 ; i < col2 ; i ++ )
        if( board[row][i] != 0 )
            return false;
    return true;
}

function noBlockVertical( col , row1 , row2 , board ){
    for( var i = row1 + 1 ; i < row2 ; i ++ )
        if( board[i][col] != 0 )
            return false;
    return true;
}

function isGameOver(){
    if( nospace( board ) && noMove( board ) ){
        gameOver();
    }
}

function gameOver(){
	alert("gane over");
    console.log("game over !");
}

function noMove( board ){
    if( canMoveLeft( board ) ||
        canMoveRight( board ) ||
        canMoveUp( board ) ||
        canMoveDown( board ) )
        return false;

    return true;
}