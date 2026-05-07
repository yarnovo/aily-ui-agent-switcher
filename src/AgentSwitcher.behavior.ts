/**
 * 跨端行为契约 · Web + RN 都遵循
 *
 * 写法是"给定 props · 期望 · 该发生 / 不该发生"的纯描述
 * 各端测试 import 这份 spec 跑 · 行为强一致
 */

export type SelectOutcome = 'select-fired-and-close' | 'no-op'
export type CloseSource = 'backdrop' | 'close-button' | 'select' | 'esc'

export interface SelectScenario {
  name: string
  /** 模拟点击的 agent id */
  clickId: string
  /** 当前 activeId */
  activeId?: string
  outcome: SelectOutcome
}

/** 选择场景 · 任何角色被点都该 fire onSelect + onClose */
export const selectScenarios: SelectScenario[] = [
  {
    name: '默认 · 点角色 · onSelect + onClose 都触发',
    clickId: 'a1',
    outcome: 'select-fired-and-close',
  },
  {
    name: '点已激活的角色 · 仍触发 onSelect + onClose (用户可能想确认)',
    clickId: 'a1',
    activeId: 'a1',
    outcome: 'select-fired-and-close',
  },
  {
    name: '点不同角色 · onSelect 带新 id',
    clickId: 'a2',
    activeId: 'a1',
    outcome: 'select-fired-and-close',
  },
]

/** 关闭场景 · 4 个来源都该触发 onClose */
export const closeSources: CloseSource[] = ['backdrop', 'close-button', 'select', 'esc']
