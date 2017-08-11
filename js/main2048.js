var board = new Array();
var hasConflicted = new Array();
var score = 0;
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(function() {
	newGame();
})

function newGame() {
	//初始化棋盘格
	init();

	//在随机两个格子生成数字
	generateOneNumber();
	generateOneNumber();
}

function init() {
	//通过依次遍历，给每一个gridCell设置left和top值
	for(var i = 0; i < 4; i++)
		for(var j = 0; j < 4; j++) {
			var gridCell = $('#grid-cell-' + i + "-" + j);
			gridCell.css('top', getPosTop(i, j));
			gridCell.css('left', getPosLeft(i, j));
		}
	//通过遍历，初始化数组值，全部赋值为0
	for(var i = 0; i < 4; i++) {
		board[i] = new Array();
		hasConflicted[i] = new Array();
		for(var j = 0; j < 4; j++) {
			board[i][j] = 0;
			hasConflicted[i][j] = false;
		}
	}

	setRem();
	
	updateBoardView();

	score = 0;
}

$(document).keydown(function(event) {
	switch(event.keyCode) {
		case 37:
			if(canMoveLeft(board)) {
				moveLeft();
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
			break;
		case 38:
			if(canMoveUp(board)) {
				moveUp();
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
			break;
		case 39:
			if(canMoveRight(board)) {
				moveRight();
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
			break;
		case 40:
			if(canMoveDown(board)) {
				moveDown();
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
			break;
		default:
			break;
	}
})

function moveLeft() {
	for(var i = 0; i < 4; i++) {
		for(var j = 1; j < 4; j++) {
			if(board[i][j] != 0) {
				for(var k = 0; k < j; k++) {
					if(board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
						//move 移到空地
						showMove(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						//continue;
					} else if(board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board)) {
						//move 相加
						showMove(i, j, i, k);
						board[i][k] += board[i][j];
						board[i][j] = 0;

						score += board[i][k];
                        updateScore( score );

                        hasConflicted[i][k] = true;
						//continue;

					}

				}
			}
		}
	}
	setTimeout("updateBoardView()", 200);
}

function moveRight() {

	//moveRight
	for(var i = 0; i < 4; i++)
		for(var j = 2; j >= 0; j--) {
			if(board[i][j] != 0) {
				for(var k = 3; k > j; k--) {

					if(board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
						//move
						showMove(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if(board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
						//move
						showMove(i, j, i, k);
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[i][k];
						updateScore(score);

						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}

	setTimeout("updateBoardView()", 200);
	return true;
}

function moveUp() {

	//moveUp
	for(var j = 0; j < 4; j++)
		for(var i = 1; i < 4; i++) {
			if(board[i][j] != 0) {
				for(var k = 0; k < i; k++) {

					if(board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
						//move
						showMove(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if(board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
						//move
						showMove(i, j, k, j);
						//add
						board[k][j] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[k][j];
						updateScore(score);

						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}

	setTimeout("updateBoardView()", 200);
	return true;
}

function moveDown() {
	//moveDown
	for(var j = 0; j < 4; j++)
		for(var i = 2; i >= 0; i--) {
			if(board[i][j] != 0) {
				for(var k = 3; k > i; k--) {

					if(board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
						//move
						showMove(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if(board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {
						//move
						showMove(i, j, k, j);
						//add
						board[k][j] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[k][j];
						updateScore(score);

						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}

	setTimeout("updateBoardView()", 200);
	return true;
}

function updateBoardView() {
	console.log("updateBoardView");
	console.log(board);
	//删除掉 number-cell ，然后再新增新的
	$(".number-cell").remove();
	$("header").css("width",gridContainerWidth);
	//循环遍历，生成4*4个number-cell，并设置left和top
	for(var i = 0; i < 4; i++)
		for(var j = 0; j < 4; j++) {
			
			var gridCell = $('#grid-cell-' + i + "-" + j);
			gridCell.css('top', getPosTop(i, j));
			gridCell.css('left', getPosLeft(i, j));
			
			$("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
			var theNumberCell = $('#number-cell-' + i + '-' + j);

			if(board[i][j] == 0) {
				theNumberCell.css('width', '0px');
				theNumberCell.css('height', '0px');
				theNumberCell.css('top', getPosTop(i, j) + cellSideLength / 2);
				theNumberCell.css('left', getPosLeft(i, j) + cellSideLength / 2);
			} else {
				theNumberCell.css('width', cellSideLength);
				theNumberCell.css('height', cellSideLength);
				theNumberCell.css('top', getPosTop(i, j));
				theNumberCell.css('left', getPosLeft(i, j));
				theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color', getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
			}

			hasConflicted[i][j] = false;
		}

	$('.number-cell').css('line-height', cellSideLength + 'px');
	$('.number-cell').css('font-size', 0.6 * cellSideLength + 'px');
}

document.addEventListener('touchstart', function(event) {
	event.preventDefault();
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
});

document.addEventListener('touchend', function(event) {
	event.preventDefault();
	
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;

	var deltax = endx - startx;
	var deltay = endy - starty;

	if(Math.abs(deltax) < 0.3 * documentWidth && Math.abs(deltay) < 0.3 * documentWidth)
		return;

	if(Math.abs(deltax) >= Math.abs(deltay)) {

		if(deltax > 0) {
			//move right
			if(canMoveRight(board)) {
				moveRight();
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
		} else {
			//move left
			if(canMoveLeft(board)) {
				moveLeft();
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
		}
	} else {
		if(deltay > 0) {
			//move down
			if(canMoveDown(board)) {
				moveDown();
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
		} else {
			//move up
			if(canMoveUp(board)) {
				moveUp();
				setTimeout("generateOneNumber()", 210);
				setTimeout("isGameOver()", 300);
			}
		}
	}
});

function updateScore(score){
	$("#score").text(score);
}
