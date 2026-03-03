
import { createClient } from '@supabase/supabase-js';

// Access environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Detailed Debug Logging
console.log("Supabase Debug - URL:", supabaseUrl || "MISSING");
console.log("Supabase Debug - Key exists:", !!supabaseAnonKey);

// Safe Client Creation
const createSafeClient = () => {
    if (supabaseUrl && supabaseAnonKey && supabaseUrl !== "MISSING") {
        try {
            return createClient(supabaseUrl, supabaseAnonKey);
        } catch (e) {
            console.error("Failed to initialize Supabase client:", e);
        }
    }

    console.warn("Supabase is missing URL or Key, or initialization failed. Using Safe Mock Client.");

    // Helper to log errors when mock methods are called
    const logMissingEnv = (method: string) => {
        console.error(`Supabase Error: ${method} called but VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing.`);
        return Promise.resolve({ data: null, error: { message: "Environment variables missing" } });
    };

    // Return a Mock Client that mimics the needed interface but does nothing safely
    const mockClient = {
        from: (table: string) => ({
            select: () => {
                console.error(`Supabase Error: from('${table}').select() called but env vars are missing.`);
                return {
                    eq: () => ({
                        single: () => Promise.resolve({ data: null, error: { message: "Env missing" } }),
                        order: () => Promise.resolve({ data: [], error: { message: "Env missing" } }),
                    }),
                    order: () => Promise.resolve({ data: [], error: { message: "Env missing" } }),
                    single: () => Promise.resolve({ data: null, error: { message: "Env missing" } }),
                } as any;
            },
            insert: () => {
                console.error(`Supabase Error: from('${table}').insert() called but env vars are missing.`);
                return {
                    select: () => Promise.resolve({ data: [], error: { message: "Env missing" } })
                } as any;
            },
            update: () => {
                console.error(`Supabase Error: from('${table}').update() called but env vars are missing.`);
                return {
                    eq: () => Promise.resolve({ data: null, error: { message: "Env missing" } })
                } as any;
            },
            delete: () => {
                console.error(`Supabase Error: from('${table}').delete() called but env vars are missing.`);
                return {
                    eq: () => Promise.resolve({ data: null, error: { message: "Env missing" } })
                } as any;
            },
        }),
        auth: {
            getSession: () => {
                console.error("Supabase Error: auth.getSession() called but env vars are missing.");
                return Promise.resolve({ data: { session: null }, error: null });
            },
            onAuthStateChange: () => {
                console.error("Supabase Error: auth.onAuthStateChange() called but env vars are missing.");
                return { data: { subscription: { unsubscribe: () => { } } } };
            },
            signInWithPassword: () => logMissingEnv("auth.signInWithPassword"),
            signUp: () => logMissingEnv("auth.signUp"),
            signOut: () => {
                console.error("Supabase Error: auth.signOut() called but env vars are missing.");
                return Promise.resolve({ error: null });
            },
        }
    };

    return mockClient as any;
};

export const supabase = createSafeClient();

