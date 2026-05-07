/**
 * akong AgentSwitcher · 数字角色切换器 (drawer-style modal)
 *
 * Web 跟 RN 共用同一份 props · 一份 spec 两端实现
 */

export interface AgentSwitcherItem {
  /** 角色唯一 id */
  id: string
  /** 角色显示名 (如 "阿空小喜") */
  name: string
  /** 一句话简介 (line-clamp-1) */
  tagline: string
  /** 头像 URL · 也接受 emoji 字符 (用 <img> / RN <Image>) */
  avatar: string
}

export interface AgentSwitcherProps {
  /** 是否打开 */
  open: boolean
  /** 关闭回调 (点 backdrop / × / 选中后 / ESC 都会触发) */
  onClose: () => void
  /** 角色列表 */
  agents: AgentSwitcherItem[]
  /** 当前激活的角色 id (右侧对勾) */
  activeId?: string
  /** 选中回调 (会自动随后触发 onClose) */
  onSelect: (id: string) => void
  /** 新建角色回调 (不传则不显示底部 + 新建按钮) */
  onCreateNew?: () => void
  /** 标题 · 默认 "切换数字角色" */
  title?: string
}
