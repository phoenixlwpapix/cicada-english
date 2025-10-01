# Cicada English (知了英语)

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-blue)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC)](https://tailwindcss.com)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini_AI-8B5CF6)](https://ai.google.dev)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E)](https://supabase.com)

> 🚀 AI 驱动的个性化英语学习平台，为不同水平的学习者提供沉浸式的英语故事和阅读理解练习

## 🌟 项目特色

- **🤖 AI 生成内容** - 使用 Google Gemini AI 生成个性化的英语故事和阅读理解题目
- **📚 多难度支持** - 提供 A1 到 B2 四个难度级别，满足不同学习阶段需求
- **🎨 智能配图** - 为每个故事自动生成精美的插图，提升视觉学习体验
- **📊 进度跟踪** - 记录学习成绩，提供详细的学习统计和排行榜
- **🌙 暗黑模式** - 完整的主题切换系统，保护眼睛，改善体验
- **📱 响应式设计** - 支持桌面、平板和移动设备，随时随地学习

## 🎯 核心功能

### AI 故事生成

- 根据用户选择的难度级别和词汇偏好生成个性化故事
- 支持故事长度调节（200-400 字）
- 自动生成相关阅读理解题目
- 智能故事配图，提升学习趣味性

### 用户系统

- 用户注册和登录功能
- 学习进度跟踪和统计
- 成绩排行榜
- 个人学习数据分析

### 现代化 UI/UX

- 玻璃拟态设计风格
- 流畅的动画效果
- 无障碍性支持
- 深色模式切换

## 🛠️ 技术栈

### 前端技术

- **框架**: Next.js 15, React 19
- **样式**: Tailwind CSS 4.1, Radix UI
- **状态管理**: TanStack Query, React Context
- **图标**: Lucide React
- **动画**: React Confetti, CSS Transitions

### AI 和后端

- **AI 引擎**: Google Gemini AI
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth (JWT)
- **图像生成**: 自定义 AI 图像生成器

### 开发工具

- **代码检查**: ESLint
- **CSS 处理**: PostCSS
- **包管理**: npm
- **部署**: Vercel

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn 或 pnpm

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 环境配置

1. 复制环境变量文件：

```bash
cp .env.example .env.local
```

2. 配置环境变量：

```env
# Google Gemini AI
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 开始体验应用。

### 构建生产版本

```bash
npm run build
npm run start
```

## 📁 项目结构

```
cicada-english/
├── app/                    # Next.js 15 App Router
│   ├── api/               # API路由
│   │   ├── generate/      # 故事生成API
│   │   └── generate/image # 图像生成API
│   ├── dashboard/         # 用户仪表板
│   ├── login/            # 登录页面
│   ├── globals.css       # 全局样式
│   ├── layout.js         # 根布局
│   └── page.js           # 首页
├── components/           # React组件
│   ├── ui/              # 可复用UI组件
│   ├── AppHeader.jsx    # 应用头部
│   ├── StoryCard.jsx    # 故事卡片
│   ├── QuizCard.jsx     # 测验卡片
│   └── WordInputCard.jsx # 词汇输入卡片
├── contexts/            # React Context
│   ├── AuthContext.js   # 认证上下文
│   └── ThemeContext.js  # 主题上下文
├── lib/                # 工具库
│   ├── image-generator.js # 图像生成器
│   ├── prompt-generator.js # 提示词生成器
│   ├── quiz-data.js     # 测验数据处理
│   ├── supabase.js      # Supabase客户端
│   └── utils.js         # 工具函数
└── public/             # 静态资源
```

## 🎮 使用指南

### 1. 选择难度级别

- **A1** - 小学 1-3 年级水平，基础词汇和简单句式
- **A2** - 小学 4-6 年级水平，常用词汇和基本语法
- **B1** - 初中水平，丰富词汇和复合句式
- **B2** - 高中水平，高级词汇和复杂语法结构

### 2. 调整故事参数

- 使用滑块调节故事长度（200-400 字）
- 系统会根据您的选择生成相应难度的故事

### 3. 生成故事

- 点击"点我随机生成"按钮
- AI 将在几秒钟内生成个性化英语故事
- 故事包含精美配图和相关阅读理解题目

### 4. 完成练习

- 阅读故事内容，理解故事情节
- 回答系统生成的阅读理解题目
- 查看即时评分和反馈

## 🔧 开发指南

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 React 和 Next.js 最佳实践
- 组件使用函数式组件和 hooks

### 提交规范

```
feat: 添加新功能
fix: 修复bug
docs: 更新文档
style: 样式修改
refactor: 重构代码
test: 添加测试
chore: 其他修改
```

### 分支管理

- `main` - 主分支，生产环境代码
- `develop` - 开发分支
- `feature/*` - 功能分支
- `hotfix/*` - 热修复分支

## 🚢 部署

### Vercel 部署（推荐）

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 自动部署

### 手动部署

```bash
# 构建项目
npm run build

# 启动生产服务器
npm run start
```

## 📈 性能优化

- **代码分割**: 自动按页面和组件分割代码包
- **图片优化**: 自动图片格式转换和压缩
- **缓存策略**: 智能的静态资源缓存机制
- **AI 优化**: 请求重试机制和内容缓存

## 🔒 安全特性

- **Row Level Security**: 数据库行级安全保护
- **JWT 认证**: 安全的用户身份验证机制
- **内容审核**: AI 生成内容的质量和安全性检查
- **隐私保护**: 遵守隐私保护法规和最佳实践

## 🤝 贡献指南

欢迎社区贡献！请遵循以下步骤：

1. Fork 项目仓库
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org) - React 框架
- [Google Gemini AI](https://ai.google.dev) - AI 内容生成
- [Supabase](https://supabase.com) - 后端服务
- [Tailwind CSS](https://tailwindcss.com) - 样式框架
- [Radix UI](https://radix-ui.com) - UI 组件库

## 📞 联系我们

如有问题或建议，请通过以下方式联系：

- 📧 Email: contact@cicada-english.com
- 💬 微信公众号: Cicada English
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/cicada-english/issues)

---

**享受 AI 驱动的英语学习之旅！** 🌟
