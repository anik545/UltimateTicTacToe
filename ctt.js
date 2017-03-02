function setup(){
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            $('#ttt').append('<div id="'+i+j+'"class="cboard"></div>')
        }
        $('#ttt').append('<br>')
    }

    var boards = []
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            console.log(''+i+j);
            var a = ChessBoard(''+i+j)
            boards.push(a)
        }
    }
}


$(document).ready(function(){
    setup()
})
