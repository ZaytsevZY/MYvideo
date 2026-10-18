"""One-shot text-stage packaging and verification; no runtime/media mutation."""
from pathlib import Path
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[5]
OUT = Path(__file__).resolve().parent

def read(p):
    return (ROOT / p).read_text()

def write_json(p, value):
    (OUT / p).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')

def sha(p):
    return hashlib.sha256((ROOT / p).read_bytes()).hexdigest()

def audio(s):
    return s.split('<start>\n', 1)[1].split('\n<end>', 1)[0]

def story(s):
    return s.split('#### 故事场景\n', 1)[1].split('#### 逻辑展示', 1)[0].strip()

before = (OUT / '04-user-before.md').read_text()
assert read('scripts/final/shot/04.md') == before, 'Run packaging only against the saved user input'
protected = [
    'scripts/final/shot/01.md', 'scripts/final/shot/02.md', 'scripts/final/shot/03.md',
    'scripts/final/shot/05.md', 'scripts/final/shot/06.md',
    'arts/actions/03/story-scene-v05.mjs', 'arts/actions/04/scene.mjs',
    'arts/actions/04/entry-from-03-v05.mjs', 'arts/actions/04/captions/04-narration-v01.json',
    'arts/actions/05/scene.mjs', 'arts/actions/film/scenes.mjs',
    'arts/actions/film/timeline.mjs', 'arts/actions/film/bundle-v01.json',
    'arts/actions/film/captions-v01.json', 'arts/actions/film/captions-v01.srt',
]
refs = [
    'arts/static/04/lunch-panel-v02.png', 'arts/static/04/premeeting-panel-v02.png',
    'arts/static/04/evening-panel-v02.png',
    'arts/backgrounds/shared/meeting-room-day-v01.png',
    'arts/backgrounds/shared/office-workstations-day-v01.png',
    'arts/backgrounds/03/programmer-front-desk-a-v05.png',
    'arts/backgrounds/03/neighbor-work-a-v05.png', 'arts/backgrounds/03/neighbor-work-b-v05.png',
    'arts/characters/portraits/03/coworker-a-v04.png',
    'arts/characters/portraits/03/coworker-b-v04.png',
    'arts/characters/portraits/03/manager-neutral-v04.png',
    'arts/characters/agent-model-sheet-v01.png',
    'arts/characters/poses/01/agent-offer-file-v01.png',
    'arts/characters/poses/shared/manager-assign-left-v01.png',
    'arts/actions/03/provenance/story-v05/boundary-to-04-v05.json',
]
assert all((ROOT / p).is_file() for p in protected + refs)
write_json('inputs.json', {
    'stage': 'storyboard-text-only', 'date': '2026-10-18', 'modelCalls': 0,
    'userScriptBefore': {'path': 'scripts/final/shot/04.md', 'sha256': sha('scripts/final/shot/04.md')},
    'protected': [{'path': p, 'sha256': sha(p)} for p in protected],
    'references': [{'path': p, 'sha256': sha(p)} for p in refs],
})

edges = [0, 108, 369, 468, 600, 690, 780, 915, 1074, 1155, 1236, 1350, 1485, 1545, 1650]
types = ['L', 'E', 'E', 'E', 'L', 'L', 'L', 'L', 'E', 'E', 'E', 'E', 'E', 'L']
parents = ['V04.1'] * 2 + ['V04.2'] * 2 + ['V04.3'] * 4 + ['V04.4'] * 6
titles = ['研究定位', '午餐／会前／公司晚间三窗', 'Agent协作与传统编程', '绩效A／M及表情',
          '共同市场初态', '甲先采用', '乙丙普及', '乙增加Agent再领先',
          '主管划掉3人', '改为1人', 'HR改岗位要求', '发布后简历增加', '新要求已生效', '周期／标准交05']
shots = [{'id': f'S04-{i+1:02}', 'parent': parents[i], 'type': types[i], 'title': titles[i],
          'startFrame': edges[i], 'endFrameExclusive': edges[i+1],
          'startSec': edges[i]/30, 'endSec': edges[i+1]/30} for i in range(14)]
write_json('shot-timing.json', {'version': 'S04_STORYBOARD v0.3', 'status': 'draft-not-implemented',
           'fps': 30, 'durationFrames': 1650, 'durationSec': 55, 'globalStartFrame': 3660,
           'globalEndFrameExclusive': 5310, 'shots': shots})

sentences = [
    '一家科技公司的田野研究记录到，', '部分员工主动扩大任务范围，',
    '将生成式 AI 工作延伸到午餐、会前和晚间。', '新增能力带来更多产出，', '组织预期也随之提高。',
    '竞争进一步强化这种压力：', '新方法普及后，', '原有的效率优势逐渐消退，',
    '企业仍有缩短周期、增加交付的动力。', '当更高产出进入排期和考核，',
    '额外贡献就可能转为岗位的新基准。',
    'Agent 带来的普遍生产力提升造成了工作标准的提升：', '从我能多做，到我必须做到。',
]
cue_edges = [500, 4400, 7600, 12300, 16000, 20000, 23500, 27000, 30500, 35800, 40000, 44300, 50500, 55000]
cues = [{'id': f'S04-A{i+1:02}', 'text': s, 'startMs': cue_edges[i], 'endMs': cue_edges[i+1],
         'sourceNote': '04-1' if i < 5 else '04-2' if i < 9 else '04-3'} for i, s in enumerate(sentences)]
compact = lambda s: re.sub(r'\s', '', s)
assert compact(''.join(sentences)) == compact(audio(before))
assert len(compact(audio(before))) == 185
old_cues = json.loads(read('arts/actions/04/captions/04-narration-v01.json'))
assert len(compact(''.join(c['text'] for c in old_cues))) == 171
write_json('narration-cues-draft.json', {'status': 'DRAFT-not-runtime-captions', 'version': 'S04_STORYBOARD v0.3',
           'timingBasis': 'semantic-budget-no-voice', 'source': 'scripts/final/shot/04.md',
           'nonWhitespaceCharacters': 185, 'cues': cues})

write_json('boundary-from-03-v03.json', {
    'status': 'draft-not-implemented', 'fromChapter': '03', 'toChapter': '04',
    'versions': {'from': 'S03_STORY v0.5', 'to': 'S04_STORYBOARD v0.3'},
    'timeline': {'fps': 30, 'cutGlobalFrame': 3660, 'fromLastEncodedLocalFrame': 1169,
                 'toFrameCount': 1650, 'overlapFrames': 0, 'transitionOwnership': '04 first 48 frames'},
    'outgoingState': {'graphic': 'employment-and-worktime-tree',
                      'tasks': {'S03-A': 'completed', 'S03-B': 'completed', 'S03-C': 'in-progress'}},
    'incomingPlan': {'shotId': 'S04-01', 'holdSeconds': 0.4, 'researchEntryBySeconds': 1.6,
                     'handoff': '约定工时框→独立研究定位',
                     'scenarioRelation': 'distinct-research-scenario',
                     'rules': ['S03-C不改成S03-D', '研究场景不清空03任务', '不额外延长全片']},
    'evidence': {'existingBoundary': 'arts/actions/03/provenance/story-v05/boundary-to-04-v05.json',
                 'newFromFramePath': None, 'newToFramePath': None, 'seamPreviewPath': None, 'verified': False},
    'openIssues': ['新04美术与动画尚未制作', '当前已通过的旧04入口接缝不等于新版验收', '新口播字幕待同步'],
})
write_json('boundary-to-05-v03.json', {
    'status': 'draft-not-implemented', 'fromChapter': '04', 'toChapter': '05',
    'versions': {'from': 'S04_STORYBOARD v0.3', 'toScript': 'S05_STORY_LOGIC v0.1'},
    'timeline': {'fps': 30, 'cutGlobalFrame': 5310, 'fromLastEncodedLocalFrame': 1649,
                 'toFrameCount': 1350, 'overlapFrames': 0, 'transitionOwnership': 'existing chapter budgets'},
    'outgoingState': {'scene': 'published-job-requirements→standard-control-card',
                      'objects': [{'id': 'delivery-and-acceptance-controls', 'label': '交付周期 · 验收标准',
                                   'candidateRect': [690, 672, 620, 82], 'coordinateSpace': '1920x1080 screen pixels'},
                                  {'id': 'S04-JOB-01', 'status': 'published-with-raised-requirements'}],
                      'retiredFromNewPlot': ['S04-X', 'S03-D'],
                      'previousScenarioTasks': {'S03-A': 'completed', 'S03-B': 'completed', 'S03-C': 'in-progress'},
                      'caption': '从我能多做，到我必须做到。', 'audioPresent': False},
    'incomingPlan': {'shotId': 'V05.1-E1', 'handoff': '周期／标准安排→人物派发工具任务',
                     'firstNarration': '调度多个 Agent，扩大的是执行能力，未必改变产品目标、交付周期和成果分配的决定权。',
                     'preserve': ['05原口播', '工具执行能力与组织决定权分开'],
                     'requiredAdapter': '实际新04终帧完成后，按控制项匹配05入口，不复用额外测试卡当新任务'},
    'evidence': {'fromLastFramePath': None, 'toFirstFramePath': None, 'seamPreviewPath': None, 'verified': False},
    'openIssues': ['坐标只是构图候选，未做新接缝实测', '05当前基础框架和新故事脚本分别保留'],
})

script = before.replace('S04_STORY_LOGIC v0.2 · 2026-10-18 · 故事／逻辑划分提纲，尚未改动画。口播仍为SHOT_TEXT v0.4。',
    'S04_STORYBOARD v0.3 · 2026-10-18 · 按用户手改内容细化14镜，尚未改动画；本章口播以当前185字符正文为准。')
script = script.replace('**口播预算：** 171 字符', '**口播预算：** 185 字符')
start = script.index('**当前画面需求：**')
end = script.index('#### 故事场景', start)
script = script[:start] + '''**当前画面需求：** S04_STORYBOARD v0.3。当前手稿已细化为[唯一14镜分镜表](../../../arts/actions/04/provenance/storyboard-v03/chapter-plan.md#唯一详细镜头表)，含机位、景别、动作／表情、图层、前后状态、美术缺口和03→04→05候选交接。以下四段手写故事原文保留；具体制作以镜头表为准。185字符口播已暂排，当前运行字幕仍是旧171字符版本。

父段时间按新故事重分：V04.1：0–12.3秒；V04.2：12.3–20秒；V04.3：20–35.8秒；V04.4：35.8–55秒。总55秒不变。

''' + script[end:]
start = script.index('#### 逻辑展示')
end = script.index('## description', start)
script = script[:start] + '''#### 逻辑展示

S04-01定位单一公司田野研究；S04-05至08将手稿第3项细化为一个连续的企业竞争图景；S04-14从实际岗位要求抽出周期／标准，接05。第3项虽写于故事设想内，其主要职责为比较企业周期和市场关系，因此归L，内容完整保留。

企业甲／乙／丙从同为1年，到甲率先3个月、乙丙普及，再到乙增加Agent缩至1个月。使用**一个共同市场饼图**，份额此消彼长、总和100%；企业位置和颜色始终一致，不为每家分别绘制可相加的100%市场。数值沿手稿假设，非实证统计；研究观察／考核情境／理论应用／组织情境分段换标。

#### 播放顺序与衔接

`01研究定位` → `02三窗并行` → `03–04协作／传统编程与绩效反应` → `05–08采用／普及／再竞争` → `09–10主管改白板` → `11–13HR修改、发布要求与CV增加` → `14新标准接05`。

故事32.1秒、逻辑22.9秒。03末尾树图短保持后切入独立研究情境，S03-C仍处理中；04末尾带出交付周期／验收标准，05接人物调用多个Agent，解释工具执行与组织决定权。旧S04-X额外测试不再作为新故事主线。两侧契约均为候选，见[完整制作单](../../../arts/actions/04/provenance/storyboard-v03/chapter-plan.md#排时与跨章交接)。

#### 素材准备提示

午餐初态可用现有主角绘稿；会前／晚间旧绘稿也都是主角，不能当成三位不同人物已备齐。会前需同事A坐姿，晚间需同事B在公司下班前工作，旧偏居家晚间图只作光照参考。还需Agent协作与格子衬衫程序员绩效前后态、主管划除／改写白板、独立HR正面工位和JD／CV可读界面。已有03人物身份、工位透视及01Agent优先复用，缺口与引用见[美术盘点](../../../arts/actions/04/provenance/storyboard-v03/chapter-plan.md#美术盘点与实际缺口)。本轮仅分镜，未新生图。

#### 已实现基础版对照

[基础版制作说明](../../../arts/actions/04/README.md)及全片仍采用S04 v0.2主体，加03新版树图入口适配。新14镜、185字符口播对应字幕及新美术尚未接入。本轮[13条暂排字幕](../../../arts/actions/04/provenance/storyboard-v03/narration-cues-draft.json)仅为DRAFT；动画阶段同步正式字幕后重建film，保持全片280秒，不将旧视频验收视为新分镜验收。

''' + script[end:]
script = script.replace('## 动画制作入口\n\n第04章已完成无声字幕候选，制作说明、分镜细化、当前视频及验证见[04制作说明](../../../arts/actions/04/README.md)。原口播保留，字幕暂排，待配音校时及全片接缝核查。',
'''### 新手稿的证据边界

绩效A／M、1年→3个月→1个月、3人改1人以及招聘要求提高后CV增加均为手稿指定的说明情境，不是H1实测结果。竞争机制属于C5理论应用，画面需换来源类别。末段“普遍…造成…”按用户手改逐字保留；其普遍因果强度超出H1单一公司定性观察，列入后续内容复核，不用虚构情节冒充实证支持。

## 动画制作入口

本轮以[新14镜制作单](../../../arts/actions/04/provenance/storyboard-v03/chapter-plan.md)为下一阶段入口。旧55秒无声字幕视频仍保留于[04制作说明](../../../arts/actions/04/README.md)，对应旧171字符口播；当前185字符手稿的美术、动画和正式字幕待同步。''')
(ROOT / 'scripts/final/shot/04.md').write_text(script)

p = ROOT / 'scripts/final/shot/STORY_LOGIC_PLAN.md'
s = p.read_text().replace('STORY_LOGIC_PLAN v0.3', 'STORY_LOGIC_PLAN v0.4', 1)
s = s.replace('阶段：画面剧本及并行构图修订；首批故事美术已备，尚未接入章节动画。',
              '阶段：分章推进；02／03新动态已接入全片，04新手稿已细化14镜，05／06故事演出待实现。', 1)
a = s.index('保留SHOT_TEXT')
b = s.index('## 两种画面', a)
s = s[:a] + '六章总预算仍280秒。02采用S02_STORY v0.4，03采用S03_STORY v0.5并已接film v0.3；04以用户手改口播185字符及S04_STORYBOARD v0.3的14镜为准，运行字幕仍旧171字符、基础主体待替换；05／06沿用v0.1故事需求。旧版技术检查不代表新版故事已完成。\n\n' + s[b:]
s = s.replace('| [04](04.md#video-content) | 午餐、会前、晚间的任务启动；团队接收新安排；额外测试进入真实排期和验收动作 | 研究范围、能力—产出—预期反馈、竞争传导、标准固定的抽象归纳 | 32s／23s |',
'''| [04](04.md#video-content) | 三位人物午餐／会前／公司晚间并行；Agent协作与传统编程的绩效反应；主管改人数；HR改要求、CV增加 | 研究定位；企业周期与共同市场的采用／普及／再领先；标准接05 | 32.1s／22.9s |''')
a = s.index('04的4–15秒')
b = s.index('\n\n03按用户', a)
s = s[:a] + '04的3.6–12.3秒为S04-02并行组：午餐主角／会前同事A／公司下班前同事B始终同屏，动作重音依次落在各窗；不是三个时段顺序播放，也不是同一现实瞬间。会前和晚间旧图仍是主角，尚需替换人物及公司晚间空间。完整14镜与后续绩效、竞争、白板、招聘动作见04制作单；第3项企业竞争以机制解释为主，归L。' + s[b:]
s = s.replace('额外测试被负责人勾进常规验收，最后抽出“周期／标准”；05从人物收到该安排、调度工具开始，再展开组织决定权。',
              '主管将3人改为1人、HR提高公开岗位要求后，抽出“交付周期／验收标准”；05接安排与工具调度，再展开组织决定权。新接缝待实测，不沿用旧额外测试主线。')
s += '\n04最新阶段：14镜、55秒只完成文本；新口播及手写四段保留，正式字幕和film仍旧。资产缺口与边界以[04制作单](../../../arts/actions/04/provenance/storyboard-v03/chapter-plan.md)为准，以上旧首批素材记录不能作为新动作可用性结论。\n'
p.write_text(s)

entries = [
    ('scripts/PROJECT_STATE.md', 'PROJECT_STATE v0.39', 'PROJECT_STATE v0.40',
     '## 2026-10-18：04手改剧本已细化14镜（当前分镜入口）\n\nS04_STORYBOARD v0.3按手稿保留四段故事及当前185字符口播，55秒／1650帧。三人三窗并行、Agent／传统编程绩效A／M、企业周期与共同市场竞争、主管3人改1人、HR提高要求且CV增加，接周期／标准到05。故事32.1秒、逻辑22.9秒；素材盘点明确会前和晚间旧图仍为主角、公司晚间及白板／HR等缺口。新13条字幕仅DRAFT，正式04字幕仍171字符；04／film运行文件未动，不代表新分镜已进入预览。两份新边界均未实测；无模型／美术／声音／视频调用。[04新分镜](../arts/actions/04/provenance/storyboard-v03/chapter-plan.md)。'),
    ('scripts/HANDOFF.md', 'HANDOFF v0.40', 'HANDOFF v0.41',
     '## 2026-10-18：04下一阶段按新14镜制作\n\n先读04/provenance/storyboard-v03/chapter-plan.md、shot-timing.json及两份draft边界。用户手改口播185字符、四段故事原文均保留；当前运行字幕旧171字符，新13条排时仅在provenance，不可误称已同步。三窗不同人物：主角午餐、同事A会前、同事B公司下班前；旧三图都是主角，后两窗须重绘。A／M表情、甲乙丙同一市场饼图、1年→3个月→1个月、主管白板3人改1人、HR同岗位JD变严／CV增多均按手稿；这些是说明情境，不挂研究实证标识。末句普遍因果强度待内容复核，本轮不改。先补代表构图和完整动作，再制作04、正式字幕、film及双侧接缝。旧S04-X不回新剧情，S03-C仍处理中，05正文不动。[04入口](../arts/actions/04/README.md)。'),
    ('scripts/doc/GENERATION_LOG.md', 'GENERATION_LOG v0.32', 'GENERATION_LOG v0.33',
     '## 2026-10-18：S04-STORYBOARD-V03 · 用户手稿14镜细化\n\n应用chapter-video-production及storyboard-prompt-assistant，直接编写镜头文本，外部模型／imagegen／Claude调用0，未生成素材、动画、声音或视频。保留185字符新口播与四段故事，55秒／14镜，E32.1秒、L22.9秒；三窗角色、绩效表情、共同市场周期变化、白板与HR动作均写清。核对H1官方研究介绍和C5原文，将虚构情境与单一公司观察分开；强因果末句仅登记复核。新13字幕DRAFT与两份未验收边界不写入runtime。保存输入快照、源SHA及文字／1650帧连续排时检查；03／04／05与film运行文件及正式字幕保留。[完整记录](../../arts/actions/04/provenance/storyboard-v03/chapter-plan.md)。'),
]
for path, old, new, entry in entries:
    p = ROOT / path
    s = p.read_text().replace(old, new, 1)
    pos = s.index('\n## ')
    p.write_text(s[:pos] + '\n' + entry + '\n' + s[pos:])

p = ROOT / 'arts/actions/04/README.md'
s = p.read_text()
pos = s.index('\n\n')
s = s[:pos] + '''

**当前新分镜：** S04_STORYBOARD v0.3，[14镜详细表](provenance/storyboard-v03/chapter-plan.md)／[排时](provenance/storyboard-v03/shot-timing.json)。用户手改口播现185字符，四段故事原文保留；三人三窗、绩效A／M、企业竞争、主管改人数与HR改要求均已细化。本轮只有文字，缺失美术与接缝列入制作单。正式字幕仍旧171字符，新13条仅DRAFT，当前预览／视频尚未体现新分镜。

以下为**旧运行版本及历史镜头表**；若与新制作单冲突，以新制作单为后续制作入口。
''' + s[pos:]
s = s.replace('## 唯一镜头细化表', '## 旧基础版镜头表（历史实现）', 1)
p.write_text(s)

after = read('scripts/final/shot/04.md')
assert audio(after) == audio(before)
assert story(after) == story(before)
assert all(sha(x['path']) == x['sha256'] for x in json.loads((OUT/'inputs.json').read_text())['protected'])
assert sum(x['endFrameExclusive']-x['startFrame'] for x in shots) == 1650
assert sum(x['endFrameExclusive']-x['startFrame'] for x in shots if x['type'] == 'E') == 963
assert all(shots[i]['endFrameExclusive'] == shots[i+1]['startFrame'] for i in range(13))
assert all(c['startMs'] < c['endMs'] for c in cues)
assert all(cues[i]['endMs'] == cues[i+1]['startMs'] for i in range(12))
assert after.split('### [04-1]',1)[1].split('### 新手稿的证据边界',1)[0].strip() == before.split('### [04-1]',1)[1].split('## 动画制作入口',1)[0].strip()
write_json('verification.json', {'stage': 'text-only', 'checks': {
    'userNarrationBytePreserved': True, 'fourUserStoryParagraphsBytePreserved': True,
    'existingReferencesPreserved': True, 'narrationCharacters': 185, 'runtimeCaptionCharacters': 171,
    'draftCaptionsMatchNarration': True, 'shots': 14, 'continuousFrames': 1650,
    'storyFrames': 963, 'logicFrames': 687, 'protectedFilesUnchanged': len(protected),
    'referenceFilesRegistered': len(refs), 'newBoundariesVerified': False,
    'mediaOrBrowserQAApplicable': False},
    'command': 'python3 arts/actions/04/provenance/storyboard-v03/prepare.py',
    'limitations': ['No new images, runtime, film build, voice, or video', 'Draft subtitle timing requires voiced timing later']})
outputs = ['scripts/final/shot/04.md', 'scripts/final/shot/STORY_LOGIC_PLAN.md',
           'scripts/PROJECT_STATE.md', 'scripts/HANDOFF.md', 'scripts/doc/GENERATION_LOG.md', 'arts/actions/04/README.md']
outputs += [str(p.relative_to(ROOT)) for p in OUT.iterdir() if p.is_file() and p.name != 'outputs.json']
write_json('outputs.json', [{'path': p, 'sha256': sha(p)} for p in sorted(outputs)])
print('PASS: 14 shots, 1650 continuous frames; original narration/story/references and runtime guards preserved.')
