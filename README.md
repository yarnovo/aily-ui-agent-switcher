# @akong/agent-switcher

> ← 回 [akong design system](https://yarnovo.github.io/akong-core/) 总站

akong AgentSwitcher · 数字角色切换器 · 跨端 (Web + React Native)

drawer-style modal · 列我的所有数字角色 · 切换 + 新建入口。

## Demo

[GitHub Pages 演示](https://yarnovo.github.io/akong-agent-switcher/)

## 安装

```bash
npm i github:yarnovo/akong-agent-switcher github:yarnovo/akong-tokens
```

## Web

```tsx
import { useState } from 'react'
import { AgentSwitcher } from '@akong/agent-switcher'
import '@akong/agent-switcher/style.css'
import '@akong/tokens/style.css'  // 顶层引一次 token

const agents = [
  { id: 'a1', name: '阿空小喜', tagline: '相亲红娘 · 帮你找对象', avatar: '💝' },
  { id: 'a2', name: '阿空大优', tagline: '邮件助理 · 收发提醒', avatar: '📮' },
  { id: 'a3', name: '阿空小研', tagline: '用户调研 · 产品经理', avatar: '🔍' },
]

function App() {
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState('a1')
  return (
    <>
      <button onClick={() => setOpen(true)}>切换角色</button>
      <AgentSwitcher
        open={open}
        onClose={() => setOpen(false)}
        agents={agents}
        activeId={activeId}
        onSelect={setActiveId}
        onCreateNew={() => alert('新建')}
      />
    </>
  )
}
```

## React Native

```tsx
import { AgentSwitcher } from '@akong/agent-switcher'
// 同上 · Metro 自动按 .native.tsx 解析
```

## API

| Prop | Type | Default | 说明 |
|---|---|---|---|
| open | `boolean` | — | 是否打开 |
| onClose | `() => void` | — | 关闭回调 (backdrop / × / 选中后 / ESC) |
| agents | `AgentSwitcherItem[]` | — | 角色列表 |
| activeId | `string` | — | 当前激活的角色 id (右侧对勾) |
| onSelect | `(id: string) => void` | — | 选中回调 (会随后触发 onClose) |
| onCreateNew | `() => void` | — | 新建回调 (不传则隐藏 + 新建按钮) |
| title | `string` | `'切换数字角色'` | 顶部标题 |

`AgentSwitcherItem`:

```ts
{ id: string; name: string; tagline: string; avatar: string }
```

`avatar` 既接 URL (`https://...` / `data:` / `/path`)，也接 emoji / 单字符 (走文字回退)。

## 设计原则

- **一份 props**：Web 跟 RN 共享 `AgentSwitcher.types.ts`
- **两端实现**：`AgentSwitcher.tsx` (Web · DOM `<dialog>`) + `AgentSwitcher.native.tsx` (RN · `Modal` + `Animated.View`)
- **触摸目标 ≥ 56px**：每行 44px 头像 + 12px padding
- **极简反馈**：press 0.7 opacity (不缩放 · 不晃)
- **token 100% 接 @akong/tokens**：改一处 token 自动 update
- **iOS 安全区**：`env(safe-area-inset-bottom)`

## 行为

| 触发 | 结果 |
|---|---|
| 点 backdrop | onClose |
| 点 × 关闭按钮 | onClose |
| ESC (Web) | onClose |
| 点角色 | onSelect(id) → onClose |
| 点 + 新建 | onCreateNew → onClose |

## 视觉

- 模态弹层 · backdrop fade-in · drawer slide-up from bottom
- max-w-[480px] mx-auto · 顶部圆角 `var(--ak-radius-2xl)`
- 顶部 grabber 横线 (40×4 · `var(--ak-border)`)
- 标题居中 · `text-md font-semibold`
- list: 头像 44×44 + name + tagline (line-clamp-1) + active 项右对勾
- 底部 + 新建按钮 (full-width · secondary 风)
