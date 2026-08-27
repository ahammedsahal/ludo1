export type Color='red'|'green'|'yellow'|'blue';
export type Piece={progress:number};
export type Player={id:string;name:string;ready:boolean;connected:boolean;color:Color;pieces:Piece[];muted:boolean;lastSeen:number};
export type Game={phase:'lobby'|'playing'|'finished';turn:number;dice:number|null;deadline:number|null;winner:string|null;lastAction:string|null;capture:boolean;players:Player[]};
export const SAFE=[0,8,13,21,26,34,39,47];
export const START=[0,13,26,39]; export const FINISH=57;
export function createGame():Game{return{phase:'lobby',turn:0,dice:null,deadline:null,winner:null,lastAction:null,capture:false,players:[]}}
export function roll(){return Math.floor(Math.random()*6)+1}
export function absolute(player:number,progress:number){return (START[player]+progress)%52}
export function legalMoves(g:Game,p:number,dice:number){const pl=g.players[p];if(!pl)return[];return pl.pieces.map((x,i)=>x.progress===FINISH?false:x.progress===0?dice===6:x.progress+dice<=FINISH).map((v,i)=>v?i:-1).filter(i=>i>=0)}
export function movePiece(g:Game,p:number,index:number){if(g.dice==null||g.turn!==p)throw Error('Not your turn');const valid=legalMoves(g,p,g.dice);if(!valid.includes(index))throw Error('Illegal move');const dice=g.dice, piece=g.players[p].pieces[index];piece.progress=piece.progress===0?1:piece.progress+dice;let capture=false;const pos=absolute(p,piece.progress);if(!SAFE.includes(pos)&&piece.progress<FINISH)g.players.forEach((op,oi)=>{if(oi!==p)op.pieces.forEach(other=>{if(other.progress>0&&other.progress<FINISH&&absolute(oi,other.progress)===pos){other.progress=0;capture=true}})});const won=g.players[p].pieces.every(x=>x.progress===FINISH);if(won){g.winner=g.players[p].id;g.phase='finished'}g.capture=capture;g.lastAction=`${g.players[p].name} moved piece ${index+1}`;if(!won&&dice!==6&&!capture)g.turn=(g.turn+1)%g.players.length;g.dice=null;g.deadline=Date.now()+20000;return{capture,won,bonus:dice===6||capture}}
export function resetForRematch(g:Game){g.phase='lobby';g.turn=0;g.dice=null;g.deadline=null;g.winner=null;g.lastAction=null;g.capture=false;g.players.forEach(p=>{p.ready=false;p.pieces=[0,0,0,0].map(progress=>({progress}))})}
