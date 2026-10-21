# 工作百科 jobs-wiki

一个**非盈利、纯科普**的工作信息展示网站：把人们正在从事的各种工作（正式职业、新职业、小众工作、平台化/项目制工作）列出来、讲清楚，让不了解有哪些工作的人看见更多选择。

**只做介绍，不做交易**：展示“有哪些工作、长什么样”，不回答“哪有岗位”。不提供岗位、不招聘、不撮合、不导流培训、不承诺收益。内容来自从业者授权投稿与编辑整理，收入均为**区间参考**，不构成收益承诺。

## 功能

- **总览**：已收录工作数、分类数、小众工作数；一句话讲清定位。
- **分类浏览**：正式职业 / 新职业 / 小众工作 / 平台化项目制。
- **搜索 + 标签筛选**：按工作名、关键词、标签快速定位。
- **详情页**：一条工作的完整画像——真实任务、适合谁、门槛、收入区间、劝退点、来源授权。

## 目录结构

```
.
├── data/
│   ├── jobs.json            # ★ 源数据（人工/投稿维护，改这里）
│   └── gen_data.py          # jobs.json -> ../docs/data.js（window.JOBS_DATA）
├── docs/                    # 网站（纯静态）
│   ├── index.html
│   ├── app.js               # 前端渲染：分类/搜索/筛选/详情（hash 路由）
│   ├── style.css
│   ├── data.js              # ★ 网站实际加载的数据（由脚本生成，勿手改）
│   ├── serve.py             # 本地后端：托管网页 + 自动打开浏览器
│   └── 启动网站.bat          # Windows 双击启动
└── vercel.json              # 输出目录 docs（照搬 lottery）
```

## 本地运行

方式一（推荐）：
> 双击 `docs/启动网站.bat`，自动起服务并打开 `http://localhost:8000`。

方式二（手动起服务）：
```bash
cd docs
python serve.py
# 浏览器访问 http://localhost:8000
```

方式三（纯静态）：
直接双击 `docs/index.html` 用浏览器打开（使用当前 `data.js` 已有数据）。

## 维护内容（加/改一条工作）

1. 编辑 `data/jobs.json`，按现有字段新增/修改一条对象（字段见下方）。
2. 重跑生成脚本：
   ```bash
   python data/gen_data.py     # 重新产出 docs/data.js
   ```
3. `git push`，网站随部署自动更新。

### jobs.json 字段说明

| 字段 | 说明 |
|---|---|
| `id` | 唯一 slug，详情页地址 `#/job/<id>` |
| `name` | 工作名称 |
| `aliases` | 别称列表 |
| `category` | 分类：正式职业 / 新职业 / 小众工作 / 平台化项目制 |
| `tags` | 标签，用于搜索与筛选 |
| `summary` | 一句话简介 |
| `dailyTasks` | 真实任务列表 |
| `whoSuits` | 适合谁 |
| `threshold` | 门槛（技能/证书/体力等） |
| `incomeRange` | 收入区间（**区间参考，非承诺**） |
| `discouragement` | 劝退点 |
| `source` | 内容来源 / 授权声明 |
| `updatedAt` | 最近更新年月 |

## 部署到公网

> 本项目是纯静态站点（无后端数据库），只需把 `docs/` 下的前端文件发布出去即可。

### 方式一：GitHub Pages（推荐，免服务器）

1. 仓库 **Settings → Pages → Source** 选 **Deploy from a branch**，**Branch** 选 `main`、目录选 `/docs`，保存。
2. 稍候出现 `https://<用户名>.github.io/jobs-wiki/` 访问地址。
3. 更新内容：`git push` 后 Pages 自动重新发布。

### 方式二：Vercel（最省心）

1. [vercel.com](https://vercel.com) 用 GitHub 登录并 **Import** 本仓库。
2. 本仓库已含 `vercel.json`（输出目录 `docs`），无需额外配置，直接 **Deploy**。
3. 之后本地更新内容 `git push` 即自动重新部署。

### 方式三：Nginx / 对象存储 + CDN

把 `docs/` 整目录作为静态根发布即可。

## 合规声明

本站为非盈利科普项目，不提供任何招聘、交易、培训导流服务，不对任何工作的收入作出承诺。内容如涉版权或授权问题，请联系更正。
