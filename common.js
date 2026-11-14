/* Shared data, approximate ephemeris model and helpers */
const SITES=[
{n:"Shackleton Crater",lat:-89.9,lon:0,g:"South pole candidate"},
{n:"Malapert Massif",lat:-85.99,lon:0.12,g:"South pole candidate"},
{n:"Haworth Crater",lat:-87.3,lon:5,g:"South pole candidate"},
{n:"Amundsen Crater",lat:-84.5,lon:83,g:"South pole candidate"},
{n:"De Gerlache Crater",lat:-88,lon:-88,g:"South pole candidate"},
{n:"Chandrayaan-3",lat:-69.37,lon:32.32,g:"Recent landing"},
{n:"Chang'e 4 (far side)",lat:-45.46,lon:177.6,g:"Recent landing"},
{n:"Apollo 11",lat:0.67,lon:23.47,g:"Apollo"},
{n:"Apollo 12",lat:-3.01,lon:-23.42,g:"Apollo"},
{n:"Apollo 15",lat:26.13,lon:3.63,g:"Apollo"},
{n:"Apollo 17",lat:20.19,lon:30.77,g:"Apollo"}];
const D2R=Math.PI/180,SYN=29.530588,T0=Date.UTC(2000,0,6,18,14)/864e5;
const wrap=x=>((x+180)%360+360)%360-180;
/* t = days since 1970 (ms/864e5). Approximate: good for exploring, not for flight planning. */
function sunSub(t){const d=t-10957.5,L=280.46+0.9856474*d,O=125.04-0.0529539*d;
 return{lat:1.54*Math.sin((L-O)*D2R),lon:wrap(180-360*(t-T0)/SYN)}}
function earthSub(t){const d=t-10957.5,M=134.96+13.06499295*d,F=93.27+13.22935*d;
 return{lat:6.7*Math.sin(F*D2R),lon:-6.3*Math.sin(M*D2R)}}
function elev(la,lo,p,R){const s=Math.sin(la*D2R)*Math.sin(p.lat*D2R)+Math.cos(la*D2R)*Math.cos(p.lat*D2R)*Math.cos((lo-p.lon)*D2R);
 return Math.atan2(s-R,Math.sqrt(1-s*s))/D2R}
const sunEl=(la,lo,t)=>elev(la,lo,sunSub(t),0),earthEl=(la,lo,t)=>elev(la,lo,earthSub(t),1737.4/384400);
/* hourly series over one lunar day */
function series(la,lo,ms){const o=[],t0=ms/864e5;for(let h=0;h<=709;h++){const t=t0+h/24;o.push({h,s:sunEl(la,lo,t),e:earthEl(la,lo,t)})}return o}
const nextChange=(a,k)=>{const up=a[0][k]>0;for(const p of a)if((p[k]>0)!==up)return{up,h:p.h};return{up,h:null}};
const fmtH=h=>h==null?"> 29.5 d":h<48?Math.round(h)+" h":(h/24).toFixed(1)+" d";
function metrics(la,lo,ms){const a=series(la,lo,ms),n=a.length,sp=a.filter(p=>p.s>0).length/n*100,ep=a.filter(p=>p.e>0).length/n*100,
 ns=nextChange(a,"s"),ne=nextChange(a,"e");
 const v=sp>=60&&ep>=50?["FAVOURABLE","good"]:sp>=30&&ep>=30?["MARGINAL","warn"]:["CHALLENGING","bad"];
 return{a,sun:a[0].s,earth:a[0].e,sp,ep,maxSun:Math.max(...a.map(p=>p.s)),ns,ne,v,
 sunT:(ns.up?"Sunset in ":"Sunrise in ")+fmtH(ns.h),earthT:(ne.up?"Earthset in ":"Earthrise in ")+fmtH(ne.h)}}
function chart(cv,a){const w=cv.width=cv.clientWidth*2,h=cv.height=cv.clientHeight*2,x=cv.getContext("2d");
 const m=Math.max(5,Math.ceil(Math.max(...a.map(p=>Math.abs(p.s)),...a.map(p=>Math.abs(p.e)))/5)*5),Y=v=>h/2-v/m*(h/2-30),X=i=>i/709*(w-60)+50;
 x.clearRect(0,0,w,h);x.font="22px sans-serif";x.fillStyle="#929bab";x.strokeStyle="#28313d";x.lineWidth=2;
 [m,0,-m].forEach(v=>{x.beginPath();x.moveTo(50,Y(v));x.lineTo(w-10,Y(v));x.stroke();x.fillText(v+"°",4,Y(v)+6)});
 for(let d=0;d<=29;d+=5){x.fillText("d"+d,X(d*24)-10,h-6)}
 [["s","#ffb454"],["e","#78a9ff"]].forEach(([k,c])=>{x.beginPath();x.strokeStyle=c;x.lineWidth=4;a.forEach((p,i)=>i?x.lineTo(X(i),Y(p[k])):x.moveTo(X(i),Y(p[k])));x.stroke()});
 x.fillStyle="#ffb454";x.fillText("● Sun",w-260,34);x.fillStyle="#78a9ff";x.fillText("● Earth",w-150,34)}
document.body.insertAdjacentHTML("afterbegin",'<div class="stars"></div><header class="navbar"><a href="index.html" class="logo"><span>◐</span><b>LUNAR NAVIGATOR</b></a><nav>'+
[["index","HOME"],["moon","3D MOON"],["analyze","ANALYZE"],["compare","COMPARE"],["resources","RESOURCES"]].map(([p,l])=>`<a href="${p}.html"${location.pathname.endsWith(p+".html")||(p=="index"&&location.pathname.endsWith("/"))?' class="on"':""}>${l}</a>`).join("")+"</nav></header>");
document.body.insertAdjacentHTML("beforeend","<footer>NASA SPACE APPS CHALLENGE 2026 · LUNAR LANDING SITE NAVIGATOR</footer>");
const siteOptions=()=>SITES.map((s,i)=>`<option value="${i}">${s.n}</option>`).join("");
const nowLocal=()=>{const d=new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString();return[d.slice(0,10),d.slice(11,16)]};
