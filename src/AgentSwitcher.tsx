import { useEffect, useRef } from 'react'
import type { AgentSwitcherProps } from './AgentSwitcher.types'
import './AgentSwitcher.css'

const cls = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ')

/** akong AgentSwitcher · Web · drawer-style modal · DOM */
export function AgentSwitcher(props: AgentSwitcherProps) {
  const {
    open,
    onClose,
    agents,
    activeId,
    onSelect,
    onCreateNew,
    title = '切换数字角色',
  } = props

  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  // ESC 关闭
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  if (!open) return null

  const handleSelect = (id: string) => {
    onSelect(id)
    onClose()
  }

  return (
    <div role="presentation">
      <div
        className="ak-agent-switcher__backdrop"
        data-testid="ak-agent-switcher-backdrop"
        onClick={onClose}
      />
      <div
        className="ak-agent-switcher__drawer"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        data-testid="ak-agent-switcher-drawer"
      >
        <div className="ak-agent-switcher__grabber" aria-hidden="true" />
        <div className="ak-agent-switcher__header">
          <h2 className="ak-agent-switcher__title">{title}</h2>
          <button
            type="button"
            className="ak-agent-switcher__close"
            aria-label="关闭"
            data-testid="ak-agent-switcher-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {agents.length === 0 ? (
          <div className="ak-agent-switcher__empty" data-testid="ak-agent-switcher-empty">
            还没有数字角色
          </div>
        ) : (
          <ul className="ak-agent-switcher__list" role="listbox" aria-label={title}>
            {agents.map((a) => {
              const isActive = a.id === activeId
              return (
                <li key={a.id} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    data-testid={`ak-agent-switcher-item-${a.id}`}
                    className={cls(
                      'ak-agent-switcher__item',
                      isActive && 'ak-agent-switcher__item--active',
                    )}
                    onClick={() => handleSelect(a.id)}
                  >
                    <span className="ak-agent-switcher__avatar" aria-hidden="true">
                      {/^https?:\/\//.test(a.avatar) || a.avatar.startsWith('data:') || a.avatar.startsWith('/') ? (
                        <img src={a.avatar} alt="" />
                      ) : (
                        <span>{a.avatar}</span>
                      )}
                    </span>
                    <span className="ak-agent-switcher__meta">
                      <span className="ak-agent-switcher__name">{a.name}</span>
                      <span className="ak-agent-switcher__tagline">{a.tagline}</span>
                    </span>
                    {isActive && (
                      <span className="ak-agent-switcher__check" aria-label="已选中">
                        ✓
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        {onCreateNew && (
          <div className="ak-agent-switcher__footer">
            <button
              type="button"
              className="ak-agent-switcher__create"
              data-testid="ak-agent-switcher-create"
              onClick={() => {
                onCreateNew()
                onClose()
              }}
            >
              <span aria-hidden="true">+</span>
              <span>新建角色</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AgentSwitcher
