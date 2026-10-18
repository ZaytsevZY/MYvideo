"""Apply the user's parallel-scene direction to the canonical script and skill."""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
def change(rel,old,new):
 p=ROOT/rel; t=p.read_text(); assert old in t,(rel,old[:70]); p.write_text(t.replace(old,new,1))
for n in ('03','04'):
 p=f'scripts/final/shot/{n}.md'
 text=(ROOT/p).read_text().replace(f'S{n}_STORY_LOGIC v0.1',f'S{n}_STORY_LOGIC v0.2')
 (ROOT/p).write_text(text)
change('scripts/final/shot/03.md','负责人走到桌边或在团队排期页加入S03-C；程序员看向新安排，原先离席动作停下，回到桌前确认任务。实际组织互动为主画面。','主画面保留程序员准备离席的动作，负责人递交任务／加入S03-C的行动置于独立故事小窗。小窗先发生排期，主画面人物随后注意到，离席动作停下并回桌前确认；两层并行保留。')
change('scripts/final/shot/03.md','即时响应方案：程序员拿起水杯准备休息，结果通知到来；他放杯查看，刚恢复休息又被下一次通知打断。通知、转头、手回鼠标和再次收手形成动作链。','即时响应方案：主画面是程序员在公司工位伏桌短暂睡眠；右上结果通知小窗入场，人物醒来、抬头并把手伸回鼠标。通知与人物反应并行呈现，人物为叙述中心；不切成先全屏通知再全屏人物。')
change('scripts/final/shot/03.md','回到同一起点，切换为允许次日集中验收的方案：待验收结果进入次日收件位置，程序员能把杯子拿起或继续阅读，后台仍运行。画面以人物持续完成休息动作为中心。','回到同一起点，切换为允许次日集中验收的方案：待验收结果进入次日收件位置，程序员继续休息／阅读，后台仍运行。待办可以保留在次要小窗，不唤醒人物；用主画面的连续休息表达不同安排。')
change('scripts/final/shot/03.md','可复用工位与查看／起身／休息姿态；待补拿杯、放杯、回头看通知、持书，以及负责人到桌边、双方指向排期的完整绘稿。','已备公司工位、同机位伏桌睡眠／醒来主画面、结果通知窗、负责人递交／指向排期完整姿态，见[后续故事素材](../../../arts/static/story-assets-v01/README.md)。待补正式离席／接收动作、持续休息／持书与协商的前后完整姿态；现有静态关键绘稿不算动作已完成。')
change('scripts/final/shot/04.md','午餐、会前、晚间必须各自成为人物在具体空间中的主画面场景；后半章再演出团队接收新安排、额外测试从自选进入排期与常规验收。不是三个时间框或三张带头像的示意卡。','午餐、会前、晚间采用并行三画幅：同屏保留三个有完整环境、人物和动作的故事场景；不按时段顺序切满屏。它们是三个时段的并置，不宣称现实中同时发生。后半章再演出团队接收新安排、额外测试进入排期与验收。')
p=ROOT/'scripts/final/shot/04.md'; t=p.read_text(); start=t.index('| V04.1-E1 |'); end=t.index('| V04.2-E1 |',start)
t=t[:start]+'''| V04.1-E1 | 4–15 | 部分员工主动扩大任务范围；午餐、会前和晚间 | 三个故事画幅从4秒起同时在场：A午餐，餐具停在半途、手转向电脑发出补充测试；B会前，等候时发任务、同事入场后抬头；C晚间，本欲合上电脑又打开、手回键盘。各窗独立显示Agent任务开始／执行状态；动作重音可按口播依次出现，但其他窗不退出。 | 同一个并行场景组，不把三窗各记11秒后叠加预算。各窗任务S04-lunch／premeeting／evening仅为道具映射，不冒充同一真实受访者一天。研究主题的卡通说明情境。[04-1] |
'''+t[end:]
t=t.replace('`V04.1-L1` → `V04.1-E1` → `V04.1-E2` → `V04.1-E3`','`V04.1-L1` → `V04.1-E1（A／B／C三画幅并行）`')
t=t.replace('03排期页→研究定位→三个生活／工作间隙场景','03排期页→研究定位→三个生活／工作间隙场景的并行组')
t=t.replace('从夜间新完成的交付页抽出','从三画幅中一个新完成的交付页抽出')
t=t.replace('必须评估餐桌／用餐人物、会议室等候／抬头、夜间开合电脑、团队排期与三轮交接／验收的背景和完整姿态。现有工位小窗不足以替代这些主场景。研究定位和机制图尽量复用现有矢量组件。','已备三张独立2:3故事绘稿（午餐／会前／晚间）、会议室／公司工位、负责人／同事姿态及1920×1080三联布局，见[后续故事素材](../../../arts/static/story-assets-v01/README.md)。三窗均是场景，非三个图解标签框。正式动画仍需各窗动作前后帧、团队排期与三轮交接／验收；研究定位和机制图尽量复用现有矢量组件。')
p.write_text(t)
change('scripts/final/shot/02.md','以方案B为说明情境：负责人把两项追加需求放入实际项目排期，程序员看完后重新转向电脑，Agent接收新任务。不是工具自己决定增量。','以方案B为说明情境：主画面保留程序员准备收手／离席，负责人把两项追加需求放入排期的行动在独立小窗并行显示；先递交再引出主画面人物注意、重新转向电脑与Agent接收任务。不是工具自己决定增量。')
change('scripts/final/shot/02.md','优先复用日间工位、头像、任务纸及完整查看／收手姿态；待补负责人递交排期、程序员翻看候选页与连续审核的完整姿态和越肩构图。','已备公司工位、负责人递交任务姿态、搁置需求列表／打开两态UI及追加任务小窗，见[后续故事素材](../../../arts/static/story-assets-v01/README.md)。沿用01反馈候选身份、原头像和任务纸；待补程序员越肩打开需求、正式接收排期与连续审核的完整动作，不将03困倦反应直接当02终稿。')
change('scripts/final/shot/STORY_LOGIC_PLAN.md','STORY_LOGIC_PLAN v0.1','STORY_LOGIC_PLAN v0.2')
change('scripts/final/shot/STORY_LOGIC_PLAN.md','阶段：画面剧本修订，待细化机位和美术；尚未接入动画。','阶段：画面剧本及并行构图修订；首批故事美术已备，尚未接入章节动画。')
change('scripts/final/shot/STORY_LOGIC_PLAN.md','各章 `SNN_STORY_LOGIC v0.1`','各章video content（03／04为v0.2，02／05／06沿用v0.1）')
change('scripts/final/shot/STORY_LOGIC_PLAN.md','头像搬运文件、节点反馈、时间带和任务数量比较属于此类；加了人物小窗仍是逻辑展示。','头像搬运文件、节点反馈、时间带和任务数量比较属于此类；图解旁的装饰人物小窗不改变主叙述职责。人物在真实空间里行动、主副窗共同表现触发与反应，或三个人物场景并置时，仍可属于E；不能按窗口尺寸判定E／L。')
p=ROOT/'scripts/final/shot/STORY_LOGIC_PLAN.md'; t=p.read_text(); start=t.index('## 04必须改成场景的段落'); end=t.index('## 故事与逻辑如何交接',start)
t=t[:start]+'''## 04三画幅并行场景与03主副窗

04的4–15秒合为V04.1-E1并行场景组：午餐／会前／晚间三个实际故事画幅始终同屏，分别表现用餐转向电脑、等候时开任务、晚间重新打开电脑。动作重音可随口播依次落在一窗，其他两窗仍在场；不是三次顺序切换，也不是现实同一时刻。每窗有可见空间、人物与接触动作，Agent状态层贴近该窗，不用三个标题框／头像替代场景。

03通知打断休息采用主画面程序员伏桌睡眠→醒来，右上通知窗独立入场；公司工作日内短暂休息的说明情境不推成普遍夜间待命。02／03负责人追加任务也可用行动小窗与程序员主画面并行，先递交／排期、再引发注意与接收，保留因果延迟。窗口并行不要求所有动作同时启动。

首批[故事美术与代表构图](../../../arts/static/story-assets-v01/README.md)已备；这些仍是研究主题的卡通说明情境，不是受访者、真实访谈或逐字事件复原。必要单一公司限定在正式入场保留一次，避免重复解释段落。

'''+t[end:]
t=t.replace('本轮只完成分类与情境提纲，没有生成新美术、改动画、重排已有字幕或导出视频。','分类阶段v0.1仅有文字；本轮v0.2已准备首批10张采用绘稿、4种可编辑UI及代表构图，未改章节动画、重排已有字幕或导出视频。')
p.write_text(t)
change('skills/chapter-video-production/SKILL.md','version: "0.2"','version: "0.3"')
change('skills/chapter-video-production/SKILL.md','头像搬运或图表旁的小窗仍算L，不能据此宣称已完成故事场景。','头像搬运或图表旁的装饰小窗仍算L；具体人物场景的并行分窗、主画面反应＋通知／组织行动小窗可以是E。按主叙述职责判断，不按窗口大小判断。')
change('skills/chapter-video-production/SKILL.md','- 景别、角度、景深为信息和动作服务。','- 并行构图先按整幅定主次、视线与因果：通知小窗先触发，主画面人物随后反应；午餐／会前／晚间按当前用户要求三窗同屏，各窗独立行动，动作重音可依次推进。分窗不是三个时间轴时长相加，亦不暗示三个时段现实同时发生。\n- 景别、角度、景深为信息和动作服务。')
change('skills/chapter-video-production/SKILL.md','跨章复用资源引用原路径及哈希，不重复生成或悄悄修改原图。','跨章共用新资源可放对应shared目录，注册章节用途；已有资源引用原路径及哈希，不为“移到后章”破坏旧引用、重复生成或悄悄修改原图。')
change('skills/chapter-video-production/references/workflow.md','在图表旁加头像或工位小窗不算E。','在图表旁加装饰头像或工位小窗不算E；真实人物场景并行组、人物主画面＋通知／负责人行动小窗可为E，按叙述职责判断。先定并行结构再决定生图比例；三窗用独立竖幅，主反应配通知用横幅留空区。')
change('skills/chapter-video-production/references/workflow.md','主要动作后留收势和读图时间，小窗解释当前主图，不抢独立剧情。','主要动作后留收势和读图时间。逻辑段小窗解释主图；故事段可按剧本安排并行场景或触发／反应小窗，维持明确主次，不强制改回顺序播放。')
change('scripts/style/STYLE_BIBLE.md','STYLE_BIBLE v0.12','STYLE_BIBLE v0.13')
change('scripts/style/STYLE_BIBLE.md','人物／环境／动作成为主画面；头像搬运、节点图和带工位小窗的图解仍属逻辑展示L。','人物／环境／动作承担主叙述；并行三场景或主反应＋通知／组织行动小窗可为E。头像搬运、节点图和带装饰工位小窗的图解仍属逻辑展示L，不能仅按窗口尺寸分类。')
change('scripts/style/STYLE_BIBLE.md','本轮是画面文本修订；原280秒基础预览、素材与字体色板未改，新E场景尚未制备或验收。','已按用户本轮要求准备公司工位、会议室、负责人／同事姿态、睡眠／醒来及午餐／会前／晚间三张独立绘稿，见[故事资源](../../arts/static/story-assets-v01/README.md)。04采用三画幅并行，03采用主醒来＋通知窗；原280秒基础演出未改，新E动画尚未完成。')
change('scripts/style/ART_DIRECTION.md','ART_DIRECTION v0.10','ART_DIRECTION v0.11')
change('scripts/style/ART_DIRECTION.md','本轮仅重划文本并列美术缺口，尚未生成新增空间、完整人物姿态或更新动画。','本轮已生成首批故事资源，见[素材与构图](../../arts/static/story-assets-v01/README.md)。04午餐／会前／晚间同屏并行，03睡眠／醒来为主画面、通知为小窗，负责人追加任务也可并行显示；窗口大小不决定E／L。新增绘稿已做代表构图，章节动画尚未更新。')
change('scripts/final/shot/README.md','STORY_LOGIC_PLAN v0.1','STORY_LOGIC_PLAN v0.2')
change('scripts/final/shot/README.md','故事场景、美术与新演出尚未实现','首批[故事美术及并行构图](../../../arts/static/story-assets-v01/README.md)已准备，新章节演出尚未接入')
change('arts/actions/film/README.md','**剧本与实现状态：** 02–06已在[STORY_LOGIC_PLAN v0.1](../../../scripts/final/shot/STORY_LOGIC_PLAN.md)重划故事／逻辑职责，尚未制备新故事场景。本页播放器继续展示此前基础实现，新提纲不能据此记为已实现。','**剧本与实现状态：** 02–06已在[STORY_LOGIC_PLAN v0.2](../../../scripts/final/shot/STORY_LOGIC_PLAN.md)重划职责。新[故事美术／并行构图](../../static/story-assets-v01/README.md)及[构图检查页](http://127.0.0.1:8765/static/story-assets-v01/preview.html)已备，尚未接入章节演出。本页播放器继续展示此前基础实现。')
print('Updated canonical story composition rules and asset entry points')
