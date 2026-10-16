"""Build Shot 01 native SVG assets and static layout previews.
No raster editing, character posing, animation, or frame baking is performed.
Run from any directory: python3 arts/static/01/build_assets.py
"""
from pathlib import Path
import json,base64,hashlib,struct
from html import escape
ROOT=Path(__file__).resolve().parents[3]
ITEM=ROOT/'arts/items/01'
STATIC=ROOT/'arts/static/01'
FONT='Hiragino Sans GB, PingFang SC, Noto Sans CJK SC, sans-serif'
P={'ink':'#263342','paper':'#F6F1E7','text_muted':'#687783','muted':'#9BA7B1','blue':'#798DA8','cyan':'#6DBCCB','green':'#84B79A','amber':'#E9B468','coral':'#CC806F','wood':'#B69270','woodlight':'#D7B897','screen':'#152330'}
ASSETS=[]
PANELS=json.loads((STATIC/'diagram-panels-v01.json').read_text())
def diagram_panel(kind):
    x,y,w,h=PANELS['bounds'][kind]
    return rect(x,y,w,h,PANELS['fill'],PANELS['radius'],stroke=PANELS['stroke'],sw=PANELS['strokeWidth'],fill_opacity=PANELS['fillOpacity'])
def text(x,y,s,size=24,fill=None,**kw):
    attr=' '.join(f'{k.replace("_","-")}="{escape(str(v),quote=True)}"' for k,v in kw.items())
    return f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill or P["ink"]}" {attr}>{escape(s)}</text>'
def floating_text(x,y,s,size=30,fill=None,**kw):
    return text(x,y,s,size,fill,stroke=P['paper'],stroke_width=4,paint_order='stroke fill',**kw)
def rect(x,y,w,h,fill,rx=0,stroke=None,sw=3,**kw):
    attr=' '.join(f'{k.replace("_","-")}="{escape(str(v),quote=True)}"' for k,v in kw.items())
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke or P["ink"]}" stroke-width="{sw}" {attr}/>'
def path(d,fill='none',stroke=None,sw=3,**kw):
    attr=' '.join(f'{k.replace("_","-")}="{escape(str(v),quote=True)}"' for k,v in kw.items())
    return f'<path d="{d}" fill="{fill}" stroke="{stroke or P["ink"]}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" {attr}/>'
def line(x1,y1,x2,y2,stroke=None,sw=3,**kw):
    return path(f'M{x1} {y1}H{x2}' if y1==y2 else f'M{x1} {y1}L{x2} {y2}',stroke=stroke,sw=sw,**kw)
def svg(w,h,body,title):
    return f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-label="{escape(title,quote=True)}"><title>{escape(title)}</title><g font-family="{FONT}" stroke-linecap="round" stroke-linejoin="round">{body}</g></svg>\n'
def save(folder,name,w,h,body,title,role,anchors=None):
    p=folder/(name+'-v01.svg');p.write_text(svg(w,h,body,title))
    ASSETS.append({'id':name,'path':str(p.relative_to(ROOT)),'size':[w,h],'role':role,'anchors':anchors or {},'format':'native SVG','source':'arts/static/01/build_assets.py'})
def img(href,x,y,w,h):
    # Self-contained previews also work when the root SVG is used as an HTML img.
    source=(STATIC/href).resolve()
    mime='image/png' if source.suffix=='.png' else 'image/svg+xml'
    uri='data:'+mime+';base64,'+base64.b64encode(source.read_bytes()).decode()
    fit='none' if 'keyboard-v01.svg' in href else 'xMidYMid meet'
    return f'<image href="{uri}" xlink:href="{uri}" data-asset="{href}" x="{x}" y="{y}" width="{w}" height="{h}" preserveAspectRatio="{fit}"/>'
def main():
    ITEM.mkdir(parents=True,exist_ok=True);STATIC.mkdir(parents=True,exist_ok=True)
    # Furniture is separate from the illustrated room. Transparent outside each shape.
    save(ITEM,'desk-legs',1440,400,
        rect(90,0,46,378,'#656A72',5)+rect(1280,0,46,378,'#656A72',5)+rect(114,52,1188,36,'#777A7D',4)+path('M90 378H170M1240 378H1360',stroke=P['ink'],sw=10),
        '工位桌腿与后支架','behind seated character and desk surface',{'floor':[720,390]})
    save(ITEM,'desk-surface',1440,160,
        path('M74 16H1350L1418 86H20Z',P['woodlight'])+path('M20 86H1418V120H20Z',P['wood'])+line(40,95,1398,95,'#E3C7A5',2)+path('M74 16L20 86M1350 16L1418 86',stroke='#796653',sw=2),
        '独立桌面与前缘','foreground occluder; arms and input items layer above',{'surface_center':[720,54],'front_edge_y':86})
    save(ITEM,'chair-back',340,480,
        rect(40,15,260,338,'#687586',48)+rect(66,42,208,272,'#8290A0',34,sw=2)+rect(149,350,42,118,'#454E5A',10),
        '椅背后层','behind character torso',{'seat_connection':[170,460]})
    save(ITEM,'chair-seat',340,310,
        rect(20,14,300,70,'#738092',28)+rect(145,82,50,132,'#586371',9)+path('M170 210L40 265M170 210L300 265M170 210V282',stroke='#47515F',sw=15)+rect(15,252,48,32,'#303C49',12)+rect(277,252,48,32,'#303C49',12)+rect(146,273,48,32,'#303C49',12),
        '座垫与椅脚','behind thighs; attach to chair-back seat_connection',{'seat_top':[170,14],'floor':[170,306]})
    save(ITEM,'monitor-frame',640,440,
        rect(5,4,630,374,'#394858',16)+rect(20,16,600,348,'#263443',9)+rect(32,28,576,324,P['screen'],5,stroke='#101A24',sw=2)+rect(294,378,52,31,'#65717D',3)+path('M255 408H385L431 432H209Z','#7F8993')+f'<circle cx="612" cy="370" r="3" fill="{P["green"]}"/>',
        '显示器外框与支架','screen UI overlays the exact aperture',{'screen_rect':[32,28,576,324],'stand_base':[320,432]})
    save(ITEM,'computer-tower',260,390,
        path('M22 27L193 10L240 36V360L193 380L22 359Z','#657383')+path('M193 10V380L240 360V36Z','#455463')+rect(43,58,126,40,'#354453',5)+path('M55 128H153M55 142H153M55 156H153',stroke='#394957',sw=5)+f'<circle cx="153" cy="295" r="10" fill="{P["cyan"]}" stroke="{P["ink"]}" stroke-width="3"/>',
        '独立主机','under desk, behind desk front',{'floor':[130,380]})
    keys=''
    for row in range(4):
        for col in range(12):keys+=rect(38+col*43+row*3,30+row*27,35,20,'#E5E0D6',3,stroke='#71808B',sw=1.4)
    keys+=rect(163,140,250,17,'#E5E0D6',3,stroke='#71808B',sw=1.4)
    save(ITEM,'keyboard',600,180,path('M28 10H562L590 163H8Z','#AAB1B6')+keys,
        '无字母键盘','hand contact prop',{'typing_left':[210,80],'typing_right':[380,80]})
    save(ITEM,'mouse',120,160,
        path('M60 8C26 8 15 40 15 83V114C15 142 105 142 105 114V83C105 40 94 8 60 8Z','#D9DAD7')+path('M60 10V62M18 64H102',stroke='#65727E',sw=2)+rect(54,28,12,26,'#778896',5,sw=1),
        '鼠标','right-hand contact prop',{'palm':[60,90]})
    lamp=path('M138 369L103 207L189 95',stroke='#3D4B5B',sw=15)+path('M138 369L103 207L189 95',stroke='#8794A0',sw=7)+path('M162 42L225 77L184 135L121 98Z','#D9A665')+path('M121 98L184 135',stroke='#F4D5A2',sw=7)+path('M65 383C78 359 211 359 225 383V399H65Z','#758493')
    save(ITEM,'desk-lamp',280,440,lamp,'可独立摆放的台灯','lamp geometry only; separate glow overlay',{'light_source':[150,116],'base':[145,399]})
    save(ITEM,'lamp-glow',520,440,
        '<defs><radialGradient id="glow"><stop stop-color="#FFD59A" stop-opacity=".24"/><stop offset="1" stop-color="#FFD59A" stop-opacity="0"/></radialGradient></defs><ellipse cx="255" cy="190" rx="245" ry="180" fill="url(#glow)"/>',
        '独立台灯暖光','optional additive-look overlay; no fixture',{'center':[255,190]})
    def screen(head,body):
        return rect(0,0,576,324,P['screen'],0,stroke='none',sw=0)+rect(0,0,576,42,'#283B4D',0,stroke='none',sw=0)+text(20,29,head,19,'#E6E8E8')+body
    save(ITEM,'screen-off',576,324,rect(0,0,576,324,'#111A24',0,stroke='none',sw=0),'关闭屏幕','opaque screen fill; aperture only')
    idle=path('M248 140L222 164L248 188M328 140L354 164L328 188M301 131L276 200',stroke=P['cyan'],sw=6)+text(288,257,'等待派发',24,'#C8D3DA',text_anchor='middle')
    save(ITEM,'screen-idle',576,324,screen('开发项目',idle),'待派发界面','editable native UI; no fake code or metrics')
    running=''
    for y,label,color in [(102,'编写代码',P['green']),(180,'运行测试',P['cyan']),(258,'整理结果',P['muted'])]:
        running+=rect(22,y-36,532,60,'#203243',9,stroke='#405368',sw=2)+f'<circle cx="51" cy="{y-6}" r="8" fill="{color}"/>'+text(77,y,label,24,'#DCE4E8')
    save(ITEM,'screen-running',576,324,screen('执行过程',running),'执行过程界面','edit named groups or replace full state; not a numerical progress report')
    review=''
    for y,label,state,color in [(104,'代码结果','待审核',P['cyan']),(182,'测试支路','待修改',P['amber']),(260,'结果整理','已生成',P['green'])]:
        review+=text(24,y,label,24,'#E6ECEC')+rect(406,y-28,142,43,color,9,stroke='none',sw=0)+text(477,y+1,state,21,P['ink'],text_anchor='middle')+line(24,y+20,548,y+20,'#3E5264',1)
    save(ITEM,'screen-review',576,324,screen('人工验收',review),'验收与退回界面','generation does not imply acceptance; rework remains visible')
    # Logic primitives: transparent SVG; text stays editable and separate from room.
    save(STATIC,'logic-panel',1500,760,
        rect(8,8,1484,744,P['paper'],28,sw=4)+path('M38 94H1460',stroke='#A9B0B2',sw=2)+f'<circle cx="48" cy="50" r="8" fill="{P["cyan"]}"/><circle cx="76" cy="50" r="8" fill="{P["amber"]}"/>',
        '可选图解背景框','optional only; not used in default floating overlays',{'content_rect':[48,120,1404,570],'header_rect':[110,20,1300,65]})
    tracks=''
    for y,label in [(90,'人的直接操作'),(230,'机器执行')]:
        tracks+=floating_text(18,y+10,label,36)+path(f'M286 {y}H1470L1458 {y-10}M1470 {y}L1458 {y+10}',stroke='#536D82',sw=3)
    tracks+=floating_text(18,333,'情境示意 · 不代表实测时长',26,'#566B7A')
    save(STATIC,'time-tracks-base',1500,350,tracks,'透明双轨时间图','floating lines and labels, no panel or filled track background',{'human_lane':[286,62,1130,56],'machine_lane':[286,202,1130,56]})
    for name,label,w,color in [('human-dispatch','派发',170,P['blue']),('human-review','审核',170,P['blue']),('machine-execution','后台执行',760,P['cyan'])]:
        save(STATIC,name, w,60,rect(2,2,w-4,56,color,22,stroke='#526A7C',sw=2)+text(w/2,39,label,24,P['ink'],text_anchor='middle'),
            label+'独立区段','qualitative length only; not time measurement')
    for name,label,tone in [('evaluation','待评估','#E4E5DF'),('scheduled','列入排期','#DAE7E9'),('acceptance','进入验收','#E2E9DD')]:
        save(STATIC,'lane-'+name,410,350,
            floating_text(205,52,label,36,P['ink'],text_anchor='middle')+line(90,77,320,77,'#657E91',2),
            label+'浮动流程位置','transparent header and alignment anchor, no filled lane or border',{'task_slot':[45,110,320,140]})
    icons={
        'test':path('M19 12H65V61H19Z',P['paper'])+path('M29 25H55M29 36H55M29 47H47',stroke=P['blue'],sw=3),
        'interface':rect(12,12,65,49,P['paper'],4,sw=3)+line(12,27,77,27,P['blue'],3)+rect(22,37,16,14,P['cyan'],2,sw=1),
        'feature':rect(13,12,64,50,P['paper'],7,sw=3)+path('M45 23V51M31 37H59',stroke=P['coral'],sw=5)
    }
    for name,label,color in [('test','补齐测试',P['green']),('interface','界面优化',P['cyan']),('feature','搁置需求',P['coral'])]:
        body=f'<g transform="translate(25 31)">{icons[name]}</g>'+floating_text(119,81,label,33)
        save(STATIC,'task-'+name,320,140,body,label+'浮动任务','icon and label only; stable identity without a card container',{'drag_anchor':[160,70]})
    save(STATIC,'connector-arrow',160,54,path('M8 27H145M127 10L145 27L127 44',stroke='#587B8F',sw=7),'关系连接箭头','meaning defined by scene, not decorative')
    save(STATIC,'endpoint-marker',100,210,
        path('M28 15V196',stroke=P['coral'],sw=6)+path('M31 17H85L67 44H31Z',P['coral'],sw=2),
        '工作终点标记','move independently from tracks and cards',{'line_x':28})
    save(STATIC,'cursor',70,90,path('M10 7L58 48L36 53L46 77L34 83L24 58L10 73Z',P['paper'],sw=3),'交互光标','independent pointer')
    save(STATIC,'status-check',70,70,path('M12 37L28 52L59 18',stroke=P['green'],sw=8),'通过标记','only where a scene explicitly indicates approval')
    save(STATIC,'status-rework',70,70,path('M54 50C64 24 40 12 19 27M19 27H40M19 27V8',stroke=P['amber'],sw=7),'退回修改标记','distinct from completed/approved')
    layout={
        'version':'S01_ASSETS v0.5','canvas':[1920,1080],'status':'static assets only; floating logic overlays; no character bake or video',
        'background_fit':'cover; source1672x941 differs from16:9 by less than0.1%, so use a shared center anchor',
        'screen_aperture_local':[32,28,576,324],
        'composition':[
            {'asset':'background','z':0,'rect':[0,0,1920,1080]},
            {'asset':'chair-back','z':10,'rect':[315,455,265,374]},
            {'asset':'chair-seat','z':11,'rect':[315,770,265,242]},
            {'asset':'desk-legs','z':12,'rect':[180,746,1110,308]},
            {'asset':'computer-tower','z':13,'rect':[1045,780,170,255]},
            {'asset':'programmer-body-FUTURE','z':20,'rect':[300,420,360,640],'available':False},
            {'asset':'desk-surface','z':30,'rect':[180,707,1110,123]},
            {'asset':'monitor-frame','z':40,'rect':[680,400,544,374]},
            {'asset':'screen','z':41,'rect':[707.2,423.8,489.6,275.4]},
            {'asset':'keyboard','z':42,'rect':[625,734,385,70]},
            {'asset':'mouse','z':42,'rect':[1040,733,43,58]},
            {'asset':'desk-lamp','z':43,'rect':[185,420,220,346]},
            {'asset':'programmer-forearms-FUTURE','z':50,'available':False},
            {'asset':'agent-FUTURE','z':60,'rect':[1450,355,280,640],'available':False},
            {'asset':'floating-logic-FUTURE','z':70,'rect':[650,20,1200,324],'size_policy':'content bounds; this rect is a preview example, not a mandatory stage'},
            {'asset':'captions-FUTURE','z':100,'rect':[120,930,1680,120],'available':False}
        ],
        'contact_anchors':{'left_hand_keyboard':[759.75,765.11],'right_hand_keyboard':[868.83,765.11],'mouse':[1061.5,765.25],'person_head_approx':[452,460],'agent_zone':[1410,345,390,650]},
        'semantic_palette':P,
        'diagram_layout':{'mode':'floating over story background','container':'content-sized background from diagram-panels-v01.json; Agent above panel','size_policy':'fit actual content, readable labels, and current actor/prop exclusion zones','preview_region':[650,20,1200,324],'background_visible':True,'text_contrast':'local glyph outlines; no automatic whole-screen dimming','optional_panel':'logic-panel-v01.svg only for a specific justified legibility need'},
        'notes':['No character silhouettes are baked into backgrounds.','Coordinates are static assembly defaults, not validated character joints.','Room has no workstation furniture; native SVG furniture is separate.','Keyboard uses preserveAspectRatio=none to flatten its tabletop projection; hand anchors use separate x/y scales.','Readability and hand contact must be rechecked after character baking.','No numerical data or measured efficiency is encoded.']
    }
    (STATIC/'layout-v01.json').write_text(json.dumps(layout,ensure_ascii=False,indent=2)+'\n')
    # Assembly previews are static layout proofs, not animation frames.
    def room_body(day=False):
        state='day' if day else 'night'
        body=img(f'../../backgrounds/01/workroom-{state}-v01.png',0,0,1920,1080)
        positions={r['asset']:r['rect'] for r in layout['composition'] if 'rect' in r}
        for name in ['chair-back','chair-seat','desk-legs','computer-tower','desk-surface','monitor-frame','screen','keyboard','mouse','desk-lamp']:
            filename='screen-review' if day and name=='screen' else 'screen-running' if name=='screen' else name
            body+=img(f'../../items/01/{filename}-v01.svg',*positions[name])
        return body
    for day in [False,True]:
        (STATIC/f'assembly-{"day" if day else "night"}-v01.svg').write_text(svg(1920,1080,room_body(day),'01工位静态叠层检查'))
    logic=room_body(day=True)+'<g id="floating-time" transform="translate(650 20) scale(.8)">'
    logic+=diagram_panel('time')+floating_text(18,38,'人物操作与后台执行',34)+img('time-tracks-base-v01.svg',0,55,1500,350)
    logic+=img('human-dispatch-v01.svg',286,117,170,60)+img('human-review-v01.svg',1216,117,170,60)+img('machine-execution-v01.svg',456,257,760,60)
    logic+=floating_text(800,225,'离线区间不直接标为自由时间',28,'#566B7A',text_anchor='middle')+'</g>'
    (STATIC/'logic-time-preview-v01.svg').write_text(svg(1920,1080,logic,'01双轨图浮动叠层检查'))
    workflow=room_body(day=True)+'<g id="floating-workflow" transform="translate(650 20) scale(.8)">'+diagram_panel('workflow')+floating_text(18,38,'候选任务与项目计划流程',34)
    for x,name in [(0,'evaluation'),(520,'scheduled'),(1040,'acceptance')]:workflow+=img('lane-'+name+'-v01.svg',x,65,410,350)
    workflow+=img('task-test-v01.svg',45,175,320,140)+img('task-interface-v01.svg',565,175,320,140)+img('task-feature-v01.svg',1085,175,320,140)
    workflow+=img('connector-arrow-v01.svg',420,222,88,30)+img('connector-arrow-v01.svg',940,222,88,30)+floating_text(18,385,'定性示意；仅显示当前解释需要的对象。',26,'#566B7A')+'</g>'
    (STATIC/'logic-workflow-preview-v01.svg').write_text(svg(1920,1080,workflow,'01任务流浮动叠层检查'))
    # Current whole-pose check is built separately; retain legacy empty-stage proofs.
    html='<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>01静态素材检查</title><style>body{background:#172431;color:#f7f1e6;font-family:system-ui;margin:20px}nav{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:16px}button{padding:10px 18px;border:0;border-radius:5px;cursor:pointer}button[aria-pressed=true]{background:#e9b468}img{max-width:100%;max-height:80vh;display:block;margin:auto}p{color:#bbc8d0}</style><h1>01 静态素材与叠层检查</h1><p>背景、道具与图解组件分离；人物和动态帧尚未制作。切换仅用于静态检查。</p><nav>'
    whole=(ROOT/'arts/actions/01/assembly-night-whole-v01.svg').exists()
    if whole:
        html=html.replace('背景、道具与图解组件分离；人物和动态帧尚未制作。切换仅用于静态检查。','当前默认：完整背面坐姿＋椅背前景遮挡。<a style="color:#e9b468" href="../../actions/01/preview.html">打开动作试验</a>；旧空工位仅用于素材对照。')
        for name,label in [('assembly-night','背面坐姿·夜间'),('assembly-day','背面坐姿·白天'),('rise','半起身'),('receive-file','Agent接文件'),('inspect-file','查看文件'),('return-file','递回结果'),('logic','时间图解＋底框'),('workflow','任务流＋底框'),('queue','任务终点＋底框')]:html+=f'<button data-src="../../actions/01/{name}-whole-v01.svg">{label}</button>'
    for name,label in [('assembly-night','旧空工位·夜间'),('assembly-day','旧空工位·白天'),('logic-time-preview','旧双轨组件'),('logic-workflow-preview','旧任务流组件')]:html+=f'<button data-src="{name}-v01.svg">{label}</button>'
    initial='../../actions/01/assembly-night-whole-v01.svg' if whole else 'assembly-night-v01.svg'
    html+=f'</nav><img id="stage" src="{initial}" alt="01静态叠层预览">'+ '<script>document.querySelectorAll("button").forEach((b,i)=>{b.setAttribute("aria-pressed",i===0);b.onclick=()=>{document.getElementById("stage").src=b.dataset.src;document.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));};});</script></html>'
    (STATIC/'preview.html').write_text(html)
    ASSETS.append({'id':'chair-back-rear','path':'arts/items/01/chair-back-rear-v02.svg','size':[340,480],'title':'椅背外壳背面','layer':'in front of complete rear-view programmer','anchors':{'seat_connection':[170,460]}})
    (STATIC/'native-assets-v01.json').write_text(json.dumps(ASSETS,ensure_ascii=False,indent=2)+'\n')
    files=[]
    for folder in [ROOT/'arts/backgrounds/01',ITEM,STATIC]:
        for file in sorted(folder.rglob('*')):
            if not file.is_file() or file.name=='manifest-v01.json' or '__pycache__' in file.parts:continue
            blob=file.read_bytes()
            record={'path':str(file.relative_to(ROOT)),'bytes':len(blob),'sha256':hashlib.sha256(blob).hexdigest()}
            if blob[:8]==b'\x89PNG\r\n\x1a\n':record['dimensions']=list(struct.unpack('>II',blob[16:24]))
            files.append(record)
    calls=json.loads((ROOT/'arts/backgrounds/01/generation-v01.json').read_text())
    references=sorted({f for c in calls['calls'] for f in c['referenced_image_paths']})
    manifest={'version':'S01_ASSETS v0.5','date':'2026-10-15','timezone':'Asia/Shanghai','shot':'01','content_version':'SHOT_TEXT v0.4','background_calls':calls['calls'],'native_svg_count':len(ASSETS),'native_assets':ASSETS,'static_layout_preview_count':4,'animation_frames_baked':0,'current_character_layout':'arts/actions/01/layout-whole-v01.json','reference_sha256':{f:hashlib.sha256((ROOT/f).read_bytes()).hexdigest() for f in references},'files':files}
    (STATIC/'manifest-v01.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    print(f'Built {len(ASSETS)} native SVG assets, 4 static assembly SVGs and a preview page. No animation baking.')
if __name__=='__main__':main()

