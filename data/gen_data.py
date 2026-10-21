# -*- coding: utf-8 -*-
"""把 data/jobs.json 编译成 docs/data.js（window.JOBS_DATA）。

改完 data/jobs.json 后重跑本脚本即可：
    python data/gen_data.py
"""
import json
import os
import datetime

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(BASE, "data", "jobs.json")
OUT = os.path.join(BASE, "docs", "data.js")


def main():
    with open(SRC, "r", encoding="utf-8") as f:
        jobs = json.load(f)

    # 按分类稳定排序，浏览体验更一致
    cat_order = {"正式职业": 0, "新职业": 1, "小众工作": 2, "平台化项目制": 3}
    jobs.sort(key=lambda j: (cat_order.get(j.get("category"), 9), j.get("name", "")))

    stamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    lines = [
        "// 本文件由 data/gen_data.py 自动生成，请勿手改；改 data/jobs.json 后重跑脚本。",
        "// 生成时间: %s" % stamp,
        "window.JOBS_DATA = %s;" % json.dumps(jobs, ensure_ascii=False, indent=2),
    ]
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print("generated docs/data.js with %d jobs" % len(jobs))


if __name__ == "__main__":
    main()
