import COPY from './screen-copy.json' with {type:'json'};
export {COPY};
export const ASSETS={
 delivery:'arts/backgrounds/05/office-delivery-contact-v02.png',review:'arts/backgrounds/05/office-delivery-cleared-v02.png',waiting:'arts/backgrounds/05/office-agent-wait-v02.png',pause:'arts/backgrounds/05/programmer-pause-close-v02.png',signage:'arts/backgrounds/05/office-signage-insert-v02.png',resume:'arts/backgrounds/05/programmer-resume-close-v02.png',
 programmer:'arts/characters/portraits/03/programmer-front-v04.png',coworkerA:'arts/characters/portraits/03/coworker-a-v04.png',coworkerB:'arts/characters/portraits/03/coworker-b-v04.png',manager:'arts/characters/portraits/03/manager-neutral-v04.png',agent:'arts/characters/portraits/01/agent-neutral-v01.png',agentFocus:'arts/characters/portraits/01/agent-focus-v01.png',company:'arts/items/04/company-a-v03.png',document:'arts/items/01/task-document-portrait-v01.png',documentWide:'arts/items/01/task-document-landscape-v01.png',office:'arts/backgrounds/shared/office-workstations-day-v01.png'
};
export const LAYOUT={canvas:[1920,1080],subtitleSafe:[40,994,1840,70],relationPanel:[64,40,1792,920],relationAnchors:{employee:[480,280],company:[1430,280],agents:[[224,570],[480,570],[736,570]],employees:[[1174,570],[1430,570],[1686,570]]},
 signage:{wide:{board:{quad:[[1070,83],[1520,65],[1520,318],[1070,337]],localSize:[450,254]},ad:{quad:[[1597,76],[1824,68],[1824,267],[1597,275]],localSize:[227,199]}},insert:{board:{quad:[[260,163],[1250,124],[1250,763],[260,783]],localSize:[990,620]},ad:{quad:[[1350,112],[1814,91],[1814,787],[1350,801]],localSize:[464,689]}}},
 storyLayers:['coherent-raster-scene','physical-board-text-safe-mask','physical-ad-copy-and-raster-portrait','local-action-feedback','subtitle-safe-check-only'],feedbackLayers:['office-background','warm-diagram-paper','raster-participants-and-documents','organization-rule-links','editable-control-page'],notes:['宽景标牌文字避开头部遮挡；近景不重复贴背景字','同人双视图非新增雇员','纸张已放在键盘右侧，沿采用图保持','有限关键态素材检查，不是45秒新动态']};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const box=(x,y,w,h,c,r=0,a='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}" ${a}/>`;
const txt=(x,y,s,size=32,c='#2d4250',anchor='start',weight=500)=>`<text x="${x}" y="${y}" font-size="${size}" fill="${c}" text-anchor="${anchor}" font-weight="${weight}">${esc(s)}</text>`;
const img=(h,id,x,y,w,hh,fit='xMidYMid slice')=>{if(!h[id])throw Error('Missing05 asset '+id);return `<image href="${esc(h[id])}" x="${x}" y="${y}" width="${w}" height="${hh}" preserveAspectRatio="${fit}"/>`;};
const line=(d,c='#718e9b',w=4,extra='')=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const arrow=(d,c='#718e9b')=>line(d,c,4,'marker-end="url(#s05-arrow)"');
const g=(b,a='')=>`<g ${a}>${b}</g>`;
function portrait(h,id,x,y,s,clip){return `<defs><clipPath id="${clip}">${box(x,y,s,s,'white',s*.16)}</clipPath></defs>`+g(img(h,id,x,y,s,s),`clip-path="url(#${clip})" data-participant="${id}"`);}
function bg(h){return g(img(h,'office',0,0,1920,1080),'filter="url(#s05-soft)"')+box(0,0,1920,1080,'#eee8dd',0,'opacity=".78"');}
export const root=b=>`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><style>text{font-family:'PingFang SC','Hiragino Sans GB',sans-serif}</style><defs><filter id="s05-soft"><feGaussianBlur stdDeviation="16"/></filter><marker id="s05-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0L7 4L0 8" fill="none" stroke="#718e9b" stroke-width="1.7"/></marker></defs>${b}</svg>`;
// Affine placement follows the photographed surface's upper and left edges. The safe mask stays inside the actual unoccluded quad.
function surface(cfg,id,body){const q=cfg.quad,[w,hh]=cfg.localSize,[o,a,,b]=q,m=[(a[0]-o[0])/w,(a[1]-o[1])/w,(b[0]-o[0])/hh,(b[1]-o[1])/hh,o[0],o[1]];return `<defs><clipPath id="${id}"><polygon points="${q.map(p=>p.join(',')).join(' ')}"/></clipPath></defs>`+g(g(body,`transform="matrix(${m.join(' ')})"`),`clip-path="url(#${id})"`);}
function signage(h,kind){const cfg=LAYOUT.signage[kind],large=kind==='insert',[w,hh]=cfg.board.localSize;
 let board=txt(w*.08,large?145:66,COPY.board.slogan,large?62:36,'#354e5c','start',600);
 if(large){board+=portrait(h,'manager',70,215,98,'s05-board-author')+txt(192,259,COPY.board.fields[0],40,'#5f737b')+txt(192,353,COPY.board.fields[1],40,'#5f737b');board+=line(`M190 279H${w-75}M190 374H${w-75}`,'#a7b5b3',3)+img(h,'documentWide',210,416,280,142,'xMidYMid meet');}
 else board+=txt(37,151,COPY.board.fields[0],29,'#647982')+txt(225,151,COPY.board.fields[1],29,'#647982')+line('M38 167H176M226 167H367','#90a4a8',2.5);
 const[aw,ah]=cfg.ad.localSize,fs=large?55:32;
 const ad=txt(aw*.5,large?113:49,COPY.advertisement.displayLines[0],fs,'#315f67','middle',650)+txt(aw*.5,large?190:92,COPY.advertisement.displayLines[1],fs,'#315f67','middle',650)+portrait(h,'agent',aw*(large?.23:.31),large?270:112,aw*(large?.54:.38),'s05-printed-ad-avatar');
 return g(surface(cfg.board,'s05-board-safe',board),'data-layer="physical-board-copy"')+g(surface(cfg.ad,'s05-ad-safe',ad),'data-layer="physical-ad-copy"');
}
function story(h,mode,state,{signs=true,feedback=true}={}){const id=mode==='delivery'?state?'review':'delivery':mode==='waiting'?'waiting':mode==='signage'?'signage':state?'resume':'pause';let b=g(img(h,id,0,0,1920,1080),`data-raster-state="${id}"`);
 if(signs&&['delivery','waiting','signage'].includes(mode))b+=signage(h,mode==='signage'?'insert':'wide');
 if(feedback&&mode==='delivery'&&state)b+=g(box(696,809,150,57,'#e1eee6',10)+txt(771,849,COPY.delivery.reviewed,30,'#487a63','middle',600),'data-action-feedback="human-reviewed"');
 if(feedback&&mode==='waiting'&&state){b+=g(box(1050,590,430,87,'#fbf7ee',15,'stroke="#a1b2b8" stroke-width="2"')+line('M1050 630L1018 607L1050 606','#a1b2b8',2)+txt(1265,645,COPY.waiting.agent,32,'#354e5c','middle'),'data-action-feedback="agent-request"');b+=box(1620,714,266,63,'#f5f9fa',10,'stroke="#b9cbd0" stroke-width="2"')+txt(1753,757,COPY.waiting.coworker,32,'#567984','middle');}
 return b;
}
function relations(h,state){let b=bg(h)+box(...LAYOUT.relationPanel,'#f8f4ec',22);
 b+=txt(480,119,COPY.relations.left,44,'#395d6b','middle',600)+txt(1430,119,COPY.relations.right,44,'#876d5c','middle',600);
 b+=portrait(h,'programmer',393,175,174,'s05-rel-main')+txt(480,396,COPY.relations.employee,34,'#415966','middle')+img(h,'company',1330,163,200,180,'xMidYMid meet')+txt(1430,396,COPY.relations.company,34,'#415966','middle');
 b+=line('M480 414V460H224V492M480 460H736V492M480 460V492','#6f9caa')+line('M1430 414V460H1174V492M1430 460H1686V492M1430 460V492','#a59685');
 [224,480,736].forEach((x,i)=>{b+=portrait(h,state&&i===0?'agentFocus':'agent',x-66,502,132,'s05-rel-agent-'+i)+txt(x,684,'Agent '+['A','B','C'][i],30,'#5b737c','middle')+txt(x,729,COPY.relations.capabilities[i],31,'#3b5967','middle');});
 ['coworkerA','programmer','coworkerB'].forEach((id,i)=>{const x=[1174,1430,1686][i];b+=portrait(h,id,x-66,502,132,'s05-rel-employee-'+i)+txt(x,684,COPY.relations.employee,31,'#5b737c','middle');});
 if(state>=1){COPY.relations.goals.forEach((s,i)=>{const x=1070+i*257;b+=box(x,755,232,75,'#e8e4dc',11)+txt(x+116,804,s,32,'#675f56','middle',600);});b+=line('M1544 230H1586','#a59685',3)+portrait(h,'manager',1598,185,76,'s05-rel-author')+txt(1636,306,'负责人',30,'#6d7b80','middle');}
 if(state===2){b+=arrow('M382 286H130V870H290')+g(img(h,'documentWide',302,782,355,177,'xMidYMid meet')+txt(480,847,COPY.relations.proposal,34,'#4c6d7b','middle',600),'data-object-id="S05-PROP-01"');b+=arrow('M668 865H996')+box(1015,852,229,66,'#f0e3c9',12)+txt(1129,897,COPY.relations.pending,32,'#8c7651','middle',600);}
 return g(b,'data-logic-scene="dual-relations"');
}
function feedbackScene(h,state){let b=bg(h)+box(64,40,1792,920,'#f8f4ec',22);
 b+=portrait(h,'coworkerA',135,180,112,'s05-shared-a')+portrait(h,'coworkerB',286,180,112,'s05-shared-b')+img(h,'document',512,197,150,190,'xMidYMid meet')+txt(587,437,COPY.feedback.shared,35,'#566f78','middle',600)+arrow('M715 310H1190V244H1260');
 b+=img(h,'company',1484,149,200,175,'xMidYMid meet')+portrait(h,'manager',1271,188,112,'s05-rule-author')+txt(1430,382,COPY.feedback.objective,39,'#5b6b72','middle',600)+arrow('M1327 320V405');
 b+=g(img(h,'documentWide',1155,416,600,350,'xMidYMid meet')+txt(1455,545,state?COPY.feedback.page:COPY.feedback.objective,38,'#3d5965','middle',600)+txt(1455,612,'产品目标 · 交付标准',32,'#6e8088','middle')+txt(1455,674,state?COPY.feedback.proposal+'：'+COPY.feedback.status:'排期 · 成果分配',32,state?'#997a4f':'#6e8088','middle'),'data-object-id="S05-PLAN-01"');
 b+=portrait(h,'programmer',282,652,146,'s05-end-human')+portrait(h,'agent',722,652,146,'s05-end-agent')+arrow('M456 727H695')+txt(576,685,COPY.feedback.instruction,33,'#456b7b','middle')+img(h,'document',934,682,93,120,'xMidYMid meet')+arrow('M882 727H921');
 b+=arrow('M1445 752V848H451V810')+txt(1050,892,COPY.feedback.requirements,35,'#907462','middle');
 if(state)b+=g(box(129,858,438,73,'#e9e1d0',12)+txt(348,907,COPY.feedback.proposal+' · '+COPY.feedback.status,31,'#8d7858','middle'),'data-object-id="S05-PROP-01"');
 return g(b,'data-logic-scene="organization-feedback"');
}
export const SCENES={relations:{label:'调用与组织关系',states:3},delivery:{label:'交付与验收',states:2},waiting:{label:'等候新指令',states:2},reaction:{label:'停顿与重新输入',states:2},signage:{label:'白板与广告',states:1},feedback:{label:'目的与尺度',states:2}};
export function scene(name,h,state=0,options={}){if(!SCENES[name])throw Error('Unknown05 scene '+name);state=Math.max(0,Math.min(SCENES[name].states-1,Math.floor(state)));return name==='relations'?relations(h,state):name==='feedback'?feedbackScene(h,state):story(h,name,state,options);}
