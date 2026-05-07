/**
 * Web 端组件测试 · vitest + @testing-library/react
 *
 * 覆盖:
 * - open=false 不渲染
 * - open=true 渲染所有 agents
 * - 选中 → onSelect + onClose
 * - activeId → 对勾
 * - 点 backdrop / × / ESC → onClose
 * - + 新建按钮 → onCreateNew + onClose
 * - 没传 onCreateNew → 不显示新建按钮
 * - 空 list → empty 提示
 * - title default + 自定义
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import { AgentSwitcher } from '../src/AgentSwitcher'
import { selectScenarios } from '../src/AgentSwitcher.behavior'

afterEach(() => cleanup())

const sampleAgents = [
  { id: 'a1', name: '阿空小喜', tagline: '相亲红娘 · 帮你找对象', avatar: '💝' },
  { id: 'a2', name: '阿空大优', tagline: '邮件助理 · 收发提醒', avatar: '📮' },
  { id: 'a3', name: '阿空小研', tagline: '用户调研 · 产品经理', avatar: '🔍' },
]

describe('AgentSwitcher (Web) · 渲染', () => {
  it('open=false 不渲染', () => {
    const { container } = render(
      <AgentSwitcher open={false} onClose={() => {}} agents={sampleAgents} onSelect={() => {}} />,
    )
    expect(container.querySelector('[data-testid="ak-agent-switcher-drawer"]')).toBeFalsy()
    expect(container.querySelector('[data-testid="ak-agent-switcher-backdrop"]')).toBeFalsy()
  })

  it('open=true 渲染 drawer + backdrop', () => {
    render(<AgentSwitcher open onClose={() => {}} agents={sampleAgents} onSelect={() => {}} />)
    expect(screen.getByTestId('ak-agent-switcher-drawer')).toBeInTheDocument()
    expect(screen.getByTestId('ak-agent-switcher-backdrop')).toBeInTheDocument()
  })

  it('open=true 渲染所有 agents', () => {
    render(<AgentSwitcher open onClose={() => {}} agents={sampleAgents} onSelect={() => {}} />)
    expect(screen.getByText('阿空小喜')).toBeInTheDocument()
    expect(screen.getByText('阿空大优')).toBeInTheDocument()
    expect(screen.getByText('阿空小研')).toBeInTheDocument()
    expect(screen.getByText('相亲红娘 · 帮你找对象')).toBeInTheDocument()
  })

  it('default title = "切换数字角色"', () => {
    render(<AgentSwitcher open onClose={() => {}} agents={sampleAgents} onSelect={() => {}} />)
    expect(screen.getByText('切换数字角色')).toBeInTheDocument()
  })

  it('自定义 title 反映', () => {
    render(
      <AgentSwitcher
        open
        title="选择一个伙伴"
        onClose={() => {}}
        agents={sampleAgents}
        onSelect={() => {}}
      />,
    )
    expect(screen.getByText('选择一个伙伴')).toBeInTheDocument()
  })

  it('空 agents · 显示 empty 提示', () => {
    render(<AgentSwitcher open onClose={() => {}} agents={[]} onSelect={() => {}} />)
    expect(screen.getByTestId('ak-agent-switcher-empty')).toBeInTheDocument()
  })

  it('activeId · 对应项 aria-selected=true 且显示对勾', () => {
    const { container } = render(
      <AgentSwitcher
        open
        activeId="a2"
        onClose={() => {}}
        agents={sampleAgents}
        onSelect={() => {}}
      />,
    )
    const a2 = screen.getByTestId('ak-agent-switcher-item-a2')
    const a1 = screen.getByTestId('ak-agent-switcher-item-a1')
    expect(a2).toHaveAttribute('aria-selected', 'true')
    expect(a1).toHaveAttribute('aria-selected', 'false')
    expect(container.querySelector('.ak-agent-switcher__item--active')).toBeTruthy()
    expect(container.querySelectorAll('.ak-agent-switcher__check').length).toBe(1)
  })

  it('没传 onCreateNew · 不显示新建按钮', () => {
    render(<AgentSwitcher open onClose={() => {}} agents={sampleAgents} onSelect={() => {}} />)
    expect(screen.queryByTestId('ak-agent-switcher-create')).toBeNull()
  })

  it('传 onCreateNew · 显示新建按钮', () => {
    render(
      <AgentSwitcher
        open
        onClose={() => {}}
        agents={sampleAgents}
        onSelect={() => {}}
        onCreateNew={() => {}}
      />,
    )
    expect(screen.getByTestId('ak-agent-switcher-create')).toBeInTheDocument()
  })

  it('avatar 是 URL · 渲染 <img>', () => {
    const agents = [{ id: 'u1', name: 'URL Avatar', tagline: '...', avatar: 'https://example.com/a.png' }]
    const { container } = render(
      <AgentSwitcher open onClose={() => {}} agents={agents} onSelect={() => {}} />,
    )
    const img = container.querySelector('.ak-agent-switcher__avatar img')
    expect(img).toBeTruthy()
    expect(img?.getAttribute('src')).toBe('https://example.com/a.png')
  })
})

describe('AgentSwitcher (Web) · 行为', () => {
  it('选中 · onSelect + onClose 都触发 (按顺序)', () => {
    const onSelect = vi.fn()
    const onClose = vi.fn()
    render(
      <AgentSwitcher
        open
        onClose={onClose}
        agents={sampleAgents}
        onSelect={onSelect}
      />,
    )
    fireEvent.click(screen.getByTestId('ak-agent-switcher-item-a2'))
    expect(onSelect).toHaveBeenCalledOnce()
    expect(onSelect).toHaveBeenCalledWith('a2')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('点 backdrop · 触发 onClose', () => {
    const onClose = vi.fn()
    render(
      <AgentSwitcher open onClose={onClose} agents={sampleAgents} onSelect={() => {}} />,
    )
    fireEvent.click(screen.getByTestId('ak-agent-switcher-backdrop'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('点 × 关闭按钮 · 触发 onClose', () => {
    const onClose = vi.fn()
    render(
      <AgentSwitcher open onClose={onClose} agents={sampleAgents} onSelect={() => {}} />,
    )
    fireEvent.click(screen.getByTestId('ak-agent-switcher-close'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('ESC 键 · 触发 onClose', () => {
    const onClose = vi.fn()
    render(
      <AgentSwitcher open onClose={onClose} agents={sampleAgents} onSelect={() => {}} />,
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('open=false · ESC 不触发 onClose', () => {
    const onClose = vi.fn()
    render(
      <AgentSwitcher open={false} onClose={onClose} agents={sampleAgents} onSelect={() => {}} />,
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()
  })

  it('点 + 新建按钮 · 触发 onCreateNew + onClose', () => {
    const onCreateNew = vi.fn()
    const onClose = vi.fn()
    render(
      <AgentSwitcher
        open
        onClose={onClose}
        agents={sampleAgents}
        onSelect={() => {}}
        onCreateNew={onCreateNew}
      />,
    )
    fireEvent.click(screen.getByTestId('ak-agent-switcher-create'))
    expect(onCreateNew).toHaveBeenCalledOnce()
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('其他键 (Enter / Space) · 不触发 onClose', () => {
    const onClose = vi.fn()
    render(
      <AgentSwitcher open onClose={onClose} agents={sampleAgents} onSelect={() => {}} />,
    )
    fireEvent.keyDown(document, { key: 'Enter' })
    fireEvent.keyDown(document, { key: ' ' })
    expect(onClose).not.toHaveBeenCalled()
  })
})

describe('AgentSwitcher (Web) · 行为契约 (共享 spec)', () => {
  for (const sc of selectScenarios) {
    it(sc.name, () => {
      const onSelect = vi.fn()
      const onClose = vi.fn()
      render(
        <AgentSwitcher
          open
          activeId={sc.activeId}
          onClose={onClose}
          agents={sampleAgents}
          onSelect={onSelect}
        />,
      )
      fireEvent.click(screen.getByTestId(`ak-agent-switcher-item-${sc.clickId}`))
      if (sc.outcome === 'select-fired-and-close') {
        expect(onSelect).toHaveBeenCalledWith(sc.clickId)
        expect(onClose).toHaveBeenCalledOnce()
      }
    })
  }
})
