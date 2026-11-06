import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { createContext, use, useEffect, useMemo, useState } from "react";

// Accounts are stored on this device only (there is no backend yet).
// Passwords are never stored in plain text, only as a salted SHA-256 hash.
const USERS_KEY = "praxis-users-v1";
const SESSION_KEY = "praxis-session-v1";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^[6-9]\d{9}$/;

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function normalizeMobile(mobile) {
  return mobile.replace(/\D/g, "").slice(-10);
}

async function hashPassword(password, salt) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${password}`);
}

export function validateSignUp({ fullName, email, mobile, password }) {
  const errors = {};
  if (fullName.trim().length < 2) errors.fullName = "Enter your full name";
  if (!EMAIL_RE.test(normalizeEmail(email))) errors.email = "Enter a valid email address";
  if (!MOBILE_RE.test(normalizeMobile(mobile))) errors.mobile = "Enter a valid 10-digit mobile number";
  if (password.length < 6) errors.password = "Password must be at least 6 characters";
  return errors;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([AsyncStorage.getItem(USERS_KEY), AsyncStorage.getItem(SESSION_KEY)])
      .then(([usersJson, session]) => {
        setUsers(usersJson ? JSON.parse(usersJson) : []);
        setUserId(session);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const value = useMemo(() => {
    const current = users.find((u) => u.id === userId) ?? null;
    // Never expose the password hash to screens.
    const user = current
      ? {
          id: current.id,
          fullName: current.fullName,
          email: current.email,
          mobile: current.mobile,
          createdAt: current.createdAt,
        }
      : null;

    async function saveUsers(next) {
      setUsers(next);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(next));
    }

    async function startSession(id) {
      setUserId(id);
      await AsyncStorage.setItem(SESSION_KEY, id);
    }

    return {
      loaded,
      user,

      async signUp(form) {
        const errors = validateSignUp(form);
        if (Object.keys(errors).length) return { errors };

        const email = normalizeEmail(form.email);
        const mobile = normalizeMobile(form.mobile);
        if (users.some((u) => u.email === email)) {
          return { errors: { email: "An account with this email already exists" } };
        }
        if (users.some((u) => u.mobile === mobile)) {
          return { errors: { mobile: "An account with this mobile number already exists" } };
        }

        const id = Crypto.randomUUID();
        const salt = Crypto.randomUUID();
        const newUser = {
          id,
          fullName: form.fullName.trim(),
          email,
          mobile,
          salt,
          passwordHash: await hashPassword(form.password, salt),
          createdAt: new Date().toISOString(),
        };
        await saveUsers([...users, newUser]);
        await startSession(id);
        return { errors: null };
      },

      async signIn(identifier, password) {
        const value = identifier.trim();
        if (!value || !password) return { error: "Enter your email or mobile number and password" };

        const account = value.includes("@")
          ? users.find((u) => u.email === normalizeEmail(value))
          : users.find((u) => u.mobile === normalizeMobile(value));
        if (!account) return { error: "No account found. Please sign up first." };

        const hash = await hashPassword(password, account.salt);
        if (hash !== account.passwordHash) return { error: "Incorrect password. Please try again." };

        await startSession(account.id);
        return { error: null };
      },

      async signOut() {
        setUserId(null);
        await AsyncStorage.removeItem(SESSION_KEY);
      },
    };
  }, [users, userId, loaded]);

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const auth = use(AuthContext);
  if (!auth) throw new Error("useAuth must be used inside AuthProvider");
  return auth;
}
