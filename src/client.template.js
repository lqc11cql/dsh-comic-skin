/**
 * Comic sticker skin — browser half of the bundle.
 *
 * Adds the neo-brutalist manga look on top of the built-in light palette:
 *  - one global stylesheet scoped under html[data-dsh-comic];
 *  - a persisted on/off switch (localStorage, per browser);
 *  - a "Comic" sticker in the composer dock and a settings row under
 *    Settings → General, both driving the same state.
 *
 * No Harness client package is imported: only react from the module table,
 * ctx.slots, ctx.locale and ctx.effect.
 */

window.__ModuleLoader__.load({
  id: 'dsh-comic-skin',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const CSS = __THEME_CSS__

    const NAMESPACE = 'comic-skin'
    const STORAGE_KEY = 'dsh.comic-skin.enabled'
    const ATTRIBUTE = 'data-dsh-comic'

    const zh = {
      'row.title': '漫画贴纸主题',
      'row.description': '新粗野主义漫画皮肤：墨线描边、硬投影、网点纸底与贴纸控件。开启后立即应用到整个界面，关闭即恢复原主题；皮肤自带配色，外观里的浅色/深色选项在关闭后生效。',
      'row.hint': '也可以点输入框下方的「漫画」贴纸快速切换（仅本浏览器生效）。',
      'row.on': '已开启',
      'row.off': '已关闭',
      'dock.label': '漫画',
      'dock.title': '切换漫画贴纸主题',
    }

    const en = {
      'row.title': 'Comic sticker skin',
      'row.description': 'Neo-brutalist comic skin: ink outlines, hard offset shadows, halftone paper and sticker controls. Applies to the whole interface immediately; turn it off to restore the previous theme. The skin brings its own palette, so Light/Dark takes effect after you turn it off.',
      'row.hint': 'You can also use the Comic sticker under the composer. The choice is stored in this browser.',
      'row.on': 'On',
      'row.off': 'Off',
      'dock.label': 'Comic',
      'dock.title': 'Toggle the comic sticker skin',
    }

    const listeners = new Set()
    let enabled = true

    const readStored = () => {
      try {
        return window.localStorage.getItem(STORAGE_KEY) !== 'off'
      } catch {
        return true
      }
    }

    const paint = () => {
      const root = document.documentElement
      if (enabled) root.setAttribute(ATTRIBUTE, 'on')
      else root.removeAttribute(ATTRIBUTE)
    }

    const emit = () => {
      for (const listener of listeners) {
        try {
          listener(enabled)
        } catch {
          /* one broken subscriber must not block the others */
        }
      }
    }

    const setSkin = (next, persist) => {
      if (enabled === next) return
      enabled = next
      if (persist) {
        try {
          window.localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off')
        } catch {
          /* private mode: the skin still works for this page */
        }
      }
      paint()
      emit()
    }

    const useSkinState = () => {
      const [value, setValue] = React.useState(enabled)
      React.useEffect(() => {
        listeners.add(setValue)
        setValue(enabled)
        return () => {
          listeners.delete(setValue)
        }
      }, [])
      return value
    }

    function ComicDock({ t: translate }) {
      const t = typeof translate === 'function' ? translate : (key) => key
      const on = useSkinState()
      return h('button', {
        type: 'button',
        className: 'dsh-comic-dock',
        'aria-pressed': on,
        title: t('dock.title'),
        onClick: () => setSkin(!on, true),
      },
        h('span', { className: 'dsh-comic-dock-star', 'aria-hidden': 'true' }, '\u2605'),
        h('span', null, t('dock.label')),
      )
    }

    function ComicRow({ t: translate }) {
      const t = typeof translate === 'function' ? translate : (key) => key
      const on = useSkinState()
      return h('div', { className: 'dsh-comic-row' },
        h('div', { className: 'dsh-comic-row-copy' },
          h('div', { className: 'dsh-comic-row-title' },
            t('row.title'),
            h('span', { className: 'dsh-comic-swatches', 'aria-hidden': 'true' },
              h('i', { style: { background: '#ff5a1f' } }),
              h('i', { style: { background: '#ffd166' } }),
              h('i', { style: { background: '#2fa96a' } }),
              h('i', { style: { background: '#7a5cf0' } }),
            ),
          ),
          h('div', { className: 'dsh-comic-row-desc' }, t('row.description')),
          h('div', { className: 'dsh-comic-row-hint' }, t('row.hint')),
        ),
        h('button', {
          type: 'button',
          className: on ? 'dsh-comic-switch is-on' : 'dsh-comic-switch',
          'aria-pressed': on,
          onClick: () => setSkin(!on, true),
        },
          h('span', { className: 'dsh-comic-switch-dot', 'aria-hidden': 'true' }),
          h('span', null, on ? t('row.on') : t('row.off')),
        ),
      )
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => {
          const style = document.createElement('style')
          style.dataset.pluginCss = 'dsh-comic-skin/theme.css'
          style.textContent = CSS
          document.head.append(style)
          return () => style.remove()
        }, 'comic-skin: stylesheet')

        ctx.effect(() => ctx.locale.register(NAMESPACE, { zh, en }), 'comic-skin: copy')

        ctx.effect(() => {
          enabled = readStored()
          paint()
          const onStorage = (event) => {
            if (event.key !== STORAGE_KEY) return
            enabled = event.newValue !== 'off'
            paint()
            emit()
          }
          window.addEventListener('storage', onStorage)
          return () => {
            window.removeEventListener('storage', onStorage)
            document.documentElement.removeAttribute(ATTRIBUTE)
            listeners.clear()
          }
        }, 'comic-skin: skin state')

        ctx.slots.inject('settings.general.item', () => ctx.slots.register({
          name: 'settings.general.item',
          id: 'comic-skin',
          order: 12,
          locale: NAMESPACE,
        }, ComicRow))

        ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({
          name: 'conversation.composer.dock',
          id: 'comic-skin',
          order: 40,
          locale: NAMESPACE,
        }, ComicDock))
      },
    }
  },
})
