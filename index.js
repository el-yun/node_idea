var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// idea Object Collection

var Room_Collection = [];

var Room = function() {
    this.room = "room_" + new Date().getTime();
    this.Collection = [];
    this.version = 0;
    this.User = [];
    this.setIdea = function(obj){
        var flag = false;
        // 이미 존재하는 객체인지 확인
        for(var i in Collection){
            if(Collection[i].getindex == obj.getindex) flag = true;
        }
        if(flag == true){
            // Update
            this.Collection[i] = obj;
            this.version++;
        } else {
            this.Collection.push(obj);
            this.version++;
        }
    }
}

app.get('/', function(req, res){
    res.send({collection : Room_Collection });
});
/*
app.post('/join', function(req, res){
    res.send({collection : Collection_Object });
});

app.post('/create', function(req, res){
    res.send({collection : Collection_Object });
});
*/
io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        //console.log('user disconnected');
    });
    socket.on('data-room-check', function(msg){
        var _room = null;
        for(var i in Room_Collection){
            if(Room_Collection[i].room == msg.RoomName ){
                _room = Room_Collection[i];
            }
        }
        if(!_room) {
            console.log("New");
            var _room = create_room();
            Room_Collection.push(_room);
        }
        // Version Return
        socket.emit('data-version', { RoomName: _room.name, Version : _room.version });
    });
    socket.on('data-transfer', function(msg){
        console.log(msg);
    });

    // Data Trade
    socket.on('data-update', function(msg){
        var _room = null;
        var _index = 0;
        for(var i in Room_Collection){
            if(Room_Collection[i].room == msg.RoomName ) index = i;
        }
        if(_index > 0){
            Room_Collection[index].Collection = msg.collection;
            Room_Collection[index].version = msg.version;
        }
        console.log("update");
        socket.broadcast.emit('data-update', { RoomName: msg.RoomName, collection: msg.collection });
    });

});
function create_room(){
    var _room = new Room();
    _room.name = "room_" + new Date().getTime();
    return _room;
}

http.listen(3000, function(){
    console.log('listening on *:3000');
});