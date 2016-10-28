function setup(){
    var h=$(window).width();
    var w=$(window).height();
    console.log(h,w);
    mx = h>=w ? w : h;
    $('#ttt').width(mx);
    $('#ttt').height(mx);
    for (i=0;i<3;i++){
        for (j=0;j<3;j++){
            br = j===2 ? '<br>' : '';
            $('#ttt').append('<div id="out'+i+j+'" class="out'+i+j+'"></div>'+br);
            for (k=0;k<3;k++){
                for (l=0;l<3;l++){
                    br = l===2 ? '<br>' : '';
                    $('#out'+i+j).append('<div id="in'+i+j+'-'+k+l+'" class="in'+k+l+'"></div>'+br)
                }
            }
        }
    }
    $('div[class^="out"]').width(mx/3-0.1).height(mx/3-0.1)
}

function newBoard(){
    return [[[[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]]], [[[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]]], [[[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]]]]
}

function newScores(){
    return [[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]],
            [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]],
            [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]]]
}           //row1,row2,row3,col1,col2,col3,diag1,diag2

function updateScores(out_col,out_row,in_col,in_row,player){
    arr=scores[out_row][out_col];
    arr[in_col+3]+=player;
    arr[in_row]+=player;
    if (in_col===in_row){
        arr[6]+=player
    }
    if (2-in_col===in_row){
        arr[7]+=player
    }
    scores[out_row][out_col]=arr
}


function checkInnerBoard(inner){
    for (i=0;i<3;i++){
        for (j=0;j<3;j++){
            if (inner[i][j] === 0){console.log(i,j,inner[i][j]);return true}
        }
    }
    return false;
}
function checkMove(out_col,out_row,in_col,in_row,prev_col,prev_row,first){ //returns true for good move
    if (first){
        return true;
    }
    f = board[out_row][out_col][in_row][in_col] !== 0 ? false : true;
    g = checkInnerBoard(board[in_row][in_col]);
    h = (out_row === prev_row && out_col === prev_col)
    console.log(f,g);
    console.log(out_row,out_col,in_row,in_col,board[out_row][out_col][in_row][in_col]);
    return f && g && h
    //check cell is empty --> outrow,outcol,inrow,incol
    //check cell i send to is not full --> inrow,incol of outer grid
    //check cell is from last cell
}

function makeMove(out_col,out_row,in_col,in_row,player,div,prev_col,prev_row){
    if (wins[prev_row][prev_col] === 1){
        $('#out'+prev_row+prev_col).css("background-color","rgba(255,0,0,0.3)")
    } else if (wins[prev_row][prev_col] === -1) {
        $('#out'+prev_row+prev_col).css("background-color","rgba(0,0,255,0.3)")
    } else {
        $('#out'+prev_row+prev_col).css("background-color","rgba(255,255,255,1)");
    }

    color = player===1 ? "red" : "blue"
    $(div).css("background-color",color);
    board[out_row][out_col][in_row][in_col] = player;
    $('#out'+in_row+in_col).css("background-color","rgba(0,0,0,0.2)");
}
function makeFirstMove(out_col,out_row,in_col,in_row,player,div){
    color = player===1 ? "red" : "blue"
    $(div).css("background-color",color);
    board[out_row][out_col][in_row][in_col] = player;
    $('#out'+in_row+in_col).css("background-color","rgba(0,0,0,0.2)");

}
function checkWon(){
    if ($.inArray(3,outerscores)>-1){
        $('#ttt').delay(500).replaceWith('<div id="ttt"><h1 style="font-size:100px;font-family:"Arial Black", Gadget, sans-serif;color:red">RED WINS</h1></div>')
    }
    if ($.inArray(-3,outerscores)>-1){
        $('#ttt').delay(500).replaceWith('<div id="ttt"><h1 style="font-size:100px;font-family:"Arial Black", Gadget, sans-serif;color:blue">BLUE WINS</h1></div>')
    }
}

function checkInnerWon(out_col,out_row,div){
    if (wins[out_row][out_col]!==0){
        return false;
    }
    if ($.inArray(3,scores[out_row][out_col])>-1){
        wins[out_row][out_col] = 1;

        outerscores[out_col+3]+=1;
        outerscores[out_row]+=1;
        if (out_col===out_row){
            outerscores[6]+=1
        }
        if (2-out_col===out_row){
            outerscores[7]+=1
        }

        $('#out'+out_row+out_col).css("background-color","rgba(255,0,0,0.3)");
    } else if ($.inArray(-3,scores[out_row][out_col])>-1) {
        wins[out_row][out_col] = -1;

        outerscores[out_col+3]+=-1;
        outerscores[out_row]+=-1;
        if (out_col===out_row){
            outerscores[6]+=-1
        }
        if (2-out_col===out_row){
            outerscores[7]+=-1
        }

        $('#out'+out_row+out_col).css("background-color","rgba(0,0,255,0.3)");
    }
}

$(document).ready(function(){
    setup();
    board = newBoard();
    scores = newScores();
    wins=[[0,0,0],[0,0,0],[0,0,0]]
    outerscores = [0,0,0,0,0,0,0,0]
    var won=false;
    var player=1;
    var prev_row = 1;
    var prev_col = 1;
    var first = true

    //classes are: in row col ||| ids are in out_row out_col inner_row inner_col
    $('div[class^=in]').on('click',function(){
        id=$(this).attr('id');
        out_row=parseInt(id[2]);
        out_col=parseInt(id[3]);
        in_row=parseInt(id[5]);
        in_col=parseInt(id[6]);
        if (checkMove(out_col,out_row,in_col,in_row,prev_col,prev_row,first)){
            makeMove(out_col,out_row,in_col,in_row,player,this,prev_col,prev_row);
            updateScores(out_col,out_row,in_col,in_row,player)
            checkInnerWon(out_col,out_row,this);
            won=checkWon();
            prev_row = in_row;
            prev_col = in_col;
            player=-player;
            first = first ? false : false
        } else {
            alert('Cant make that move')
        }
    });
})
