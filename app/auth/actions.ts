'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/types/domain'

function field(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === 'string' ? value.trim() : ''
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254
}

function authRedirect(path: string, type: 'error' | 'success', message: string): never {
  redirect(`${path}?${type}=${encodeURIComponent(message)}`)
}

function readableAuthError(message: string) {
  const lower = message.toLowerCase()

  if (lower.includes('invalid login credentials')) {
    return 'El correo o la contrasena no son correctos.'
  }

  if (lower.includes('already registered') || lower.includes('already exists')) {
    return 'Ya existe una cuenta registrada con ese correo.'
  }

  if (lower.includes('rate limit')) {
    return 'Se alcanzó el limite temporal de intentos. Espera unos minutos y vuelve a probar.'
  }

  if (lower.includes('email address') && lower.includes('invalid')) {
    return 'Supabase no acepta esa direccion de correo electronico.'
  }

  if (lower.includes('password')) {
    return 'La contrasena no cumple los requisitos de seguridad.'
  }

  return 'No se pudo completar la autenticacion. Intenta nuevamente.'
}

export async function register(formData: FormData) {
  const fullName = field(formData, 'name')
  const email = field(formData, 'email').toLowerCase()
  const password = field(formData, 'password')

  if (fullName.length < 2 || fullName.length > 100) {
    authRedirect('/register', 'error', 'Ingresa un nombre valido.')
  }

  if (!validEmail(email)) {
    authRedirect('/register', 'error', 'Ingresa un correo electronico valido.')
  }

  if (password.length < 6) {
    authRedirect('/register', 'error', 'La contrasena debe tener al menos 6 caracteres.')
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  })

  if (error) {
    authRedirect('/register', 'error', readableAuthError(error.message))
  }

  authRedirect(
    '/login',
    'success',
    'Cuenta creada correctamente. Si Supabase requiere confirmacion, revisa tu correo antes de iniciar sesión.'
  )
}

export async function login(formData: FormData) {
  const email = field(formData, 'email').toLowerCase()
  const password = field(formData, 'password')

  if (!validEmail(email) || !password) {
    authRedirect('/login', 'error', 'Ingresa tu correo y contrasena.')
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    authRedirect('/login', 'error', readableAuthError(error.message))
  }

  const userId = data.user?.id

  if (!userId) {
    authRedirect('/login', 'error', 'No se pudo validar la sesion iniciada.')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, is_active')
    .eq('id', userId)
    .maybeSingle()

  if (profileError) {
    authRedirect('/login', 'error', 'No se pudo obtener el perfil asociado a la cuenta.')
  }

  if (!profile) {
    await supabase.auth.signOut()
    authRedirect('/login', 'error', 'No existe un perfil asociado a esta cuenta.')
  }

  if (!profile.is_active) {
    await supabase.auth.signOut()
    authRedirect('/login', 'error', 'Tu cuenta esta desactivada. Contacta al gimnasio.')
  }

  const role = profile.role as UserRole
  const destination = role === 'OWNER' ? '/dashboard' : '/mi-rutina'

  revalidatePath('/', 'layout')
  authRedirect(destination, 'success', 'Sesion iniciada correctamente.')
}

export async function logout() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    authRedirect('/', 'error', 'No se pudo cerrar la sesion. Intenta nuevamente.')
  }

  revalidatePath('/', 'layout')
  authRedirect('/login', 'success', 'Sesión cerrada correctamente.')
}
