#!/usr/bin/env python3
"""
Skill Vetter - 音频生成脚本
Version B（场景派）
"""

import subprocess
import json
import os
from pathlib import Path

# 音频输出目录
OUTPUT_DIR = Path(__file__).parent / "task-audio"
OUTPUT_DIR.mkdir(exist_ok=True)

# 音频时长记录
durations = {}

# 场景列表（Version B - 场景派）
SCENES = [
    {
        "id": "scene_001",
        "text": "每天一个 Skill，今天给你介绍一个能保护你的工具，Skill Vetter"
    },
    {
        "id": "scene_002",
        "text": "场景一，从 ClawHub 安装技能。看到一个新技能，想试试？先别急着安装，用 Skill Vetter 审查一遍"
    },
    {
        "id": "scene_003",
        "text": "场景二，从 GitHub 安装开源技能。看到作者写的很好，想用？等等，先检查代码。Skill Vetter 会帮你找出红旗"
    },
    {
        "id": "scene_004",
        "text": "场景三，朋友分享了一个技能。说很好用，推荐给你？别盲目信任，用 Skill Vetter 自己审查一遍"
    },
    {
        "id": "scene_005",
        "text": "场景四，企业内部技能管理。需要确保技能安全合规？Skill Vetter 可以帮你，生成标准化的审查报告"
    },
    {
        "id": "scene_006",
        "text": "总结一下，四大使用场景：ClawHub 安装、GitHub 开源、他人分享、企业合规。一个工具，全搞定"
    },
    {
        "id": "scene_007",
        "text": "审查流程很简单：来源检查、代码审查、权限评估、风险分类，最后生成报告"
    },
    {
        "id": "scene_008",
        "text": "风险等级一目了然：绿色直接装，黄色需要看，红色要人工，极红不要装"
    },
    {
        "id": "scene_009",
        "text": "使用超简单，clawhub install skill-vetter。一秒安装，立即使用，安全审查，从现在开始"
    },
    {
        "id": "scene_010",
        "text": "点赞收藏，关注我，每天一个 OpenClaw Skill，明天见"
    }
]

def generate_audio(scene_id: str, text: str, voice: str = "zh-CN-XiaoxiaoNeural", rate: str = "+10%"):
    """生成单个音频文件"""
    output_file = OUTPUT_DIR / f"{scene_id}.wav"
    
    cmd = [
        "edge-tts",
        "--voice", voice,
        "--text", text,
        "--rate", rate,
        "--write-media", str(output_file)
    ]
    
    print(f"生成音频: {scene_id}")
    subprocess.run(cmd, check=True, capture_output=True)
    
    # 获取音频时长（使用 ffprobe）
    duration_cmd = [
        "ffprobe",
        "-i", str(output_file),
        "-show_entries", "format=duration",
        "-v", "quiet",
        "-of", "json"
    ]
    
    result = subprocess.run(duration_cmd, capture_output=True, text=True, check=True)
    duration_data = json.loads(result.stdout)
    duration = float(duration_data["format"]["duration"])
    
    print(f"  ✓ 时长: {duration:.2f}s")
    
    return duration

def main():
    print("=" * 50)
    print("Skill Vetter - 音频生成")
    print("Version B（场景派）")
    print("=" * 50)
    print()
    
    # 生成所有场景音频
    for scene in SCENES:
        duration = generate_audio(scene["id"], scene["text"])
        durations[scene["id"]] = {
            "duration": round(duration, 2)
        }
    
    # 保存时长记录
    durations_file = Path(__file__).parent / "audio-durations.json"
    with open(durations_file, "w", encoding="utf-8") as f:
        json.dump(durations, f, indent=2, ensure_ascii=False)
    
    print()
    print("=" * 50)
    print("✅ 音频生成完成！")
    print(f"总场景数: {len(SCENES)}")
    print(f"总时长: {sum(d['duration'] for d in durations.values()):.2f}s")
    print(f"时长记录: {durations_file}")
    print("=" * 50)

if __name__ == "__main__":
    main()
