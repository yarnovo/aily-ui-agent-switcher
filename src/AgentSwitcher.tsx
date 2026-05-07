import type { AgentSwitcherProps } from './AgentSwitcher.types'
import './AgentSwitcher.css'

const cls = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ')

/** akong AgentSwitcher · Web · DOM `<button>` */
export function AgentSwitcher(props: AgentSwitcherProps) {
  const {
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    iconLeft,
    iconRight,
    children,
    onClick,
    onPress,
    type = 'button',
    ariaLabel,
  } = props

  const handle = () => {
    if (disabled || loading) return
    onClick?.()
    onPress?.()
  }

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={handle}
      className={cls(
        'ak-agent-switcher',
        `ak-agent-switcher--${variant}`,
        `ak-agent-switcher--${size}`,
        fullWidth && 'ak-agent-switcher--full-width',
        loading && 'ak-agent-switcher--loading',
      )}
    >
      {iconLeft && <span className="ak-agent-switcher__icon">{iconLeft}</span>}
      {children && <span>{children}</span>}
      {iconRight && <span className="ak-agent-switcher__icon">{iconRight}</span>}
    </button>
  )
}

export default AgentSwitcher
