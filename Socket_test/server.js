const app = require('express')(); //express 프레임워크
const http = require('http').createServer(app); //서버 만들기
const io = require('socket.io')(http); //socekt 사용을 위함
const fs = require('fs');
const hostname = "168.168.0.45";  //서버 ip주소
const port = 3000;
/*/이 들어왔을때 ( routing )*/
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); //respone객체에 sendFile()로 같은 디렉토리에있는 index.html로 응답
});
const clients = [];

/*file read*/
fs.readFile(__dirname+'/text.txt' , 'utf8', function(err,data){
  console.log(data);
});
/*연결*/
io.sockets.on('connection', (socket) => {
  console.log('a user connected');
  var client = {'ip' : socket.handshake.address , 'id' : socket.id};
  clients.push(client);

  socket.on('chat message', (msg) => { //on은 받았을 때
    console.log("내가 보내려는곳 : " + msg.dest_addr);

    console.log("--------Clients information--------");
    for(var i=0; i<clients.length; i++){
      console.log("Client"+i +" : " +clients[i].ip);
    }

    for(var i=0; i<clients.length; i++){
      if(msg.dest_addr == clients[i].ip){
        var dest_socket_id = clients[i].id;
        io.to(dest_socket_id).emit('chat message', msg.m);
        break;
      }
    }



    //io.to()emit('chat message', "Me : "+msg.m); //emit으로 보냄 , Broadcasting

      /*  for(var i=0; i<clients.length; i++){
            console.log("등록되어있는 client : " + clients[i].ip);
            if(clients[i].ip == msg.dset_addr){
              console.log('들어오니?');
              io.emit('chat message',msg.m);
              break;
            }
        }*/

     });
  //  }

  /*연결 해제*/
  socket.on('disconnect', () => {
    console.log('user disconnected');
    });
});

/*포트 , 아이피주소 / 기다림*/
http.listen(port, hostname ,() => {
  console.log('Connected at 3000');
});
