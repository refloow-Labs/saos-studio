import React from 'react'

/**
 * Strips Greek tonos / accent diacritics from rendered text. Standard
 * convention for ALL CAPS Greek typography — accents are visual aids for
 * lowercase reading and are dropped on majuscule display.
 *
 * Use as a wrapper around any headline text. Source remains correctly
 * accented (good for accessibility tools and search) — only the rendered
 * output is stripped.
 */

const stripTonos = (s: string): string =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC')

function transform(node: React.ReactNode): React.ReactNode {
  return React.Children.map(node, (child) => {
    if (typeof child === 'string') return stripTonos(child)
    if (React.isValidElement<{ children?: React.ReactNode }>(child)) {
      return React.cloneElement(
        child,
        {},
        transform(child.props.children),
      )
    }
    return child
  })
}

export default function NoTonos({ children }: { children: React.ReactNode }) {
  return <>{transform(children)}</>
}
