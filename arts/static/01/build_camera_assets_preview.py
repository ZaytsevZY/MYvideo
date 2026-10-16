"""Build static QA layouts for S01_CAMERA v0.2 assets; never edits source PNGs."""
from pathlib import Path
import base64, json, hashlib, html
from PIL import Image
ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / 'arts/static/01'
RECORDS = json.loads((OUT/'camera-assets-sources-v01.json').read_text())
SHA = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
BY_ID = {x['id']:x for x in RECORDS}
BY_ID['N5'] = {'id':'N5','key':'monitor-back','path':'arts/items/01/monitor-back-v01.svg','transparent':True,'promptPath':None,'source':None,'refs':[]}

def uri(rel):
    p=ROOT/rel
    kind='image/svg+xml' if p.suffix=='.svg' else 'image/png'
    return 'data:'+kind+';base64,'+base64.b64encode(p.read_bytes()).decode()
def picture(rel,x,y,w,h,extra=''):
    return f'<image href="{uri(rel)}" x="{x}" y="{y}" width="{w}" height="{h}" preserveAspectRatio="xMidYMid meet" {extra}/>'
def svg(content,defs=''):
    return '<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><defs>'+defs+'</defs>'+content+'</svg>'

def frontal(which):
    a=BY_ID[which]
    return svg(picture(BY_ID['N4']['path'],-8,-5,1936,1090,'filter="url(#soft-bg)"')+picture(a['path'],510.33,70,899.34,1063.92)+picture(BY_ID['N5']['path'],360,844,1200,337.5,'filter="url(#soft-front)"'),'<filter id="soft-bg" x="-2%" y="-2%" width="104%" height="104%"><feGaussianBlur stdDeviation="2"/></filter><filter id="soft-front" x="-2%" y="-2%" width="104%" height="104%"><feGaussianBlur stdDeviation="1.3"/></filter>')

def logic():
    s=picture('arts/backgrounds/01/workroom-day-v01.png',0,0,1920,1080)
    s+='<rect x="600" y="65" width="1120" height="450" rx="26" fill="#F6F1E7" fill-opacity=".97" stroke="#BCC7CC" stroke-width="2"/>'
    s+='<text x="632" y="123" fill="#263342" font-size="34" font-family="Hiragino Sans GB, sans-serif">派发与审核／后台执行</text>'
    s+=picture('arts/static/01/time-tracks-base-v01.svg',630,157,870,203)
    s+=picture('arts/static/01/human-dispatch-v01.svg',796,192.96,98.6,34.8)
    s+=picture('arts/static/01/human-review-v01.svg',1335.28,192.96,98.6,34.8)
    s+=picture('arts/static/01/machine-execution-v01.svg',894.48,274.16,440.8,34.8)
    s+='<text x="928" y="418" fill="#687783" font-size="26" font-family="Hiragino Sans GB, sans-serif">离线区间，不直接等同自由时间</text>'
    s+=picture(BY_ID['N3']['path'],84.8,223.32,532.48,798.72)
    s+=picture('arts/characters/poses/01/agent-report-v01.png',1394,281.28,491.52,737.28)
    return svg(s)

for name,content in [('camera-front-neutral-v01.svg',frontal('N1')),('camera-front-dispatch-v01.svg',frontal('N2')),('camera-standing-layout-v01.svg',logic())]:
    (OUT/name).write_text(content)
layout={'version':'S01_CAMERA_ASSETS v0.1','script':'S01_CAMERA v0.2','canvas':[1920,1080],'status':'static asset QA candidates; not animation or frozen layout','front':{'room':[-8,-5,1936,1090],'N1_N2':[510.33,70,899.34,1063.92],'N5':[360,844,1200,337.5],'layer_order':['N4 background with preview blur','N1 or N2 intact pose','N5 monitor-back foreground'],'note':'N1 and N2 use the same transform and native dimensions; never stretch either axis independently.'},'standing':{'N3':[84.8,223.32,532.48,798.72],'agent_report':[1394,281.28,491.52,737.28],'backdrop':[600,65,1120,450],'floor_baseline':1008,'layer_order':['day room','local diagram backdrop','editable diagram primitives','N3','foreground Agent']}}
(OUT/'camera-assets-layout-v01.json').write_text(json.dumps(layout,ensure_ascii=False,indent=2)+'\n')
assets=[]
for key in ['N1','N2','N3','N4','N5']:
    a=BY_ID[key];p=ROOT/a['path'];entry={'id':key,'key':a['key'],'path':a['path'],'sha256':SHA(p),'source':a['source'],'prompt':a['promptPath'],'tool':'image_gen.imagegen (built-in)' if key!='N5' else 'native SVG authored by Codex','model_identifier':'not exposed by tool' if key!='N5' else None,'transparent_background_requested':a['transparent'],'references':a['refs']}
    if key!='N5':
        im=Image.open(p);entry.update(size=list(im.size),mode=im.mode)
        if 'A' in im.getbands():
            alpha=im.getchannel('A');entry['alpha_range']=list(alpha.getextrema());entry['bounds96']=list(alpha.point(lambda x:255 if x>=96 else 0).getbbox());entry['transparent_corner_alpha']=[alpha.getpixel(q) for q in [(0,0),(im.width-1,0),(0,im.height-1),(im.width-1,im.height-1)]]
    else:entry['size']=[1280,360]
    if entry['prompt']:entry['prompt_sha256']=SHA(ROOT/entry['prompt'])
    assets.append(entry)
manifest={'version':'S01_CAMERA_ASSETS v0.1','date':'2026-10-16','timezone':'Asia/Shanghai','script':'S01_CAMERA v0.2','status':'generated candidate assets; static QA only; not user frozen','raster_calls':4,'native_svg_count':1,'source_pixels':'copied unchanged; no raster postprocessing','assets':assets,'checks':{'source_hashes_match':all(SHA(ROOT/a['path'])==SHA(Path(a['source'])) for a in RECORDS),'all_character_alpha_corners_transparent':all(all(x==0 for x in a['transparent_corner_alpha']) for a in assets if 'transparent_corner_alpha' in a),'frontal_canvas_sizes_equal':assets[0]['size']==assets[1]['size']},'derived_static_previews':[{'path':'arts/static/01/'+f,'sha256':SHA(OUT/f)} for f in ['camera-front-neutral-v01.svg','camera-front-dispatch-v01.svg','camera-standing-layout-v01.svg']],'builder':'arts/static/01/build_camera_assets_preview.py','limitations':['Static compositing checks are not timed animation validation.','N1/N2 contours are not pixel-identical; use pose cuts, never body crossfade.','N3 source carries very low alpha fringe similar to older poses; inspect against final backgrounds.','Frontal PNG native size differs from older 1024x1536 full-body assets; consumer must read native dimensions.']}
(OUT/'camera-assets-manifest-v01.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
# Additive registry: preserve the previous full-body manifest as the old preview dependency.
old=json.loads((ROOT/'arts/characters/poses/01/manifest-v02.json').read_text())
(ROOT/'arts/characters/poses/01/manifest-camera-v01.json').write_text(json.dumps({'version':'S01_CAMERA_POSES v0.1','extends':'manifest-v02.json','existing_pose_count':len(old.get('poses',old.get('assets',[]))),'new_pose_count':3,'new_poses':[a for a in assets if a['id'] in ['N1','N2','N3']],'consumer_note':'Additive registry only. Existing animation still reads its original bundle; no source PNG has been resized to a hard-coded canvas.'},ensure_ascii=False,indent=2)+'\n')
parts=[]
for key in ['N1','N2','N3','N4','N5']:
    a=BY_ID[key];parts.append('<figure><div class="checker"><img src="'+uri(a['path'])+'" alt="'+key+'"></div><figcaption>'+key+' · '+html.escape(a['key'])+'</figcaption></figure>')
page='''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>01新增镜头素材 · 静态检查</title><style>
*{box-sizing:border-box}body{margin:0;padding:28px;background:#e8e3d9;color:#263342;font:16px/1.6 system-ui,sans-serif}h1{font-size:26px;margin:0 0 8px}p{margin:8px 0 24px}.grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:16px}figure{margin:0;background:#f6f1e7;border:1px solid #c6cdd1;border-radius:10px;overflow:hidden}.checker{height:310px;background:conic-gradient(#eee 25%,#fff 0 50%,#eee 0 75%,#fff 0) 0 0/22px 22px}.checker img{width:100%;height:100%;object-fit:contain}figcaption{padding:10px;font-size:13px}.stage{width:100%;aspect-ratio:16/9;background:#152330;display:block;border-radius:10px}.shots{display:grid;grid-template-columns:1fr 1fr;gap:18px}h2{font-size:21px;margin:30px 0 12px}label{margin-right:20px}button{background:#263342;color:#fff;border:0;border-radius:5px;padding:8px 15px;cursor:pointer}.note{color:#687783}a{color:#405f78}@media(max-width:900px){.grid{grid-template-columns:repeat(3,1fr)}.shots{grid-template-columns:1fr}}
</style><h1>01 · 新增镜头素材</h1><p>5项资源 · S01_CAMERA v0.2 · 仅静态构图检查；原动作预览尚未接入这些资源。</p><div class="grid">'''+''.join(parts)+'''</div><h2>正面反打：背景 → 完整人物 → 显示器背壳</h2><p><button id="switch">切换到决定派发姿态 N2</button>　<span class="note">同一变换、无人物叠化；仅背景与前景做预览虚化。</span></p><img id="front" class="stage" src="camera-front-neutral-v01.svg"><h2>站立构图：程序员朝右，Agent在图解前景</h2><img class="stage" src="camera-standing-layout-v01.svg"><p class="note">此图只检验资产比例、方向和遮挡，不表示图解动画或配音已完成。</p><script>let second=false;document.querySelector('#switch').onclick=()=>{second=!second;document.querySelector('#front').src=second?'camera-front-dispatch-v01.svg':'camera-front-neutral-v01.svg';document.querySelector('#switch').textContent=second?'切换到中性姿态 N1':'切换到决定派发姿态 N2'};</script></html>'''
(OUT/'camera-assets-preview-v01.html').write_text(page)
print(json.dumps({'assets':[(a['id'],a['size']) for a in assets],'checks':manifest['checks'],'preview':'arts/static/01/camera-assets-preview-v01.html'},ensure_ascii=False,indent=2))
