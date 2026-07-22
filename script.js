/* ===== 作品数据（替换为你自己的作品即可） ===== */
const works = [
  { en:"KAELYN", title:"代号：夜莺", desc:"从赛博都市到废弃仓库，一位女特工以压倒性的实力完成任务，然而更大的行动似乎才刚刚开始……", hue:"#3a2f4f" },
  { en:"Be Brave", title:"勇敢向前", desc:"献给每一个曾经\u201c怕黑\u201d的孩子。我们不是天生勇敢，而是选择向前。", hue:"#4a3626" },
  { en:"Sicilian MV", title:"西西里MV", desc:"一部西西里背景的黑帮救赎短片，讲述曾经的\u201c教父\u201d放下枪、金盆洗手的故事。", hue:"#2e3a33" },
  { en:"Shirt TVC", title:"衬衫TVC", desc:"将品牌衬衫核心记忆点与时尚穿搭风格，转化为高识别度的商业TVC广告。", hue:"#33384a" },
  { en:"Chicken Leg TVC", title:"鸡腿TVC", desc:"用烧烤、辣椒、食物特写拆解产品视觉，看上去食欲满满的商业广告。", hue:"#4a2f26" },
  { en:"Washer TVC", title:"洗衣机TVC", desc:"围绕\u201c小身材、大容量、高效除螨、强劲动力\u201d，打造高识别度商业TVC。", hue:"#26384a" },
  { en:"Camera TVC", title:"相机TVC", desc:"环绕运镜展示相机细节，结合定格卖点与深情旁白配音的商业广告。", hue:"#2f3340" },
  { en:"Creative Video", title:"创意视觉风格", desc:"复刻《蜘蛛侠：纵横宇宙》视觉风格，生成创意跑酷与古代仙侠打斗片段。", hue:"#402638" },
  { en:"Ex-boyfriend", title:"我妻子的前男友", desc:"分镜设计 + StableDiffusion 生图 + 真人配音 + 剪映后期精修的动态漫小说。", hue:"#3a3326" },
];

/* ===== 其他作品分类 ===== */
const others = {
  banner:[
    {label:"SK-II 护肤礼盒",sub:"Banner"},{label:"YSL 夜皇后套组",sub:"Banner"},
    {label:"Jeep 美式 Polo 衫",sub:"Banner"},{label:"新奥尔良鸡翅根",sub:"Banner"},
    {label:"麻辣王子辣条",sub:"Banner"},{label:"小米 SU7 Ultra",sub:"Banner"},
    {label:"苹果17 旗舰新机",sub:"Banner"},{label:"统帅超薄滚筒洗衣机",sub:"Banner"},
  ],
  ui:[
    {label:"Keep UI 封面",sub:"UI Design"},{label:"Keep UI 展示",sub:"UI Design"},
    {label:"妙时 UI 封面",sub:"UI Design"},{label:"妙时 UI 展示",sub:"UI Design"},
    {label:"智行火车票 封面",sub:"UI Design"},{label:"智行火车票 展示",sub:"UI Design"},
    {label:"记账 App 封面",sub:"UI Design"},{label:"记账 App 展示",sub:"UI Design"},
  ],
  flow:[
    {label:"电商产品背景更换/打光",sub:"ComfyUI"},{label:"服装/物品迁移",sub:"ComfyUI"},
    {label:"局部重绘 · 商品一致性",sub:"WebUI"},{label:"文字修复",sub:"AI Repair"},
    {label:"人物/物品精修",sub:"ComfyUI"},{label:"人脸替换",sub:"ComfyUI"},
    {label:"融图与光影统一",sub:"ComfyUI"},{label:"高清放大 Upscale",sub:"Magnific"},
  ],
};

const grad = (h)=>`linear-gradient(135deg,${h},#0d0d10 85%)`;

/* ===== 渲染作品网格 ===== */
const grid = document.getElementById('workGrid');
grid.innerHTML = works.map((w,i)=>`
  <div class="work-card reveal" data-i="${i}" style="transition-delay:${(i%3)*.08}s">
    <div class="thumb" style="background-image:${grad(w.hue)}"></div>
    <div class="wc-play">▶</div>
    <div class="wc-info">
      <span class="wc-en">${w.en}</span>
      <h3 class="wc-title">${w.title}</h3>
      <p class="wc-desc">${w.desc}</p>
    </div>
  </div>`).join('');

/* ===== 其他作品渲染 + 切换 ===== */
const otherGrid = document.getElementById('otherGrid');
function renderOther(key){
  otherGrid.innerHTML = others[key].map((o,i)=>`
    <div class="og-card reveal" style="transition-delay:${(i%4)*.06}s">
      <div class="thumb" style="background-image:${grad(['#33384a','#4a3626','#2e3a33','#402638'][i%4])}"></div>
      <div class="og-label">${o.label}<small>${o.sub}</small></div>
    </div>`).join('');
  observeReveals();
}
renderOther('banner');
document.getElementById('tabs').addEventListener('click',e=>{
  const btn=e.target.closest('.tab'); if(!btn)return;
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  renderOther(btn.dataset.tab);
});

/* ===== 灯箱 ===== */
const lb=document.getElementById('lightbox');
grid.addEventListener('click',e=>{
  const card=e.target.closest('.work-card'); if(!card)return;
  const w=works[card.dataset.i];
  document.getElementById('lbMedia').style.backgroundImage=grad(w.hue);
  document.getElementById('lbEn').textContent=w.en;
  document.getElementById('lbTitle').textContent=w.title;
  document.getElementById('lbDesc').textContent=w.desc;
  lb.classList.add('open');document.body.style.overflow='hidden';
});
const closeLb=()=>{lb.classList.remove('open');document.body.style.overflow=''};
document.getElementById('lbClose').addEventListener('click',closeLb);
lb.addEventListener('click',e=>{if(e.target===lb)closeLb()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLb()});

/* ===== 滚动动效 ===== */
let io;
function observeReveals(){
  if(!io){
    io=new IntersectionObserver(es=>{
      es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}});
    },{threshold:.12});
  }
  document.querySelectorAll('.reveal:not(.in)').forEach(el=>io.observe(el));
}
observeReveals();

/* ===== 导航滚动态 + 移动菜单 ===== */
const nav=document.getElementById('nav');
addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>40));
document.getElementById('navToggle').addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

/* ===== 光标光晕 ===== */
const glow=document.getElementById('cursorGlow');
addEventListener('mousemove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';glow.style.opacity=1});
addEventListener('mouseleave',()=>glow.style.opacity=0);
