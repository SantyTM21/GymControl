import Link from 'next/link'
import { logout } from '@/app/auth/actions'
import { NavigationLinks } from '@/components/NavigationLinks'
import { SubmitButton } from '@/components/SubmitButton'
import { getProfile } from '@/lib/auth/server'

const navigation = [
  { label: 'Inicio', href: '/' },
  { label: 'Rutinas', href: '/rutinas' },
  { label: 'Ejercicios', href: '/ejercicios' }
]

export async function Navbar() {
  const profile = await getProfile()
  const isLoggedIn = Boolean(profile)
  const roleNavigation =
    profile?.role === 'OWNER'
      ? [
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Clientes', href: '/dashboard/clientes' },
          { label: 'Pagos', href: '/dashboard/pagos' }
        ]
      : profile?.role === 'CLIENT'
        ? [
            { label: 'Mi rutina', href: '/mi-rutina' },
            { label: 'Mi progreso', href: '/mi-progreso' },
            { label: 'Mi membresia', href: '/mi-membresia' },
            { label: 'Mis pagos', href: '/mis-pagos' }
          ]
        : []
  const accountNavigation = profile ? [{ label: 'Perfil', href: '/perfil' }] : []
  const navigationItems = [...navigation, ...roleNavigation, ...accountNavigation]

  return (
    <header className='sticky top-0 z-50 border-b border-white/10 bg-zinc-950 text-white'>
      <nav
        className='mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10'
        aria-label='Navegacion principal'
      >
        <Link href='/' className='flex min-h-11 items-center gap-2.5' aria-label='GymControl - Inicio'>
          <span className='flex h-8 w-8 items-center justify-center bg-lime-400 text-sm font-black text-zinc-950'>
            GC
          </span>
          <span className='text-lg font-extrabold'>GymControl</span>
        </Link>

        <div className='hidden items-center gap-8 lg:flex'>
          <NavigationLinks items={navigationItems} />
        </div>

        {isLoggedIn ? (
          <form action={logout} className='hidden lg:block'>
            <SubmitButton
              pendingLabel='Saliendo...'
              className='bg-lime-400 px-4 py-2.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-lime-300'
            >
              Cerrar sesión
            </SubmitButton>
          </form>
        ) : (
          <div className='hidden items-center gap-3 lg:flex'>
            <Link
              href='/login'
              className='flex min-h-11 items-center px-4 text-sm font-semibold text-white transition-colors hover:text-lime-400'
            >
              Iniciar sesión
            </Link>
            <Link
              href='/register'
              className='bg-lime-400 px-4 py-2.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-lime-300'
            >
              Registrarse
            </Link>
          </div>
        )}

        <details className='group relative lg:hidden'>
          <summary
            className='flex h-11 w-11 cursor-pointer list-none items-center justify-center border border-zinc-700 text-white [&::-webkit-details-marker]:hidden'
            aria-label='Abrir menu'
          >
            <span className='sr-only'>Menu</span>
            <span className='flex w-5 flex-col gap-1.5 group-open:hidden' aria-hidden='true'>
              <span className='h-0.5 w-full bg-current' />
              <span className='h-0.5 w-full bg-current' />
              <span className='h-0.5 w-full bg-current' />
            </span>
            <span className='hidden text-2xl leading-none group-open:block' aria-hidden='true'>
              &times;
            </span>
          </summary>
          <div className='absolute right-0 top-12 w-64 border border-zinc-800 bg-zinc-950 p-3 shadow-2xl'>
            <div className='flex flex-col'>
              <NavigationLinks items={navigationItems} mobile />
              {isLoggedIn ? (
                <form action={logout}>
                  <SubmitButton
                    pendingLabel='Saliendo...'
                    className='mt-2 w-full bg-lime-400 px-3 py-3 text-center text-sm font-bold text-zinc-950'
                  >
                    Cerrar sesión
                  </SubmitButton>
                </form>
              ) : (
                <>
                  <Link href='/login' className='px-3 py-3 text-sm font-semibold text-white'>
                    Iniciar sesión
                  </Link>
                  <Link
                    href='/register'
                    className='mt-2 bg-lime-400 px-3 py-3 text-center text-sm font-bold text-zinc-950'
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </details>
      </nav>
    </header>
  )
}
