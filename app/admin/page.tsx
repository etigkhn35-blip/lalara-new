"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      router.push("/admin/dashboard");
    } catch {
      setError("E-posta adresi veya şifre hatalı.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-brand">
        <div className="admin-login-brand-inner">
          <Image
            src="/lalara-logo.png"
            alt="La Lara Restaurant & Bar"
            width={320}
            height={118}
            priority
          />

          <div className="admin-login-brand-copy">
            <span>Management Studio</span>

            <h1>
              Your restaurant.
              <br />
              Your digital space.
            </h1>

            <p>
              Manage La Lara&apos;s content, imagery,
              menus and digital performance from one place.
            </p>
          </div>
        </div>

        <span className="admin-login-location">
          Yalıkavak · Bodrum
        </span>
      </section>

      <section className="admin-login-form-side">
        <div className="admin-login-form-wrap">
          <div className="admin-login-heading">
            <span>La Lara Admin</span>

            <h2>Welcome back.</h2>

            <p>
              Sign in to manage the website.
            </p>
          </div>

          <form
            className="admin-login-form"
            onSubmit={handleSubmit}
          >
            <label>
              <span>Email address</span>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="name@lalara.com.tr"
                autoComplete="email"
                required
              />
            </label>

            <label>
              <span>Password</span>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </label>

            {error && (
              <p className="admin-login-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Enter Management Studio"}
            </button>
          </form>

          <div className="admin-login-security">
            <span />

            <p>
              Secure management access
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}