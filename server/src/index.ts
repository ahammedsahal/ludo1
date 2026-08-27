import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';

type Player={id:string;name:string;ready:boolean;connected:boolean;color:string};
type Room={code:string;host:string;players:Map<string,Player>;started:boolean;turn:number;dice:number|null};
const app=express(); app.use(cors()); app.get('/health',(_,res)=>res.json({ok:true,service:'ludo.io'}));
const http=createServer(app); const io=new Server(http,{cors:{origin:'*'}}); const rooms=new Map<string,Room>();
const colors=['red','green','yellow','blue'];
function code(){return `LUDO-${Math.floor(1000+Math.random()*9000)}`}
function snapshot(r:Room){return {code:r.code,started:r.started,turn:r.turn,dice:r.dice,players:[...r.players.values()]}}
function broadcast(r:Room){io.to(r.code).emit('game:state',snapshot(r))}
function getRoom(socket:any){for(const r of rooms.values()) if(r.players.has(socket.id)) return r; return undefined}

io.on('connection',socket=>{
 socket.on('room:create',(data,ack)=>{let c=code();while(rooms.has(c))c=code();const r:Room={code:c,host:socket.id,players:new Map(),started:false,turn:0,dice:null};r.players.set(socket.id,{id:socket.id,name:String(data?.name||'Player'),ready:false,connected:true,color:colors[0]});rooms.set(c,r);socket.join(c);ack?.({ok:true,room:c,state:snapshot(r)})});
 socket.on('room:join',(data,ack)=>{const r=rooms.get(String(data?.code||'').toUpperCase());if(!r)return ack?.({ok:false,error:'Room not found'});if(r.started)return ack?.({ok:false,error:'Game already started'});if(r.players.size>=4)return ack?.({ok:false,error:'Room is full'});r.players.set(socket.id,{id:socket.id,name:String(data?.name||'Player'),ready:false,connected:true,color:colors[r.players.size]});socket.join(r.code);broadcast(r);ack?.({ok:true,room:r.code,state:snapshot(r)})});
 socket.on('player:ready',()=>{const r=getRoom(socket);if(!r)return;r.players.get(socket.id)!.ready=!r.players.get(socket.id)!.ready;broadcast(r)});
 socket.on('game:start',()=>{const r=getRoom(socket);if(!r||r.host!==socket.id||r.players.size<2)return;r.started=true;r.turn=0;r.dice=null;broadcast(r)});
 socket.on('dice:roll',()=>{const r=getRoom(socket);if(!r||!r.started)return;const ids=[...r.players.keys()];if(ids[r.turn]!==socket.id||r.dice!==null)return; r.dice=Math.floor(Math.random()*6)+1;broadcast(r)});
 socket.on('turn:end',()=>{const r=getRoom(socket);if(!r||!r.started)return;const ids=[...r.players.keys()];if(ids[r.turn]!==socket.id)return;r.dice=null;r.turn=(r.turn+1)%ids.length;broadcast(r)});
 socket.on('voice:signal',data=>{if(data?.to)io.to(data.to).emit('voice:signal',{from:socket.id,signal:data.signal})});
 socket.on('disconnect',()=>{const r=getRoom(socket);if(!r)return;r.players.get(socket.id)!.connected=false;io.to(r.code).emit('player:disconnect',{id:socket.id});setTimeout(()=>{const current=r.players.get(socket.id);if(current&&!current.connected){r.players.delete(socket.id);if(r.host===socket.id)r.host=[...r.players.keys()][0]||'';if(r.players.size===0)rooms.delete(r.code);else broadcast(r)}},30000);broadcast(r)});
});
const port=Number(process.env.PORT||3001);http.listen(port,()=>console.log(`Ludo.io server listening on ${port}`));
