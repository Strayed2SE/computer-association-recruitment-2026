# 计算机协会招新网站 · 维护文档

> 2026 秋季招新 | HTML + CSS + JavaScript | 深色/浅色双主题 | 最后更新：2026-06-18

---

## 📁 文件结构

```
F:\练习\计协招新\
├── index.html      (684 行)  HTML 结构
├── styles.css      (1617 行) 全局样式 + 响应式 + 双主题
├── script.js       (371 行)  交互逻辑
├── README.md                本文件
└── assets/                  静态资源（自行创建）
    ├── emblem.png           协会会徽 ★ 待替换
    ├── qq-qrcode.png        QQ群二维码 ★ 待替换
    └── form-qrcode.png      报名表二维码 ★ 待替换
```

---

## 🎨 设计系统

### 配色方案

| 变量 | 深色模式 | 浅色模式 | 用途 |
|------|---------|---------|------|
| `--bg-primary` | `#0A0E1A` | `#F8FAFC` | 页面背景 |
| `--bg-secondary` | `#111827` | `#F1F5F9` | 区块背景 |
| `--bg-card` | `#1A1F35` | `#FFFFFF` | 卡片背景 |
| `--text-primary` | `#F1F5F9` | `#0F172A` | 标题文字 |
| `--text-secondary` | `#94A3B8` | `#475569` | 正文文字 |
| `--text-muted` | `#64748B` | `#64748B` | 辅助文字 |
| `--accent-blue` | `#4F6EF7` | 同 | 主品牌色 |
| `--accent-purple` | `#8B5CF6` | 同 | 辅品牌色 |
| `--accent-cyan` | `#22D3EE` | 同 | 高亮色 |
| `--accent-amber` | `#F59E0B` | 同 | CTA 按钮色 |
| `--border` | `#1E293B` | `#E2E8F0` | 边框 |
| `--border-light` | `#334155` | `#CBD5E1` | 亮边框 |

> **规则**：CSS 中始终使用 `var(--xxx)` 引用颜色，避免硬编码。如需添加新颜色，先在 `:root` 和 `[data-theme="light"]` 中定义变量。

### 字体

| 用途 | 字体 | 备选 |
|------|------|------|
| 标题 (h1-h6) | Space Grotesk | system-ui, sans-serif |
| 正文 (p, body) | DM Sans | system-ui, -apple-system, sans-serif |

> Google Fonts 引入，已在 `<head>` 中加载。如需更换，修改 `index.html` 第 12 行的 URL 和 CSS 中的 `font-family`。

### 间距与圆角

| 变量 | 值 | 用途 |
|------|-----|------|
| `--radius-sm` | 8px | 小图标、标签 |
| `--radius` | 12px | 按钮、FAQ |
| `--radius-lg` | 16px | 卡片 |
| `--radius-xl` | 24px | CTA 大卡片 |
| `--max-width` | 1200px | 内容区最大宽度 |
| `--nav-height` | 72px | 导航栏高度 |

---

## 📄 页面区块

| 区块 | id | 功能 |
|------|-----|------|
| 导航栏 | `#navbar` | 固定顶部，滚动后毛玻璃效果，移动端汉堡菜单 |
| Hero | `#hero` | 全屏，Canvas 粒子背景，会徽区域，双 CTA |
| 关于我们 | `#about` | 左：三张特色卡片；右：协会介绍 + 特点列表 |
| 部门介绍 | `#departments` | Bento Grid 6 卡片，含大卡片和宽卡片 |
| 数据统计 | `#stats` | 4 个数字计数器，滚动到可见时播放动画 |
| 精彩活动 | `#events` | 3 张活动卡片，含日期和标签 |
| 加入流程 | `#process` | 4 步时间线，圆形步骤编号 |
| 常见问题 | `#faq` | 5 个手风琴折叠面板 |
| CTA Banner | `#cta` | 报名号召 + 双按钮 |
| Footer | `#footer` | 四栏网格，会徽，社交媒体图标 |
| 二维码弹窗 | `#qrModal` | 点击报名按钮弹出，QQ群 + 报名表二维码 |
| 回到顶部 | `#backToTop` | 滚动超过 600px 显示 |

---

## 🔧 常见修改指南

> 所有修改只需编辑 `index.html`（改内容）、`styles.css`（改样式）、`script.js`（改行为）。
> 每个区块都有 `<section id="xxx">` 或注释分隔线 `<!-- ==== XXX ==== -->`，搜索即可定位。

---

### 1. 导航栏

**改链接文字和顺序：**

```html
<ul class="nav-links">
    <li><a href="#about" onclick="scrollToSection(event, 'about')">关于我们</a></li>
    <!-- 增加链接：复制一行，改 href 和文字 -->
    <!-- 删除链接：删除整行 <li> -->
    <!-- 改顺序：拖动 <li> 整行到目标位置 -->
</ul>
```

**改 CTA 按钮文字：**

```html
<button class="nav-cta" onclick="scrollToSection(event, 'cta')">
    立即加入   <!-- ← 改这里 -->
</button>
```

**移动端菜单同步修改：** 找到 `id="mobileNav"` 的 div，里面的链接需要和桌面端保持一致。

**改导航栏高度：** 改 `styles.css` 中 `:root { --nav-height: 72px; }`，滚动偏移量会自动适配。

---

### 2. Hero 区域

**改徽章文字：**

```html
<div class="hero-badge">
    <span class="hero-badge-dot" aria-hidden="true"></span>
    2026 秋季招新正式启动   <!-- ← 改这里 -->
</div>
```

**改主标题：**

```html
<h1 class="hero-title">
    用代码改变世界<br>           <!-- ← 第一行 -->
    <span class="hero-title-gradient">从这里开始</span>  <!-- ← 渐变高亮行 -->
</h1>
```
> 不需要换行就去掉 `<br>`。渐变行保持用 `<span class="hero-title-gradient">` 包裹。

**改副标题：**

```html
<p class="hero-subtitle">
    计算机协会汇聚全校最优秀的技术爱好者...   <!-- ← 直接改文字 -->
</p>
```

**改 CTA 按钮：**

```html
<div class="hero-actions">
    <button class="btn btn-primary" onclick="scrollToSection(event, 'cta')">
        立即报名   <!-- ← 主按钮文字 -->
    </button>
    <button class="btn btn-secondary" onclick="scrollToSection(event, 'departments')">
        了解部门   <!-- ← 次按钮文字；改 onclick 里的 section id 可换跳转目标 -->
    </button>
</div>
```

**改/删滚动指示器：**

```html
<div class="hero-scroll-indicator" onclick="scrollToSection(event, 'about')" ...>
    <span>探索更多</span>   <!-- ← 改文字 -->
</div>
```
> 不需要就删除整个 `<div class="hero-scroll-indicator">`。

---

### 3. 会徽（三个位置同步）

将协会会徽 PNG 放入 `assets/emblem.png`，以下三处自动生效：

| 位置 | 尺寸 | CSS 选择器 |
|------|------|-----------|
| 导航栏左侧 | 36×36px 圆形 | `.nav-logo-icon` |
| Hero 标题上方 | 100~220px 响应式圆形 | `.hero-emblem` |
| Footer 品牌区 | 36×36px 圆形 | `.nav-logo-icon` |

> 未放图片时显示代码图标 `< / >` 占位。图片一旦加载成功，占位 SVG 自动隐藏。
>
> **如果只想在某处显示会徽**：在对应 `<img>` 标签上改 `src` 路径，未改的位置保持占位图标。

---

### 4. 关于我们

**改标题和描述：**

```html
<span class="section-tag">关于我们</span>                    <!-- ← 小标签 -->
<h2 class="section-title">计算机协会，不止于代码</h2>         <!-- ← 标题 -->
<p class="about-lead">计算机协会成立于2015年...</p>           <!-- ← 引导段 -->
<p>在这里，你不仅能学到前沿技术...</p>                        <!-- ← 第二段 -->
```

**改三张特色卡片：** 每张卡片由图标 + 标题 + 描述组成：

```html
<div class="about-card">
    <div class="about-card-icon purple">    <!-- purple/cyan/blue 控制图标颜色 -->
        <svg>...</svg>                       <!-- ← 可替换为其他 SVG 图标 -->
    </div>
    <div>
        <h4>编程开发</h4>                    <!-- ← 卡片标题 -->
        <p>Web / 移动端 / 后端 / 游戏开发</p> <!-- ← 卡片描述 -->
    </div>
</div>
```
> 颜色选项：`purple`（紫）、`cyan`（青）、`blue`（蓝）。如需新颜色，在 `styles.css` 中搜 `.about-card-icon` 追加。

**改下方三个特点（零基础/项目驱动/竞赛机会）：**

```html
<div class="about-feature">
    <div class="about-feature-icon">
        <svg>...</svg>    <!-- 对勾图标，一般不用改 -->
    </div>
    <div class="about-feature-text">
        <h4>零基础友好</h4>
        <p>从零开始的培训体系...</p>
    </div>
</div>
```

---

### 5. 部门卡片（Bento Grid）

**卡片结构模板：**

```html
<div class="bento-card large reveal" style="--card-accent: var(--accent-blue);">
    <div class="bento-icon programming">     <!-- 图标：programming/ai/design/security/competition/community -->
        <svg>...</svg>
    </div>
    <h3>软件开发部</h3>                       <!-- ← 部门名称 -->
    <p>协会核心技术部门...</p>                 <!-- ← 部门描述 -->
    <div class="bento-tags">
        <span class="bento-tag">React / Vue</span>  <!-- ← 技术标签 -->
        <!-- 增加标签：加一行 span -->
    </div>
</div>
```

**卡片尺寸（改 class）：**

| class | 桌面端 | 平板 | 手机 |
|-------|--------|------|------|
| `bento-card` | 1列 | 1列 | 1列 |
| `bento-card wide` | 2列 | 2列 | 1列 |
| `bento-card large` | 2列 × 2行 | 2列 | 1列 |

**改卡片强调色：** `style="--card-accent: var(--accent-blue);"` 中的颜色变量：
- `var(--accent-blue)` — 蓝
- `var(--accent-purple)` — 紫
- `var(--accent-cyan)` — 青
- `var(--accent-amber)` — 金
- `var(--success)` — 绿
- `#EC4899` — 粉（设计部用）

**图标颜色选项（改 `bento-icon` 后面的类）：**
`programming` / `ai` / `design` / `security` / `competition` / `community`

---

### 6. 数据统计

**改数字：** 改 `data-count` 属性的值即可，JS 自动从 0 滚到该数字。

```html
<div class="stat-number" data-count="500">0</div>   <!-- 改 500 为目标数字 -->
<div class="stat-label">累计会员</div>               <!-- ← 改标签文字 -->
```

**改标签文字：** 改 `.stat-label` 的文本。

**增删统计项：** 复制/删除整个 `.stat-item` div。4 项刚好填满一行，增到 5 项以上需要调整 `styles.css` 中的 `.stats-grid` 列数。

---

### 7. 活动卡片

**卡片结构模板：**

```html
<div class="event-card reveal">
    <!-- ★ 建议替换为过往活动合影，见下方说明 -->
    <div class="event-image hackathon">
        <img src="assets/event-hackathon.jpg" alt="Hackathon 活动现场"
             style="width:100%;height:100%;object-fit:cover;">
    </div>
    <div class="event-body">
        <div class="event-date">2026.10.15 · 每学期一次</div>   <!-- ← 日期和频次 -->
        <h3>Hackathon 黑客马拉松</h3>                            <!-- ← 活动名称 -->
        <p>48小时极限编程挑战...</p>                              <!-- ← 活动描述 -->
        <span class="event-tag competition">竞赛</span>          <!-- ← 标签：workshop/competition/talk -->
    </div>
</div>
```

**⭐ 强烈建议：将占位图标替换为过往活动合影**

当前三张活动卡片使用渐变背景 + SVG 图标占位。真实的活动照片（现场照、合影、作品展示）远比图标有说服力。替换方法：

1. 准备 3 张活动照片，建议尺寸 800×500px（16:10），放入 `assets/` 目录
2. 在每个 `.event-image` 内部放入 `<img>` 标签替换 SVG 图标（如上模板所示）
3. 照片建议：Hackathon 选现场 coding 场景、分享会选讲师演讲场景、训练营选教学互动场景
4. 线上部署时压缩图片（推荐 WebP 格式，< 100KB），避免影响加载速度

> 如果暂时没有照片：保留当前渐变背景 + SVG 图标作为临时方案，`.event-image` 上的 `hackathon` / `techtalk` / `bootcamp` 类控制背景色（紫/蓝/绿渐变），浅色模式下自动切换为淡色版本。

**标签颜色选项（改 `event-tag` 后面的类）：**
- `competition` — 金色（竞赛）
- `workshop` — 蓝色（工作坊）
- `talk` — 紫色（讲座）

---

### 8. 加入流程

**改步骤：**

```html
<div class="process-step reveal">
    <div class="step-number">01</div>          <!-- ← 步骤编号 -->
    <h3>在线报名</h3>                          <!-- ← 步骤标题 -->
    <p>填写报名表，选择你感兴趣的部门方向</p>    <!-- ← 步骤描述 -->
</div>
```

**增删步骤：** 复制/删除整个 `.process-step` div。步骤之间的连接线在 `styles.css` 的 `.process-steps::before` 中定义。超过 4 步需调整 `grid-template-columns`。

---

### 9. FAQ（常见问题）

**完整模板：**

```html
<div class="faq-item reveal">
    <button class="faq-question" onclick="toggleFAQ(this)" aria-expanded="false">
        <span>这里写问题？</span>
        <span class="faq-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
        </span>
    </button>
    <div class="faq-answer">
        <div class="faq-answer-inner">
            这里写答案。答案高度由 JS 自动计算，支持任意长度。
        </div>
    </div>
</div>
```

| 操作 | 方法 |
|------|------|
| **新增** | 在 `.faq-list` 末尾粘贴模板，改问答文字 |
| **修改** | 找到对应条目，直接编辑 `<span>` 和 `faq-answer-inner` 内的文字 |
| **删除** | 删除整个 `.faq-item` div |
| **排序** | 拖动 `.faq-item` 整块到目标位置 |

> **注意**：`toggleFAQ(this)` 不可删除或改名；答案高度 JS 自动计算；特殊字符（`"` `<` `>` `&`）需用 HTML 实体转义。

---

### 10. CTA Banner

```html
<span class="section-tag">加入我们</span>
<h2>准备好开启技术之旅了吗？</h2>         <!-- ← 标题 -->
<p>2026秋季招新现已启动...</p>            <!-- ← 描述 -->

<!-- 主按钮 -->
<button class="btn btn-primary" onclick="handleJoin()">
    立即报名                              <!-- ← 改文字 -->
</button>
<!-- 次按钮 -->
<button class="btn btn-secondary" onclick="handleMoreInfo()">
    咨询详情                              <!-- ← 改文字 -->
</button>
```

> `handleJoin()` 触发二维码弹窗，`handleMoreInfo()` 跳转到 FAQ。如需改为跳转其他位置，改 `script.js` 中对应函数。

---

### 11. 二维码弹窗

```html
<div class="modal-overlay" id="qrModal" ...>
    <div class="modal-content">
        <span class="section-tag">扫码报名</span>          <!-- ← 弹窗标签 -->
        <h2 class="modal-title">加入计算机协会</h2>         <!-- ← 弹窗标题 -->
        <p class="modal-desc">扫描下方二维码...</p>         <!-- ← 弹窗描述 -->

        <!-- 左：QQ群二维码 -->
        <div class="qr-card">
            <div class="qr-placeholder">
                <!-- 有真实图片后替换为： -->
                <!-- <img src="assets/qq-qrcode.png" alt="QQ群二维码"
                          style="width:200px;height:200px;border-radius:8px;object-fit:contain;"> -->
                ...
            </div>
            <h4>招新QQ群</h4>
            <p>扫码加入2026招新群，获取最新通知</p>
        </div>

        <!-- 右：报名表二维码（结构与左相同） -->
        <div class="qr-card">...</div>

        <p class="modal-footer-text">报名截止：2026年9月30日...</p>  <!-- ← 底部提示 -->
    </div>
</div>
```

---

### 12. Footer

**改品牌标语：**

```html
<div class="footer-brand">
    <a href="#hero" class="nav-logo">...</a>
    <p>用代码改变世界，从这里开始。<br>计算机协会，不止于代码。</p>
    <!-- ↑ 改这里 -->
</div>
```

**改导航链接：** 在 `<ul class="footer-links">` 中增删 `<li>`，和导航栏保持一致。

**改联系信息：**

```html
<li class="footer-contact-row">
    <svg>邮件图标</svg>
    csa@university.edu.cn          <!-- ← 改邮箱 -->
</li>
<li class="footer-contact-row">
    <svg>位置图标</svg>
    学生活动中心 302               <!-- ← 改地址 -->
</li>
<li class="footer-contact-row">
    <svg>时钟图标</svg>
    每周五 18:00-21:00             <!-- ← 改开放时间 -->
</li>
```

**改社交媒体链接：**

```html
<div class="footer-social">
    <a href="#" aria-label="QQ" title="QQ群">     <!-- ← 改 href 为真实链接 -->
        <svg>QQ图标</svg>
    </a>
    <a href="#" aria-label="微信" ...>             <!-- ← 同上 -->
    ...
</div>
```

**增删社交图标：** 复制/删除 `<a>` 标签。图标 SVG 来自 Simple Icons 或 Heroicons。改 `aria-label` 和 `title` 为对应平台名。

---

### 13. 主题

- **默认深色**：`script.js` 中无 `localStorage` 且系统无偏好时默认深色
- **强制默认浅色**：在 `script.js` 主题切换代码中，将初始状态改为始终 `light`
- **禁用浅色模式**：删除 `styles.css` 中所有 `[data-theme="light"]` 规则块
- **改某颜色**：修改 `:root`（深色）或 `[data-theme="light"]`（浅色）中对应的 CSS 变量

---

### 14. 其他

**改页面标题（浏览器标签页）：**

```html
<title>计算机协会 · 2026招新</title>   <!-- ← 改这里 -->
```

**改 SEO 描述：**

```html
<meta name="description" content="计算机协会招新 - 加入我们...">
```

**改粒子数量/颜色：** 在 `script.js` 中搜 `PARTICLE_COUNT`（数量）和 `hue`（色相，230=蓝，265=紫）。

**改滚动动画阈值：** 在 `script.js` 搜 `0.88`（reveal 触发比例）和 `0.7`（统计数字触发比例）。

---

## ⚙️ 技术实现说明

### Canvas 粒子背景

- 文件：`script.js` 第 18-105 行
- 80 个粒子，蓝/紫两种色调
- 距离 < 120px 的粒子间画连线
- 标签页隐藏时自动暂停（`visibilitychange`）
- 窗口 resize 时 150ms 防抖重建
- 使用 `hero.getBoundingClientRect()` 获取尺寸

### 深色/浅色切换

- 点击导航栏 ☀/🌙 按钮切换
- `localStorage` 记忆偏好
- 首次访问跟随系统 `prefers-color-scheme`
- 切换类名在 `<html data-theme="light|dark">` 上
- 过渡动画：`transition: background-color 0.35s ease, color 0.35s ease`

### 响应式断点

| 断点 | 变化 |
|------|------|
| 1024px | Bento 4列→2列；事件 3列→2列；统计 4列→2列；流程 4列→2列 |
| 768px | 导航变为汉堡菜单；Bento 1列；事件 1列；流程 1列；Footer 1列 |
| 480px | Hero 按钮纵向排列；统计保持 2列 |

### 滚动动画

- `.reveal` 类元素在进入视口 88% 位置时淡入上移
- `.reveal-delay-1` ~ `.reveal-delay-4` 提供级联延迟（0.1s ~ 0.4s）
- 统计数字计数器在 `#stats` 区块进入视口 70% 时触发
- `prefers-reduced-motion: reduce` 时所有动画和过渡被禁用

### 弹窗（二维码）

- `handleJoin()` → `openQRModal()` 打开
- 点击遮罩层 / ✕ 按钮 / `Esc` 键关闭
- 打开时锁定 body 滚动
- 关闭按钮自动聚焦（无障碍）

---

## 🌐 浏览器兼容

| 特性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| CSS Grid | ✓ | ✓ | ✓ | ✓ |
| CSS 变量 | ✓ | ✓ | ✓ | ✓ |
| backdrop-filter | ✓ | ✓ | ✓ 17+ | ✓ |
| Canvas 2D | ✓ | ✓ | ✓ | ✓ |
| clamp() | ✓ | ✓ | ✓ | ✓ |
| aspect-ratio | ✓ | ✓ | ✓ 15+ | ✓ |
| prefers-reduced-motion | ✓ | ✓ | ✓ | ✓ |
| visibilitychange | ✓ | ✓ | ✓ | ✓ |

> IE 11 及更早版本不支持。Safari 14 以下 `clamp()` 不可用，标题会回退到无响应式字号。

---

## 🚀 部署

纯静态文件，托管到任意 Web 服务器即可：

```bash
# 本地预览
python -m http.server 8080
# 或直接用浏览器打开 index.html

# 部署到 GitHub Pages / Vercel / Netlify
# 直接上传整个文件夹即可，无需构建
```

### 上线前检查清单

- [ ] 替换 `assets/emblem.png` 为协会会徽
- [ ] 替换两个二维码占位图为真实二维码
- [ ] 修改 `data-count` 为实际统计数据
- [ ] 修改活动日期为实际日期
- [ ] 修改 Footer 联系邮箱和地址
- [ ] 修改弹窗底部报名截止日期
- [ ] 替换 Footer 社交链接 `href="#"` 为真实链接
- [ ] 如需收集报名数据，将 `handleJoin()` 中的弹窗逻辑改为表单提交
- [ ] 测试深色/浅色两种模式
- [ ] 测试 375px / 768px / 1024px / 1440px 四个宽度

---

## 📞 联系方式（示例）

- 邮箱：csa@university.edu.cn
- 地址：学生活动中心 302
- 开放时间：每周五 18:00-21:00
