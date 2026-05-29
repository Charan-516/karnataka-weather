export interface User {
    id: string
    name: string
    email: string
}

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
        return {
            id: data.user.id,
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
            email: data.user.email || '',
        }
    },
}
