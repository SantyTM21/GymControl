'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type NavigationItem = {
  label: string
  href: string
}

type NavigationLinksProps = {
  items: NavigationItem[]
  mobile?: boolean
}

function matchesPath(pathname: string, href: string) {
  return pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))
}

export function NavigationLinks({ items, mobile = false }: NavigationLinksProps) {
  const pathname = usePathname()
  const activeHref = items
    .filter((item) => matchesPath(pathname, item.href))
    .sort((first, second) => second.href.length - first.href.length)[0]?.href

  return items.map((item) => {
    const isActive = item.href === activeHref

    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={isActive ? 'page' : undefined}
        className={
          mobile
            ? `border-b border-zinc-800 px-3 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-l-2 border-lime-400 bg-zinc-900 text-lime-400'
                  : 'text-zinc-200 hover:text-lime-400'
              }`
            : `flex min-h-11 items-center border-b-2 px-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-lime-400 text-lime-400'
                  : 'border-transparent text-zinc-300 hover:text-lime-400'
              }`
        }
      >
        {item.label}
      </Link>
    )
  })
}
