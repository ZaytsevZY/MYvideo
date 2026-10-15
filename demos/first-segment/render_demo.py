#!/usr/bin/env python3
"""Render the first-segment demo as RGB frames for ffmpeg stdin."""

from __future__ import annotations

import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


WIDTH, HEIGHT, FPS = 1920, 1080, 30
DURATION = 39.1575
FRAMES = math.ceil(DURATION * FPS)

ROOT = Path(__file__).resolve().parents[2]
FONT_PATH = "/System/Library/Fonts/Hiragino Sans GB.ttc"

BG = "#090D12"
PANEL = "#111821"
PANEL_2 = "#151F2A"
TEXT = "#F4F1E8"
MUTED = "#9DAABC"
CYAN = "#5ED8FF"
GREEN = "#6CE5B1"
CORAL = "#FF6B6B"
AMBER = "#FFB95D"
GRID = "#18222E"

FONT_CACHE: dict[tuple[int, int], ImageFont.FreeTypeFont] = {}


def font(size: int, index: int = 0) -> ImageFont.FreeTypeFont:
    key = (size, index)
    if key not in FONT_CACHE:
        FONT_CACHE[key] = ImageFont.truetype(FONT_PATH, size=size, index=index)
    return FONT_CACHE[key]


def clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return max(low, min(high, value))


def ease(value: float) -> float:
    value = clamp(value)
    return value * value * (3.0 - 2.0 * value)


def span(t: float, start: float, end: float) -> float:
    return ease((t - start) / max(0.001, end - start))


def alpha_color(hex_color: str, alpha: int) -> tuple[int, int, int, int]:
    value = hex_color.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4)) + (alpha,)


def rounded(draw: ImageDraw.ImageDraw, box, radius: int, fill, outline=None, width: int = 1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def centered(draw: ImageDraw.ImageDraw, xy, text: str, fnt, fill=TEXT, anchor="mm"):
    draw.text(xy, text, font=fnt, fill=fill, anchor=anchor)


def wrap_text(draw: ImageDraw.ImageDraw, text: str, fnt, max_width: int) -> list[str]:
    lines: list[str] = []
    current = ""
    for char in text:
        candidate = current + char
        if draw.textlength(candidate, font=fnt) <= max_width or not current:
            current = candidate
        else:
            lines.append(current)
            current = char
    if current:
        lines.append(current)
    return lines


SUBTITLES = [
    (0.00, 2.19, "一名程序员准备睡觉。"),
    (2.19, 8.38, "他没有继续熬夜修代码，而是给 Agent 下了几条指令，"),
    (8.38, 12.04, "让它写代码、跑测试、整理结果。"),
    (12.04, 16.86, "然后关掉屏幕，去睡了。第二天早上，任务完成了。"),
    (16.86, 22.22, "过去可能需要一整晚的工作，现在只需要一段指令和第二天的审核。"),
    (22.22, 23.52, "这是真实的进步。"),
    (23.52, 29.30, "但他打开电脑，待办列表没有变短。既然开发这么方便，"),
    (29.30, 35.29, "为什么不顺手再补几个测试、优化一下界面，把上周推掉的需求也排进来？"),
    (35.29, 39.158, "机器做完了原来的工作。但什么叫“工作做完了”，可能也在悄悄改变。"),
]


def draw_background(draw: ImageDraw.ImageDraw, t: float):
    draw.rectangle((0, 0, WIDTH, HEIGHT), fill=BG)
    offset = int((t * 8) % 80)
    for x in range(-80 + offset, WIDTH + 80, 80):
        draw.line((x, 0, x, HEIGHT), fill=GRID, width=1)
    for y in range(-80 + offset, HEIGHT + 80, 80):
        draw.line((0, y, WIDTH, y), fill=GRID, width=1)
    draw.rectangle((0, 0, WIDTH, 90), fill="#0C1219")
    draw.text((74, 44), "当效率成为义务", font=font(30), fill=TEXT, anchor="lm")
    draw.text((WIDTH - 74, 44), "01  /  开场", font=font(22), fill=MUTED, anchor="rm")
    draw.rectangle((74, 80, WIDTH - 74, 84), fill="#1C2A37")
    draw.rectangle((74, 80, 74 + int((WIDTH - 148) * clamp(t / DURATION)), 84), fill=CYAN)


def draw_desk_scene(draw: ImageDraw.ImageDraw, t: float):
    fade = 1.0 - span(t, 3.5, 4.4)
    if fade <= 0:
        return
    a = int(255 * fade)
    centered(draw, (960, 160), "23:47", font(76), alpha_color(TEXT, a))
    draw.text((960, 220), "夜间 · 工作台", font=font(25), fill=alpha_color(MUTED, a), anchor="ma")
    draw.rounded_rectangle((610, 360, 1310, 760), radius=24, fill=alpha_color(PANEL, a), outline=alpha_color("#2B3B4D", a), width=3)
    draw.rectangle((685, 430, 1235, 685), fill=alpha_color("#0C141D", a))
    draw.rectangle((765, 505, 1120, 515), fill=alpha_color(CYAN, a))
    draw.rectangle((765, 545, 1040, 555), fill=alpha_color(MUTED, a))
    draw.rectangle((765, 585, 1160, 595), fill=alpha_color(MUTED, a))
    draw.ellipse((345, 420, 465, 540), outline=alpha_color(TEXT, a), width=6)
    draw.line((405, 540, 405, 725), fill=alpha_color(TEXT, a), width=7)
    draw.line((405, 600, 525, 685), fill=alpha_color(TEXT, a), width=7)
    draw.line((405, 600, 315, 695), fill=alpha_color(TEXT, a), width=7)
    draw.arc((1500, 220, 1640, 360), 60, 300, fill=alpha_color(AMBER, a), width=14)


def draw_task_network(draw: ImageDraw.ImageDraw, t: float):
    if t < 3.6 or t > 22.4:
        return
    scene_in = span(t, 3.6, 4.5)
    scene_out = 1.0 - span(t, 21.7, 22.4)
    a = int(255 * scene_in * scene_out)
    human_x = 270 - int(280 * span(t, 11.8, 14.8))
    draw.ellipse((human_x - 55, 400, human_x + 55, 510), outline=alpha_color(TEXT, a), width=6)
    draw.line((human_x, 510, human_x, 690), fill=alpha_color(TEXT, a), width=7)
    rounded(draw, (380, 355, 790, 560), 22, alpha_color(PANEL, a), alpha_color("#2B3B4D", a), 3)
    draw.text((420, 405), "> 交给 Agent", font=font(30), fill=alpha_color(CYAN, a))
    draw.text((420, 465), "完成代码、测试与报告", font=font(30), fill=alpha_color(TEXT, a))

    line_progress = span(t, 4.3, 7.0)
    start_x, end_x, y = 790, 960, 458
    draw.line((start_x, y, start_x + int((end_x - start_x) * line_progress), y), fill=alpha_color(CYAN, a), width=6)
    pulse = 10 + int(5 * math.sin(t * 5))
    draw.ellipse((960 - 86 - pulse, 458 - 86 - pulse, 960 + 86 + pulse, 458 + 86 + pulse), outline=alpha_color(CYAN, max(50, a // 2)), width=3)
    draw.ellipse((874, 372, 1046, 544), fill=alpha_color("#132635", a), outline=alpha_color(CYAN, a), width=5)
    centered(draw, (960, 445), "AGENT", font(31), alpha_color(TEXT, a))
    centered(draw, (960, 485), "运行中", font(22), alpha_color(CYAN, a))

    tasks = [("写代码", 315), ("跑测试", 500), ("整理结果", 685)]
    for idx, (label, ty) in enumerate(tasks):
        progress = span(t, 6.2 + idx * 0.7, 9.0 + idx * 0.7)
        done = span(t, 14.5 + idx * 0.75, 16.4 + idx * 0.75)
        x1 = 1046
        x2 = 1215
        draw.line((x1, 458, x1 + int((x2 - x1) * progress), int(458 + (ty - 458) * progress)), fill=alpha_color(CYAN, a), width=5)
        card_x = 1215 + int(35 * (1.0 - progress))
        rounded(draw, (card_x, ty - 58, card_x + 390, ty + 58), 18, alpha_color(PANEL_2, int(a * progress)), alpha_color(GREEN if done > 0.5 else CYAN, int(a * progress)), 3)
        draw.text((card_x + 34, ty), label, font=font(31), fill=alpha_color(TEXT, int(a * progress)), anchor="lm")
        status = "完成" if done > 0.5 else f"{int(clamp((t - 7 - idx) / 7) * 100):02d}%"
        draw.text((card_x + 350, ty), status, font=font(24), fill=alpha_color(GREEN if done > 0.5 else CYAN, int(a * progress)), anchor="rm")
    if t >= 16.8:
        morning = span(t, 16.8, 18.7)
        centered(draw, (960, 820), "07:30  ·  TASK COMPLETE", font(34), alpha_color(GREEN, int(255 * morning * scene_out)))


def draw_progress_statement(draw: ImageDraw.ImageDraw, t: float):
    if t < 21.8 or t > 25.0:
        return
    a = int(255 * min(span(t, 21.8, 22.4), 1.0 - span(t, 24.2, 25.0)))
    centered(draw, (960, 440), "这是真实的进步。", font(78), alpha_color(TEXT, a))
    draw.rectangle((690, 535, 1230, 541), fill=alpha_color(GREEN, a))
    centered(draw, (960, 600), "更少的直接操作  /  同样的任务完成", font(28), alpha_color(MUTED, a))


def draw_todo_scene(draw: ImageDraw.ImageDraw, t: float):
    if t < 24.0:
        return
    a = int(255 * span(t, 24.0, 25.0))
    panel = (430, 205, 1490, 785)
    rounded(draw, panel, 28, alpha_color(PANEL, a), alpha_color("#2B3B4D", a), 3)
    draw.text((490, 270), "TODAY", font=font(28), fill=alpha_color(MUTED, a))
    base_count = 3
    add_steps = [span(t, 27.0, 28.0), span(t, 29.5, 30.5), span(t, 32.0, 33.0)]
    count = base_count + sum(1 for p in add_steps if p > 0.5)
    draw.text((1430, 270), f"{count} TASKS", font=font(28), fill=alpha_color(CORAL if count > 3 else CYAN, a), anchor="ra")
    labels = [
        ("修复原问题", GREEN, 1.0),
        ("提交运行结果", GREEN, 1.0),
        ("完成次日审核", CYAN, 1.0),
        ("补几个测试", CORAL, add_steps[0]),
        ("优化一下界面", CORAL, add_steps[1]),
        ("排入上周需求", CORAL, add_steps[2]),
    ]
    for idx, (label, color, visible) in enumerate(labels):
        if visible <= 0:
            continue
        y = 350 + idx * 66
        slide = int((1.0 - visible) * 110)
        rounded(draw, (495 + slide, y, 1425 + slide, y + 48), 13, alpha_color(PANEL_2, int(a * visible)), None)
        draw.ellipse((520 + slide, y + 14, 540 + slide, y + 34), fill=alpha_color(color, int(a * visible)))
        draw.text((565 + slide, y + 24), label, font=font(27), fill=alpha_color(TEXT, int(a * visible)), anchor="lm")
        if idx < 2:
            draw.text((1380 + slide, y + 24), "✓", font=font(24), fill=alpha_color(GREEN, int(a * visible)), anchor="rm")
    if t > 27:
        meter = span(t, 27, 34)
        draw.rectangle((430, 820, 1490, 832), fill=alpha_color("#243343", a))
        draw.rectangle((430, 820, 430 + int(1060 * meter), 832), fill=alpha_color(CORAL, a))
        centered(draw, (960, 875), "完成更快  →  可做任务的边界继续外移", font(30), alpha_color(MUTED, a))


def draw_final_question(draw: ImageDraw.ImageDraw, t: float):
    if t < 35.1:
        return
    p = span(t, 35.1, 36.0)
    cover = int(245 * p)
    draw.rectangle((0, 90, WIDTH, 930), fill=alpha_color(BG, cover))
    centered(draw, (960, 390), "机器做完了任务", font(46), alpha_color(MUTED, int(255 * p)))
    centered(draw, (960, 520), "工作就做完了吗？", font(86), alpha_color(TEXT, int(255 * p)))
    line_w = int(720 * span(t, 36.0, 38.0))
    draw.rectangle((960 - line_w // 2, 625, 960 + line_w // 2, 632), fill=alpha_color(CORAL, int(255 * p)))
    centered(draw, (960, 700), "完成标准，正在移动。", font(34), alpha_color(CORAL, int(255 * span(t, 36.5, 37.5))))


def draw_subtitle(draw: ImageDraw.ImageDraw, t: float):
    text = ""
    for start, end, value in SUBTITLES:
        if start <= t < end:
            text = value
            break
    if not text:
        return
    box = (170, 915, 1750, 1050)
    rounded(draw, box, 22, "#06090DD9", "#263545", 2)
    lines = wrap_text(draw, text, font(34), 1450)[:2]
    line_h = 48
    start_y = 982 - (len(lines) - 1) * line_h / 2
    for idx, line in enumerate(lines):
        centered(draw, (960, start_y + idx * line_h), line, font(34), TEXT)


def render_frame(t: float) -> Image.Image:
    image = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(image, "RGBA")
    draw_background(draw, t)
    draw_desk_scene(draw, t)
    draw_task_network(draw, t)
    draw_progress_statement(draw, t)
    draw_todo_scene(draw, t)
    draw_final_question(draw, t)
    draw_subtitle(draw, t)
    return image


def main() -> None:
    output = sys.stdout.buffer
    for frame_index in range(FRAMES):
        frame = render_frame(frame_index / FPS)
        output.write(frame.tobytes())


if __name__ == "__main__":
    main()

