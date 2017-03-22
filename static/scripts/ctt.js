function chess_game(x,y){
    var self = this
    var game = new Chess()
    this.x = x
    this.y = y
    this.done = false
    this.winner = ''
    this.onDrop = function(source,target){
        var move = game.move({from: source, to: target, promotion:'q'});
        if (move==null){
            return 'snapback';
        } else {
            if (game.in_checkmate() === true){
                // black: -1
                wins[this.x][this.y] = turn === 'b' ? -1 : 1
                updateScores(this.x,this.y,turn === 'b' ? -1 : 1)
                this.winner = turn
                this.done = true
                checkGameOver()
                self.board.destroy()
                $('#'+x+y).css('color',turn==='b'?'red':'blue')
            }
            turn = turn==='b'? 'w':'b'
            for (var i = 0; i < chess_games.length; i++) {
                chess_games[i].setGameTurn(turn)
            }
        }
    }
    var cfg = {
        draggable: true,
        position: 'start',
        onDrop: this.onDrop
    };
    this.board = ChessBoard(''+x+y,cfg)

    this.move = function(s,t){
        console.log(this.game)
        var move = this.game.move({from:s,to:t})
    }

    this.setGameTurn = function(colour){
        var tokens = game.fen().split(' ');
        tokens[1] = colour;
        game.load(tokens.join(' '));
    }
}

function setup(){
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            $('#ttt').append('<div id="'+i+j+'"class="cboard"></div>')
        }
        $('#ttt').append('<br>')
    }

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            chess_games.push(new chess_game(i,j))
        }
    }
}

function updateScores(col,row,player) {
    //-1:black,1:white
    scores[col+3]+=player;
    scores[row]+=player;
    if (col===row){
        scores[6]+=player
    }
    if (2-col===row){
        scores[7]+=player
    }

}

function checkGameOver(){
    if ($.inArray(3,scores)>-1){
        $('#ttt').delay(500).replaceWith('<div id="ttt"><h1 style="font-size:100px;font-family:"Arial Black", Gadget, sans-serif;color:red">White WINS</h1></div>')
    }
    if ($.inArray(-3,scores)>-1){
        $('#ttt').delay(500).replaceWith('<div id="ttt"><h1 style="font-size:100px;font-family:"Arial Black", Gadget, sans-serif;color:red">Black WINS</h1></div>')
    }
}

//00,01,02,10,11,12,20,21,22
var chess_games = []
//row1,row2,row3,col1,col2,col3,diag1,diag2
var scores = [0,0,0,0,0,0,0,0]
turn = 'w'
$(document).ready(function(){
    setup()
    $('#save-btn').on('click',function(){
        name = $('#save-in').val()
        save = ''
        for (var i = 0; i < chess_games.length; i++) {
            save += ';' + chess_games[i].board.fen()
        }
        console.log(name,save);
        $.post('/_save',{name:name,save:save},function(data){
            alert('success')
        }).fail(function(){
            alert('failure')
        })
    })
    $('#load-btn').on('click',function(){
        name = $('#load-in').val()
        console.log(name);
        $.getJSON('/_load',{name:name},function(data){
            console.log(data.save);
            save_state = data.save.split(';')
            for (var i = 0; i < chess_games.length; i++) {
                chess_games[i].board.position(save_state[i])
            }
        })
    })
})
