/**
 * akong AgentSwitcher · React Native 实现
 *
 * Modal + Animated.View slide-up · BackdropView 半透明黑
 * Metro bundler 默认按 `.native.tsx` 后缀解析 RN 端
 */

import { useEffect, useRef } from 'react'
import {
  Modal,
  View,
  Text,
  Pressable,
  Animated,
  Image,
  ScrollView,
  useColorScheme,
  Easing,
  type ImageSourcePropType,
} from 'react-native'
import { tokens } from '@akong/tokens'
import type { AgentSwitcherProps, AgentSwitcherItem } from './AgentSwitcher.types'

function isUrl(s: string) {
  return /^https?:\/\//.test(s) || s.startsWith('data:') || s.startsWith('/')
}

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

  const scheme = (useColorScheme() ?? 'light') as 'light' | 'dark'
  const t = scheme === 'dark' ? tokens.dark : tokens.light

  const slide = useRef(new Animated.Value(0)).current
  const fade = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.timing(slide, {
          toValue: 1,
          duration: tokens.duration.slow,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fade, {
          toValue: 1,
          duration: tokens.duration.base,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      slide.setValue(0)
      fade.setValue(0)
    }
  }, [open, slide, fade])

  const handleSelect = (id: string) => {
    onSelect(id)
    onClose()
  }

  const translateY = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  })

  return (
    <Modal
      visible={open}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.45)',
          opacity: fade,
        }}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={onClose}
          accessibilityLabel="关闭"
          testID="ak-agent-switcher-backdrop"
        />
      </Animated.View>

      {/* Drawer */}
      <Animated.View
        accessibilityViewIsModal
        accessibilityLabel={title}
        testID="ak-agent-switcher-drawer"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          alignSelf: 'center',
          width: '100%',
          maxWidth: 480,
          marginHorizontal: 'auto',
          backgroundColor: t.bgElevated,
          borderTopLeftRadius: tokens.radius['2xl'],
          borderTopRightRadius: tokens.radius['2xl'],
          maxHeight: '85%',
          transform: [{ translateY }],
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: -4 },
          elevation: 16,
        }}
      >
        {/* Grabber */}
        <View
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: t.border,
            alignSelf: 'center',
            marginTop: tokens.space[3],
            marginBottom: tokens.space[2],
          }}
        />

        {/* Header */}
        <View
          style={{
            position: 'relative',
            paddingHorizontal: tokens.space[12],
            paddingTop: tokens.space[2],
            paddingBottom: tokens.space[3],
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: tokens.text.md,
              fontWeight: tokens.weight.semibold,
              color: t.fg,
            }}
          >
            {title}
          </Text>
          <Pressable
            accessibilityLabel="关闭"
            accessibilityRole="button"
            testID="ak-agent-switcher-close"
            onPress={onClose}
            style={({ pressed }: { pressed: boolean }) => ({
              position: 'absolute',
              right: tokens.space[3],
              top: tokens.space[2],
              width: 32,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: tokens.radius.full,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ color: t.fgSubtle, fontSize: 20, lineHeight: 20 }}>×</Text>
          </Pressable>
        </View>

        {/* List */}
        {agents.length === 0 ? (
          <View
            style={{
              paddingVertical: tokens.space[8],
              paddingHorizontal: tokens.space[4],
              alignItems: 'center',
            }}
          >
            <Text
              testID="ak-agent-switcher-empty"
              style={{ color: t.fgSubtle, fontSize: tokens.text.sm }}
            >
              还没有数字角色
            </Text>
          </View>
        ) : (
          <ScrollView
            style={{ flexShrink: 1 }}
            contentContainerStyle={{
              paddingHorizontal: tokens.space[2],
              paddingTop: tokens.space[1],
              paddingBottom: tokens.space[2],
            }}
          >
            {agents.map((a) => (
              <AgentRow
                key={a.id}
                agent={a}
                active={a.id === activeId}
                onPress={() => handleSelect(a.id)}
                tone={t}
              />
            ))}
          </ScrollView>
        )}

        {/* Footer · 新建 */}
        {onCreateNew && (
          <View
            style={{
              paddingHorizontal: tokens.space[4],
              paddingTop: tokens.space[3],
              paddingBottom: tokens.space[4],
              borderTopWidth: 1,
              borderTopColor: t.borderSubtle,
            }}
          >
            <Pressable
              testID="ak-agent-switcher-create"
              accessibilityRole="button"
              accessibilityLabel="新建角色"
              onPress={() => {
                onCreateNew()
                onClose()
              }}
              style={({ pressed }: { pressed: boolean }) => ({
                minHeight: 48,
                paddingHorizontal: tokens.space[4],
                backgroundColor: t.bgSubtle,
                borderRadius: tokens.radius.full,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: tokens.space[2],
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ color: t.fg, fontSize: tokens.text.base, fontWeight: tokens.weight.medium }}>
                + 新建角色
              </Text>
            </Pressable>
          </View>
        )}
      </Animated.View>
    </Modal>
  )
}

function AgentRow({
  agent,
  active,
  onPress,
  tone,
}: {
  agent: AgentSwitcherItem
  active: boolean
  onPress: () => void
  tone: typeof tokens.light
}) {
  const avatarSrc: ImageSourcePropType | null = isUrl(agent.avatar)
    ? { uri: agent.avatar }
    : null

  return (
    <Pressable
      testID={`ak-agent-switcher-item-${agent.id}`}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }: { pressed: boolean }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: tokens.space[3],
        minHeight: 56,
        paddingVertical: tokens.space[2],
        paddingHorizontal: tokens.space[3],
        borderRadius: tokens.radius.lg,
        backgroundColor: active ? tone.bgSubtle : 'transparent',
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: tone.bgSubtle,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {avatarSrc ? (
          <Image source={avatarSrc} style={{ width: 44, height: 44 }} />
        ) : (
          <Text style={{ fontSize: tokens.text.lg, color: tone.fg }}>{agent.avatar}</Text>
        )}
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: tokens.text.base,
            fontWeight: tokens.weight.semibold,
            color: tone.fg,
          }}
        >
          {agent.name}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontSize: tokens.text.sm,
            color: tone.fgSubtle,
            marginTop: 2,
          }}
        >
          {agent.tagline}
        </Text>
      </View>
      {active && (
        <Text
          accessibilityLabel="已选中"
          style={{ color: tone.fg, fontSize: tokens.text.md, marginLeft: tokens.space[2] }}
        >
          ✓
        </Text>
      )}
    </Pressable>
  )
}

export default AgentSwitcher
