import {useEffect,useRef} from "react";
import * as THREE from "three";
import {Bar} from "react-chartjs-2";
import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,Tooltip,Legend,ChartOptions} from "chart.js";
ChartJS.register(CategoryScale,LinearScale,BarElement,Tooltip,Legend);

type Benchmark={name:string;values:Record<string,number>;unit?:string;max?:number};
const models=["GPT-6 Astra","GPT-5.6 Sol","Claude Fable 5.1","Claude Opus 5","Claude Opus 5.5","Gemini 3.8 Flash"];
const modelColors=["#b99cff","#6d6a78","#7d8796","#8d8a98","#d7d2e8","#6e9cff"];

const benchmarks:Benchmark[]=[
{name:"Agents' Last Exam",values:{"GPT-6 Astra":59.3,"GPT-5.6 Sol":53.6,"Claude Fable 5.1":48.7,"Claude Opus 5":55.5}},
{name:"OSWorld 2.0",values:{"GPT-6 Astra":72.6,"GPT-5.6 Sol":65.7,"Claude Opus 5":70.2}},
{name:"ScreenSpot-Pro",values:{"GPT-6 Astra":92.7,"GPT-5.6 Sol":76.9,"Claude Fable 5":87.3}},
{name:"AutomationBench",values:{"GPT-6 Astra":41.4,"GPT-5.6 Sol":18.1,"Claude Fable 5.1":31.4,"Claude Fable 5":17.4,"Claude Opus 5":26.9}},
{name:"BenchCAD",values:{"GPT-6 Astra":95.9,"GPT-5.6 Sol":83.3,"Claude Fable 5.1":84.3,"Claude Fable 5":67.5,"Claude Opus 5":82.1}},
{name:"BrowseComp",values:{"GPT-6 Astra":91.5,"GPT-5.6 Sol":90.4,"Claude Fable 5":87.4,"Claude Opus 5":90.8}},
{name:"Internal Design Tasks",values:{"GPT-6 Astra":50,"GPT-5.6 Sol":47.4,"Claude Fable 5":35.8}},
{name:"Internal Data Science",values:{"GPT-6 Astra":40.9,"GPT-5.6 Sol":30.5,"Claude Fable 5":34.7}},
{name:"Terminal-Bench 4.0",values:{"GPT-6 Astra":57.9,"GPT-5.6 Sol":37.3,"Claude Fable 5.1":55.8,"Claude Opus 5":52.3,"Claude Opus 5.5":66.4}},
{name:"Intelligence Index v4.1.1",values:{"GPT-6 Astra":61.2,"GPT-5.6 Sol":60.9,"Claude Fable 5.1":65.7,"Claude Fable 5":62.1,"Claude Opus 5":63.1,"Gemini 3.8 Flash":58.7},max:70}
];

function NeuralScene(){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{const host=ref.current;if(!host)return;
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(45,host.clientWidth/host.clientHeight,.1,100);camera.position.z=7;
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(host.clientWidth,host.clientHeight);host.appendChild(renderer.domElement);
  const group=new THREE.Group();scene.add(group);
  const core=new THREE.Mesh(new THREE.IcosahedronGeometry(1.35,5),new THREE.MeshBasicMaterial({color:0xb99cff,wireframe:true,transparent:true,opacity:.8}));group.add(core);
  group.add(new THREE.Mesh(new THREE.SphereGeometry(1.0,40,40),new THREE.MeshBasicMaterial({color:0x8b5cf6,transparent:true,opacity:.11})));
  const pts=new Float32Array(1200*3);for(let i=0;i<1200;i++){const r=1.8+Math.random()*2.5,a=Math.random()*Math.PI*2,b=Math.acos(2*Math.random()-1);pts[i*3]=r*Math.sin(b)*Math.cos(a);pts[i*3+1]=r*Math.sin(b)*Math.sin(a);pts[i*3+2]=r*Math.cos(b)}
  const geo=new THREE.BufferGeometry();geo.setAttribute("position",new THREE.BufferAttribute(pts,3));group.add(new THREE.Points(geo,new THREE.PointsMaterial({color:0xded5ff,size:.018,transparent:true,opacity:.7})));
  for(const tilt of [0,.8,1.6]){const ring=new THREE.Mesh(new THREE.TorusGeometry(2.15,.009,10,180),new THREE.MeshBasicMaterial({color:0x9b7bff,transparent:true,opacity:.5}));ring.rotation.x=tilt;ring.rotation.z=tilt*.7;group.add(ring)}
  const resize=()=>{camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();renderer.setSize(host.clientWidth,host.clientHeight)};addEventListener("resize",resize);
  let id=0;const tick=()=>{id=requestAnimationFrame(tick);group.rotation.y+=.0022;group.rotation.x+=.0005;core.rotation.z-=.001;renderer.render(scene,camera)};tick();
  return()=>{cancelAnimationFrame(id);removeEventListener("resize",resize);renderer.dispose();host.removeChild(renderer.domElement)}
 },[]);return <div ref={ref} className="scene"/>;
}

function BenchmarkChart({item}:{item:Benchmark}){
 const labels=Object.keys(item.values), data=labels.map(k=>item.values[k]);
 const chart={labels,datasets:[{label:item.name,data,backgroundColor:labels.map(k=>modelColors[models.indexOf(k)]||"#777"),borderRadius:6,borderSkipped:false}]};
 const options:ChartOptions<"bar">={responsive:true,plugins:{legend:{display:false},tooltip:{callbacks:{label:(ctx)=>String(ctx.raw)+"%"}}},scales:{x:{ticks:{color:"#777",font:{size:10}},grid:{display:false}},y:{beginAtZero:true,max:item.max||100,ticks:{color:"#666",font:{size:10}},grid:{color:"rgba(255,255,255,.06)"}}}};
 return <article className="bench-card"><div className="bench-title"><strong>{item.name}</strong><span>published score</span></div><Bar data={chart} options={options}/></article>;
}

const pricing=[
["GPT-6 Astra","$10","$50","1.05M","OpenAI"],
["GPT-5.6 Sol","$2","$10","1.05M","OpenAI"],
["GPT-6 Luna","$0.10","$0.50","1.05M","OpenAI"],
["Claude Opus 5.5","$4","$20","—","Anthropic"],
["Claude Sonnet 5","$2","$10","—","Anthropic"],
["Gemini 3.8 Flash","$0.75","$3.75","1.05M","Google"]
];

export default function App(){return <main>
<nav><div className="brand"><span className="brand-mark">✦</span><span>GPT-6</span><b>ASTRA</b></div><div className="navlinks"><a href="#compare">Compare</a><a href="#benchmarks">Benchmarks</a><a href="#pricing">Pricing</a></div><button className="nav-cta" onClick={()=>window.open("https://developers.openai.com/api/docs/models/gpt-6-astra","_blank")}>API ↗</button></nav>

<section className="hero">
 <div className="hero-copy"><div className="kicker">OPENAI · GPT-6 FAMILY</div><h1>ASTRA<span>.</span></h1><p className="hero-sub">The flagship model for demanding reasoning, coding, agents and computer use.</p><div className="hero-actions"><button className="primary" onClick={()=>document.querySelector("#benchmarks")?.scrollIntoView({behavior:"smooth"})}>Compare models</button><button className="text-btn" onClick={()=>document.querySelector("#pricing")?.scrollIntoView({behavior:"smooth"})}>See pricing ↓</button></div><div className="hero-stats"><div><b>1.05M</b><small>context</small></div><div><b>128K</b><small>max output</small></div><div><b>$10</b><small>input / MTok</small></div></div></div>
 <div className="hero-art"><div className="art-glow"/><NeuralScene/><div className="model-orbit orbit-a">REASONING</div><div className="model-orbit orbit-b">COMPUTER USE</div><div className="model-orbit orbit-c">AGENTS</div><div className="astra-badge"><span>GPT-6</span><strong>ASTRA</strong></div></div>
</section>

<section id="compare" className="section compact"><div className="section-label">01 / MODEL LANDSCAPE</div><div className="headline-row"><h2>Put the models<br/><em>side by side.</em></h2><p>Selected published results from OpenAI and Anthropic. A dash means the source did not publish a comparable score.</p></div><div className="model-strip">{models.map((m,i)=><div className="model-chip" key={m}><i style={{background:modelColors[i]}}/><span>{m}</span></div>)}</div></section>

<section id="benchmarks" className="section benchmark-section"><div className="section-label">02 / BENCHMARKS</div><div className="headline-row"><h2>Ten views of<br/><em>model performance.</em></h2><p>Not one giant chart. Ten focused charts so each evaluation stays readable and the benchmark differences are visible.</p></div><div className="benchmark-grid">{benchmarks.map(x=><BenchmarkChart key={x.name} item={x}/>)}</div><div className="source-note">Sources: OpenAI GPT-6 Astra announcement and Anthropic Claude Opus 5.5 announcement. Scores are publisher-reported and may use different harnesses, dates and settings.</div></section>

<section id="pricing" className="section"><div className="section-label">03 / PRICING</div><div className="headline-row"><h2>Capability has<br/><em>a price.</em></h2><p>API token pricing shown per 1M tokens. Standard pricing unless noted otherwise.</p></div><div className="pricing-wrap"><table><thead><tr><th>Model</th><th>Input</th><th>Output</th><th>Context</th><th>Provider</th></tr></thead><tbody>{pricing.map(r=><tr key={r[0]} className={r[0]==="GPT-6 Astra"?"featured":""}>{r.map((v,i)=><td key={i}>{i===0?<strong>{v}</strong>:v}</td>)}</tr>)}</tbody></table></div></section>

<section id="specs" className="section specs"><div className="section-label">04 / ASTRA</div><div className="spec-layout"><div><h2>Built to hold<br/><em>the whole task.</em></h2><p>Astra combines a million-token-scale context window with long outputs and configurable reasoning. It is positioned by OpenAI for complex coding, research, computer use and professional workflows.</p></div><div className="spec-list">{[["CONTEXT","1,050,000 tokens"],["MAX OUTPUT","128,000 tokens"],["REASONING","low · medium · high · xhigh · max"],["TOOLS","web · files · code · computer · MCP"],["KNOWLEDGE CUTOFF","Apr 30, 2026"]].map(x=><div key={x[0]}><span>{x[0]}</span><b>{x[1]}</b></div>)}</div></div></section>

<footer><div className="brand"><span className="brand-mark">✦</span><span>GPT-6</span><b>ASTRA</b></div><span>React · TypeScript · Three.js · Chart.js</span><span>30 Sep 2026</span></footer>
</main>}
