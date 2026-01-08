"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { resetPassword } = useAuth();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') || '');
    
    try {
      await resetPassword(email);
      setMessage('Si el correo existe, se ha enviado un enlace para restablecer la contraseña.');
    } catch (err: any) {
      setError(err.message || 'No se pudo procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-sm px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-4">Recuperar contraseña</h1>
      <form onSubmit={submit} className="space-y-3">
        <input name="email" type="email" placeholder="Correo electrónico" required className="w-full border rounded px-3 py-2" />
        <button disabled={loading} className="inline-flex items-center justify-center rounded-md bg-black text-white px-3 py-2 text-sm disabled:opacity-50">
          {loading ? 'Enviando...' : 'Enviar enlace'}
        </button>
        {message && <div className="text-sm text-emerald-700">{message}</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
      </form>
    </section>
  );
}

