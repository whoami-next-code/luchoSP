"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiFetchAuth, requireAuthOrRedirect } from "@/lib/api";

const profileSchema = z.object({
  fullName: z.string().min(1, "Nombre requerido"),
  email: z.string().email("Correo inválido"),
  document: z.string().min(8, "DNI o RUC requerido"),
  phone: z.string().min(6, "Teléfono requerido"),
  address: z.string().min(5, "Dirección requerida"),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function PerfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: "", email: "", document: "", phone: "", address: "" },
  });

  useEffect(() => {
    const token = requireAuthOrRedirect("/perfil");
    if (!token) return;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetchAuth("/clientes/me");
        reset({
          fullName: data.fullName ?? "",
          email: data.email ?? "",
          document: data.document ?? "",
          phone: data.phone ?? "",
          address: data.address ?? "",
        });
      } catch (e: any) {
        setError(e?.message || "No se pudieron cargar tus datos");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [reset]);

  const onSubmit = async (values: ProfileForm) => {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      await apiFetchAuth("/clientes/me", {
        method: "PUT",
        body: JSON.stringify(values),
      });
      setMessage("Perfil actualizado correctamente");
      reset(values);
    } catch (e: any) {
      setError(e?.message || "No se pudieron guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold">Mi perfil</h1>
          <p className="text-sm text-gray-600">Completa tu información para agilizar compras y cotizaciones.</p>
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white border rounded-lg p-4 shadow-sm">
          {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{error}</div>}
          {message && <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded p-2">{message}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Nombre completo</label>
              <input
                {...register("fullName")}
                readOnly
                aria-readonly
                className="w-full border rounded px-3 py-2 bg-gray-50 text-gray-700"
              />
              <p className="text-[11px] text-gray-500">Viene de tu registro</p>
              {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Correo</label>
              <input
                {...register("email")}
                type="email"
                readOnly
                aria-readonly
                className="w-full border rounded px-3 py-2 bg-gray-50 text-gray-700"
              />
              {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="text-sm font-medium">DNI / RUC *</label>
              <input
                {...register("document")}
                className="w-full border rounded px-3 py-2"
                placeholder="DNI o RUC"
              />
              {errors.document && <p className="text-xs text-red-600">{errors.document.message}</p>}
            </div>
            <div className="sm:col-span-1">
              <label className="text-sm font-medium">Teléfono *</label>
              <input
                {...register("phone")}
                className="w-full border rounded px-3 py-2"
                placeholder="Teléfono"
              />
              {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
            </div>
            <div className="sm:col-span-1">
              <label className="text-sm font-medium">Dirección *</label>
              <input
                {...register("address")}
                className="w-full border rounded px-3 py-2"
                placeholder="Dirección completa"
              />
              {errors.address && <p className="text-xs text-red-600">{errors.address.message}</p>}
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => router.push("/mis-pedidos")}
              className="px-4 py-2 border rounded text-sm hover:bg-gray-50"
            >
              Ver mis pedidos
            </button>
            <button
              type="submit"
              disabled={saving || loading}
              className="px-4 py-2 bg-black text-white rounded text-sm disabled:opacity-60"
            >
              {saving ? "Guardando..." : isDirty ? "Guardar cambios" : "Guardar"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
