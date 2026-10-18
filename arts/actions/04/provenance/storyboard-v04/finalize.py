from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[5]
OUT = Path(__file__).resolve().parent
ART = ROOT / 'arts/static/04/story-assets-v03'
def dump(p, obj):
    p.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n')

plan = (OUT/'chapter-plan.md').read_text()
shots = []
for line in plan.splitlines():
    m = re.match(r'\| (S04-\d+)／(V04\.\d+)／([EL]) \| ([\d.]+)–([\d.]+)／(\d+)–(\d+) \|', line)
    if not m:
        continue
    ident, parent, kind, a, b, fa, fb = m.groups()
    shots.append(dict(id=ident,parent=parent,type=kind,startSec=float(a),endSec=float(b),startFrame=int(fa),endFrameExclusive=int(fb)))
assert len(shots)==14
assert shots[0]['startFrame']==0 and shots[-1]['endFrameExclusive']==1650
assert all(a['endFrameExclusive']==b['startFrame'] for a,b in zip(shots,shots[1:]))
assert all(round(s['startSec']*30)==s['startFrame'] and round(s['endSec']*30)==s['endFrameExclusive'] for s in shots)
assert sum(s['endFrameExclusive']-s['startFrame'] for s in shots if s['type']=='E')==963
dump(OUT/'shot-timing.json',dict(version='S04_STORYBOARD v0.4',status='storyboard-not-runtime',fps=30,durationSec=55,durationFrames=1650,globalStartFrame=3660,globalEndFrameExclusive=5310,shots=shots))
draft=json.loads((OUT.parent/'storyboard-v03/narration-cues-draft.json').read_text())
draft['version']='S04_STORYBOARD v0.4'
draft['note']='正文和13条语义排时继承v0.3；子镜节奏按Claude优化重分，正式字幕尚未更新。'
dump(OUT/'narration-cues-draft.json',draft)
dump(OUT/'boundary-from-03-v04.json',{
 'status':'draft-not-implemented','fromChapter':'03','toChapter':'04','versions':{'from':'S03_STORY v0.5','to':'S04_STORYBOARD v0.4'},
 'timeline':{'fps':30,'cutGlobalFrame':3660,'fromLastEncodedLocalFrame':1169,'toFrameCount':1650,'overlapFrames':0,'transitionOwnership':'within04 first12frames'},
 'previousScenarioTasks':{'S03-A':'completed','S03-B':'completed','S03-C':'in-progress'},
 'incomingPlan':{'shotId':'S04-01','holdTreeSeconds':0.4,'cutToThreeWindowsAtSeconds':0.4,'researchInfo':'footnote-inside-three-windows','standaloneResearchPage':False,'scenarioRelation':'distinct-research-illustration','rules':['不重命名S03-C为研究任务','不清空03未完成任务','不额外延长全片']},
 'evidence':{'existingOld04Boundary':'arts/actions/03/provenance/story-v05/boundary-to-04-v05.json','newSeamPreviewPath':None,'verified':False},
 'openIssues':['正式新04尚未制作，旧1.6秒入口需替换','新首镜无研究页；动态图接缝尚待实测']})
dump(OUT/'boundary-to-05-v04.json',{
 'status':'draft-not-implemented','fromChapter':'04','toChapter':'05','versions':{'from':'S04_STORYBOARD v0.4','toScript':'S05_STORY_LOGIC v0.1'},
 'timeline':{'fps':30,'cutGlobalFrame':5310,'fromLastEncodedLocalFrame':1649,'toFrameCount':1350,'overlapFrames':0,'transitionOwnership':'existing-chapter-budgets'},
 'outgoingState':{'scene':'hr-workstation-with-published-job-requirements','jobId':'S04-JOB-01','status':'published-with-raised-requirements','requirementRect':[752,360,1100,216],'coordinateSpace':'1920x1080 screen pixels','requirements':['独立负责产品线','熟练调度多个Agent'],'cvRecordsRetained':4,'routineMechanism':'opening-window-thumbnails→whiteboard-excerpt→existing-requirements','stableFromSeconds':54.2,'standaloneControlCard':False,'retiredFromNewPlot':['S04-X','S03-D'],'audioPresent':False},
 'incomingPlan':{'shotId':'V05.1-E1','semanticMatch':'熟练调度多个Agent→实际调用多个Agent','rules':['组织要求与工具调用的语义衔接，不暗示HR直接布置这轮任务','CV不变成工具任务','05口播不改','不恢复独立标准控制卡'], 'requiredAdapter':'新04动态完成后，最小适配05的岗位要求／工作安排入口'},
 'evidence':{'terminalComposition':'arts/static/04/story-assets-v03/compositions/hr-4.png','newVideoLastFrame':None,'newSeamPreviewPath':None,'verified':False},
 'openIssues':['当前为构图与脚本候选，05入口尚未实测','四份简历只在04岗位页面内保留，不跨章冒充新增任务']})

(OUT/'optimization-resolutions.md').write_text('''# Claude优化采用记录

2026-10-18，用户允许在修改后调用本机Claude优化分镜。实际只调用一次，模型claude-opus-5-5，1轮、273.276秒、无工具／无web／无文件写入权限，成功返回。英文完整prompt、固定输入SHA及原始JSON同目录保留。Claude只收到文字，不称其审看过画面或给出像素验收。

采用：

1. V04.2内部重分：协作2.3秒、A／M反馈2.7秒、关系接续2.7秒。两次反馈后约0.35秒再换表情，读图从已有成果和评价逐项接入，避免2.8秒内从零铺满回路。
2. 双工位与企业图不再缩到左侧另开大图。绩效后关系带在同一协作工位下方，M侧降低视觉权重；竞争后冻结原图，负责人把乙的1个月带入排期单。同一单据留在白板角。
3. 竞争按采用→周期→份额错开约0.3秒；乙丙都采用后只做一次饼图回调。初态缩短、普及结果稳读，后段给白板与HR动作更多时间。
4. 开场执行标志→拟人Agent、成果页→产出、评价卡→组织预期、乙周期→排期单→白板、产品线职责→JD，均有可见对象承接。
5. 结尾回扣开场同套三窗绘稿和白板局部，终点是现有任职要求而非新卡片；四份简历停止累积、54.2秒后停稳，接05实际调用。

制作方调整：保持原有三行企业布局，不按模型的横排提议重做图表；现有主角绘稿仍持有成果页，因此不采纳“放到纸堆”所需的新姿态，也不虚称已有完整动画。开场缩略图是同套PNG的小视图、白板局部为可追溯构图裁切，不是新生图。第二轮采用企业乙作为排期单的说明对象，避免数字来源不明；不需要再向用户确认这一常规构图选择。

模型所列的负责人头像、失落程序员、HR鼠标态、午餐转输入态都已逐项确认在库存存在。真正的帧间书写、搬运、微推、反应延迟和新接缝留待正式动态制作；当前完成的是脚本与有限关键态构图。证据范围留于references和制作记录，画内仅保留研究资料脚注，不恢复分类角标。
''')

(ART/'README.md').write_text('''# 04 · 故事与逻辑整合构图

**版本：** S04_ART v0.4 · 2026-10-18。沿用既有20张生成PNG，本轮无新生图；完成构图和分镜修订，尚未替换55秒正式动态。

[打开检查页](http://127.0.0.1:8765/static/04/story-assets-v03/preview.html) · [当前14镜](../../../actions/04/provenance/storyboard-v04/chapter-plan.md) · [图层清单](layout.json) · [画面文字](screen-copy.json)

## 本轮修订

- 画内分类角标全部取消，真实研究资料只在三窗底部脚注出现；独立研究页退出当前导航、代码和构图清单。
- 保留五组演出：三窗、工作与绩效、企业竞争、主管白板、HR与招聘。结尾保持HR与已发布岗位，不再有独立标准页。
- 旧04的反馈、竞争传导和标准常规化解释分别嵌入后三组故事。人物与公司图不为读图而重排成新页面；绩效后工位下方接关系带，竞争后负责人接同一排期单到白板，HR结尾以已有场景缩略图连接现有要求。
- 本机Claude Opus 5.5按英文prompt完成一次文字优化；采用节奏重分、因果延迟、同物衔接和稳定版面，见[采用记录](../../../actions/04/provenance/storyboard-v04/optimization-resolutions.md)。

## 当前资源

注册28项：20张既有生成PNG、2项派生图（HR身份头像、当前白板构图局部）、6项库存。后两项新增库存引用为03负责人头像与01横向纸张，均引用原路径；所有原生成PNG与既有资产字节保持。既有英文生图prompt与原输出SHA见[生成登记](provenance/generation-register.json)，本轮没有把复用或裁切算为生图。

| 组别 | 实际绘稿／组件 |
|---|---|
| 三窗 | 午餐主角吃饭／放餐具／输入，会前同事A输入／抬眼，公司晚间同事B收包／开电脑／输入；窗始终同屏，脚注位于944–986px，字幕安全区从997px起。 |
| 工作与绩效 | 主角／Agent协作两态、格子衫程序员输入／失落两态，A／M及负责人头像独立；第三态在同一工位下方接执行能力、产出、组织预期、下轮任务，取消回指能力的箭头。 |
| 竞争 | 甲乙丙建筑PNG、Agent头像、共同市场饼图四个原状态；第五态冻结图景、突出负责人和“排期与考核／1个月”单据。没有新增分类词或实测百分比。 |
| 白板 | 无字会议室＋三张完整alpha主管姿态，旧行划除／新行改写独立，前景桌沿在人物前；同一排期单留于白板角，笔尖与字层保持遮挡。 |
| HR与招聘 | 独立HR输入／鼠标抬眼两态，同一岗位编辑／发布／CV累积；第五态以开场三窗小视图、改写后白板局部和现有任职要求解释常规化。HR与四份匿名简历在场，终点不另开页面。 |

`assets.mjs`导出ASSETS、LAYOUT、scene／root；scene输出保留独立data-layer。人物、道具、建筑为位图，界面／文字／关系为原生图形。动画应使用这些独立层，不把检查图PNG平铺成成片。当前20个1920×1080构图只是有限关键态，尚未制作完整写字、反应和搬运运动。

旧v0.3的代码、文字、布局和19个构图已保存在[修订输入快照](provenance/revision-v04/before/)。退出当前列表的研究、标准构图另存retired；不删除原20张绘稿，不覆盖旧正式视频。

## 排时与验证

当前14镜／55秒，E32.1秒、L22.9秒；A／M段从1.6秒增至2.7秒，关系说明由前序动作分段建立。研究脚注、5组导航、同一排期单和HR结尾均按本轮复查，验证与浏览器截图在[revision-v04](provenance/revision-v04/)。

```sh
node arts/static/04/story-assets-v03/build.mjs
python3 arts/actions/04/provenance/storyboard-v04/finalize.py
node arts/static/04/story-assets-v03/provenance/revision-v04/audit.mjs
```

六章口播和本章四段手稿保留。正式04／film仍是旧运行版本，171字符字幕未被这次185字符脚本覆盖；新字幕、55秒完整动态及03→04→05接缝待下一阶段落地。范围判断在脚本references留存，取消画内分类角标不把说明情境变成实测结论。
''')

p=ROOT/'arts/actions/04/README.md'; old=p.read_text(); cut=old.index('以下为**旧运行版本及历史镜头表**')
p.write_text('''# 04 · 额外贡献怎样成为正常要求？

**当前分镜与构图：** S04_STORYBOARD／S04_ART v0.4。[14镜制作单](provenance/storyboard-v04/chapter-plan.md)／[素材检查页](http://127.0.0.1:8765/static/04/story-assets-v03/preview.html)／[素材说明](../../static/04/story-assets-v03/README.md)。研究信息并入三窗脚注，移除画内制作分类角标与两个独立页面；保留旧04反馈、竞争组织传导和常规化解释，与新人物演出结合。结尾停在HR和已发布任职要求。

本机Claude Opus 5.5完成一次英文prompt优化，已采用A／M反应时长、因果延迟、同物衔接和稳定版面；[采用记录](provenance/storyboard-v04/optimization-resolutions.md)。保持14镜／55秒，复用20张生成PNG，无新生图；28项资源、20个构图关键态。原185字符口播与四段故事保留，正式字幕及04／film运行文件尚未更新。新跨章契约仍未实测。

''' + old[cut:])

entries=[
 ('scripts/PROJECT_STATE.md','PROJECT_STATE v0.41','PROJECT_STATE v0.42',
  '## 2026-10-18：04演出与旧逻辑整合（当前）\n\nS04_STORYBOARD／S04_ART v0.4移除画内分类角标、独立研究页及结尾标准页；研究信息并入三窗脚注。绩效下方恢复产出／组织预期反馈，企业竞争经同一负责人及排期单接白板，HR结尾用开场与白板缩略内容落到已发布任职要求。Claude Opus 5.5一次英文prompt优化，273.276秒／1轮，采用A／M反应2.7秒、同物衔接和原位版面；并非像素审核。仍14镜／55秒，E32.1秒、L22.9秒，20张生图原字节复用，28项注册资源、20个构图。本轮无新生图／视频／声音，04口播和四段手稿保留，正式字幕与film仍旧；新接缝未实测。[04当前入口](../arts/actions/04/README.md)。'),
 ('scripts/HANDOFF.md','HANDOFF v0.42','HANDOFF v0.43',
  '## 2026-10-18：04当前采用v0.4整合稿\n\n以04/provenance/storyboard-v04/chapter-plan.md及新排时／边界为准，素材仍在static/04/story-assets-v03，当前版本v0.4。画内取消研究／理论／情境分类角标，研究只作三窗脚注；导航仅5组，无独立研究和标准结尾。反馈在原双工位下部；竞争图冻结后负责人带1个月排期单接白板；HR用开场三窗、白板局部连到已有任职要求，54.2秒后稳定。Claude Opus 5.5单次英文优化已采用，详见optimization-resolutions；其仅审文字，像素由制作方复查。14镜55秒，E32.1／L22.9；28资源、20构图，旧20张生图不改。口播185字符、四段手稿原文保持；04／film运行版和171字符正式字幕仍旧，新55秒动画及两个接缝待制作。不要恢复分类角标、标准大字卡或S04-X主线。[当前素材说明](../arts/static/04/story-assets-v03/README.md)。'),
 ('scripts/doc/GENERATION_LOG.md','GENERATION_LOG v0.34','GENERATION_LOG v0.35',
  '## 2026-10-18：S04-ART／STORYBOARD-V04 · 去分类标记并整合旧逻辑\n\n按用户四项反馈更新原入口：研究改三窗脚注；取消画内类别词和两个独立页面；旧反馈／竞争传导／常规化解释嵌入新演出，结尾仍HR公开要求。Claude -p实际claude-opus-5-5，英文prompt、tools禁用、1轮273.276秒成功，无重试／web／文件写入；保留完整输入、原JSON与采用记录。采纳反应时间重分、原位关系带、同一排期单和已有场景缩略回扣，制作方按实际素材修正未具备的放纸堆动作。无新生图，旧20PNG字节保留，新增白板构图裁切为派生图；28资源／20构图。14镜1650帧连续，185字符口播及手写四段不改，旧运行字幕和film保留；无声音、视频或新动态接缝验收。[记录](../../arts/actions/04/provenance/storyboard-v04/optimization-resolutions.md)。')]
for rel, old_version, new_version, entry in entries:
    p=ROOT/rel; s=p.read_text().replace(old_version,new_version,1)
    heading=entry.split('\n',1)[0]
    if heading not in s:
        pos=s.index('\n## '); s=s[:pos]+'\n'+entry+'\n'+s[pos:]
    p.write_text(s)

p=ROOT/'scripts/final/shot/STORY_LOGIC_PLAN.md'; s=p.read_text().replace('| 以v0.4镜头表为准 |','| 32.1s／22.9s |'); p.write_text(s)
script=(ROOT/'scripts/final/shot/04.md').read_text(); before=(OUT/'04-before.md').read_text()
extract_audio=lambda s:s.split('<start>\n',1)[1].split('\n<end>',1)[0]
extract_story=lambda s:s.split('#### 故事场景\n',1)[1].split('#### 逻辑展示',1)[0].strip()
assert extract_audio(script)==extract_audio(before)
assert extract_story(script)==extract_story(before)
assert re.sub(r'\s','',''.join(x['text'] for x in draft['cues']))==re.sub(r'\s','',extract_audio(script))
print('Finalized14shots /1650frames /963E+687L; narration and user story preserved.')
