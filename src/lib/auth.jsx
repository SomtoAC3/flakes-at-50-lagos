import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "./supabaseClient";

const AuthContext = createContext(null);

/**
 * Wraps the whole app. Tracks the Supabase Auth session and the matching
 * `guests` profile row (which carries is_organizer). Works even when
 * Supabase isn't configured yet — session/profile just stay null and
 * `configured` is false, so pages can fall back to read-only/mock content.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  // The user id whose profile is loaded; while it lags the session, the profile is still loading.
  const [loadedFor, setLoadedFor] = useState(null);
  const loadingFor = useRef(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const loadProfile = useCallback(async (userId) => {
    if (!supabase || !userId) {
      setProfile(null);
      setLoadedFor(null);
      return;
    }
    loadingFor.current = userId;
    const { data, error } = await supabase.from("guests").select("*").eq("id", userId).maybeSingle();
    if (loadingFor.current !== userId) return;
    setLoadedFor(userId);
    if (error) {
      // RLS or network hiccup — keep session but leave profile null, pages
      // that need it will show a retry rather than crash.
      console.error("[auth] failed to load guest profile:", error.message);
      setProfile(null);
      return;
    }
    setProfile(data);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      if (data.session?.user?.id) {
        loadProfile(data.session.user.id).finally(() => active && setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      // Token refreshes fire this too; only reload when the signed-in user changes.
      if (newSession?.user?.id && newSession.user.id !== loadingFor.current) {
        loadProfile(newSession.user.id);
      } else if (!newSession) {
        loadingFor.current = null;
        setProfile(null);
        setLoadedFor(null);
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signInWithMagicLink = useCallback(async (email, redirectPath = "/") => {
    if (!supabase) throw new Error("Supabase is not configured yet.");
    const emailRedirectTo = `${window.location.origin}${redirectPath}`;
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo } });
    if (error) throw error;
  }, []);

  // Guests sign in with a code typed into the app rather than a link: on iPhone
  // a link opens Safari, which doesn't share its session with the home-screen app.
  const sendSignInCode = useCallback(async (email) => {
    if (!supabase) throw new Error("Supabase is not configured yet.");
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim().toLowerCase() });
    if (error) throw error;
  }, []);

  const verifySignInCode = useCallback(async (email, code) => {
    if (!supabase) throw new Error("Supabase is not configured yet.");
    const { error } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: code, type: "email" });
    if (error) throw error;
  }, []);

  const signInWithPassword = useCallback(async (email, password) => {
    if (!supabase) throw new Error("Supabase is not configured yet.");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(() => {
    if (session?.user?.id) return loadProfile(session.user.id);
    return Promise.resolve();
  }, [session, loadProfile]);

  const value = useMemo(
    () => ({
      configured: isSupabaseConfigured,
      loading: loading || Boolean(session?.user?.id && loadedFor !== session.user.id),
      session,
      user: session?.user ?? null,
      profile,
      isOrganizer: Boolean(profile?.is_organizer),
      signInWithMagicLink,
      sendSignInCode,
      verifySignInCode,
      signInWithPassword,
      signOut,
      refreshProfile,
    }),
    [loading, loadedFor, session, profile, signInWithMagicLink, sendSignInCode, verifySignInCode, signInWithPassword, signOut, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
