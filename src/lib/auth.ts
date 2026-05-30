export interface User {
    id: string
    name: string
    email: string
    avatarUrl?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabaseClient: any = null
async function getClient() {
    if (supabaseClient) return supabaseClient
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        if (!supabaseUrl || !supabaseAnonKey) return null
        const { createBrowserClient } = await import('@supabase/ssr')
        supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
        return supabaseClient
    } catch { return null }
}

export const AuthManager = {
    async signup(name: string, email: string, password: string) {
        const supabase = await getClient()
        if (!supabase) return { success: false, error: 'Supabase not configured' }
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } },
        })
        if (error) return { success: false, error: error.message }
        if (!data.user) return { success: false, error: 'Signup failed' }
        return {
            success: true,
            user: {
                id: data.user.id,
                name: data.user.user_metadata?.name || name,
                email: data.user.email || email,
            },
        }
    },

    async signInWithGoogle() {
        const supabase = await getClient()
        if (!supabase) return { success: false, error: 'Supabase not configured' }
        const origin = typeof window !== 'undefined' ? window.location.origin : ''
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${origin}/auth/callback` },
        })
        if (error) return { success: false, error: error.message }
        return { success: true }
    },

    async login(email: string, password: string) {
        const supabase = await getClient()
        if (!supabase) return { success: false, error: 'Supabase not configured' }
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) return { success: false, error: error.message }
        if (!data.user) return { success: false, error: 'Login failed' }
        return {
            success: true,
            user: {
                id: data.user.id,
                name: data.user.user_metadata?.name || email.split('@')[0],
                email: data.user.email || email,
            },
        }
    },

    async logout() {
        const supabase = await getClient()
        if (supabase) await supabase.auth.signOut()
    },

    async current(): Promise<User | null> {
        const supabase = await getClient()
        if (!supabase) return null
        const { data } = await supabase.auth.getUser()
        if (!data.user) return null
        let avatarUrl = data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || undefined
        // Fallback to localStorage if Supabase metadata is missing the custom avatar
        if (!avatarUrl || avatarUrl.startsWith('data:')) {
            try {
                const cached = localStorage.getItem('avatar_' + data.user.id)
                if (cached) avatarUrl = cached
            } catch { /* ignore */ }
        }
        return {
            id: data.user.id,
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
            email: data.user.email || '',
            avatarUrl,
        }
    },

    async updateProfile(name: string): Promise<{ success: boolean; error?: string }> {
        const supabase = await getClient()
        if (!supabase) return { success: false, error: 'Supabase not configured' }
        const { error } = await supabase.auth.updateUser({ data: { name } })
        if (error) return { success: false, error: error.message }
        return { success: true }
    },

    async uploadAvatar(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
        try {
            // Resize to small thumbnail (150px) to keep metadata size down
            const thumbnail = await new Promise<string>((resolve, reject) => {
                const img = new Image()
                const url = URL.createObjectURL(file)
                img.onload = () => {
                    const max = 150
                    let w = img.width, h = img.height
                    if (w > h) { if (w > max) { h = h * max / w; w = max } }
                    else { if (h > max) { w = w * max / h; h = max } }
                    const canvas = document.createElement('canvas')
                    canvas.width = w; canvas.height = h
                    const ctx = canvas.getContext('2d')!
                    ctx.drawImage(img, 0, 0, w, h)
                    URL.revokeObjectURL(url)
                    resolve(canvas.toDataURL('image/jpeg', 0.8))
                }
                img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')) }
                img.src = url
            })
            const supabase = await getClient()
            if (supabase) {
                const { error } = await supabase.auth.updateUser({ data: { avatar_url: thumbnail } })
                if (error) return { success: false, error: error.message }
            }
            try {
                const u = await supabase?.auth.getUser()
                if (u?.data?.user?.id) localStorage.setItem('avatar_' + u.data.user.id, thumbnail)
            } catch { /* ignore */ }
            return { success: true, url: thumbnail }
        } catch (err) {
            return { success: false, error: err instanceof Error ? err.message : 'Upload failed' }
        }
    },
}
