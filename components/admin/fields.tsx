"use client";

import { ArrowDown, ArrowUp, ImageOff, Loader2, Plus, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import type { ActionState } from "@/lib/actions/state";
import { getUploadSignature } from "@/lib/actions/uploads";
import { slugify } from "@/lib/utils";
import { Field, fieldProps, inputClass } from "./form";

/** Título + slug. El slug se genera solo hasta que el usuario lo edita a mano. */
export function TitleSlugFields({
  titleLabel = "Título",
  titleName = "title",
  defaultTitle = "",
  defaultSlug = "",
  errors,
}: {
  titleLabel?: string;
  titleName?: string;
  defaultTitle?: string;
  defaultSlug?: string;
  errors?: ActionState["errors"];
}) {
  const [title, setTitle] = useState(defaultTitle);
  const [slug, setSlug] = useState(defaultSlug);
  const [touched, setTouched] = useState(Boolean(defaultSlug));
  const value = touched ? slug : slugify(title);

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Field label={titleLabel} name={titleName} errors={errors}>
        <input
          {...fieldProps(titleName, errors)}
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field
        label="Slug"
        name="slug"
        errors={errors}
        hint={
          touched ? (
            <button type="button" className="underline hover:text-paper" onClick={() => setTouched(false)}>
              Volver a generar desde el {titleLabel.toLowerCase()}
            </button>
          ) : (
            "Se genera automáticamente; puedes editarlo."
          )
        }
      >
        <div className="flex items-center rounded-xl border border-line bg-ink-2 focus-within:border-paper/60">
          <span className="pl-3.5 text-sm text-muted">/</span>
          <input
            {...fieldProps("slug", errors)}
            value={value}
            onChange={(e) => {
              setTouched(true);
              setSlug(e.target.value);
            }}
            onBlur={() => setSlug(slugify(value))}
            className="w-full bg-transparent px-1.5 py-2.5 font-mono text-sm outline-none"
          />
        </div>
      </Field>
    </div>
  );
}

const isPreviewable = (url: string) => /^https?:\/\/\S+$/i.test(url) || url.startsWith("/");

/** Campo de URL de imagen con vista previa y, opcionalmente, subida a Cloudinary. */
export function ImageUrlField({
  name,
  label,
  defaultValue,
  hint,
  errors,
  kind = "image",
  upload,
  preview = "thumb",
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  hint?: string;
  errors?: ActionState["errors"];
  kind?: "image" | "video";
  /** Si se indica, muestra el botón "Subir imagen" (Cloudinary) y guarda en esa carpeta. */
  upload?: { folder: UploadFolderKey; enabled: boolean };
  /** "portrait" muestra una vista previa grande 4:5 (ideal para la foto de perfil). */
  preview?: "thumb" | "portrait";
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [broken, setBroken] = useState(false);
  const show = url && isPreviewable(url);

  const media =
    show && !broken ? (
      kind === "video" ? (
        <video src={url} muted playsInline className="size-full object-cover" onError={() => setBroken(true)} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- vista previa de cualquier origen
        <img src={url} alt="" className="size-full object-cover" onError={() => setBroken(true)} />
      )
    ) : (
      <ImageOff className="size-5 text-muted" aria-hidden />
    );

  const setUploaded = (newUrl: string) => {
    setUrl(newUrl);
    setBroken(false);
  };

  return (
    <Field label={label} name={name} errors={errors} hint={hint ?? "Pega una URL pública (https://…) o una ruta de /public."}>
      <div className={preview === "portrait" ? "flex flex-col gap-4 sm:flex-row sm:items-start" : "flex gap-3"}>
        <div
          className={
            preview === "portrait"
              ? "relative flex aspect-[4/5] w-36 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-line bg-ink-3"
              : "relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-ink-3"
          }
        >
          {media}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex gap-2">
            <input
              {...fieldProps(name, errors)}
              type="text"
              inputMode="url"
              placeholder="https://…"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setBroken(false);
              }}
              className={inputClass}
            />
            {url && (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="shrink-0 rounded-xl border border-line px-3 text-muted hover:text-red-400"
                aria-label={`Quitar ${label.toLowerCase()}`}
                title="Quitar"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          {upload && kind === "image" && <UploadButton folder={upload.folder} enabled={upload.enabled} onUploaded={setUploaded} />}
        </div>
      </div>
    </Field>
  );
}

type UploadFolderKey = "avatar" | "projects";

const MAX_UPLOAD_MB = 10;

/** Sube una imagen directo a Cloudinary (con firma del servidor) y devuelve su URL. */
function UploadButton({
  folder,
  enabled,
  onUploaded,
}: {
  folder: UploadFolderKey;
  enabled: boolean;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleFile = async (file: File) => {
    setError(null);
    setDone(false);
    if (!file.type.startsWith("image/")) return setError("El archivo debe ser una imagen (JPG, PNG, WebP, AVIF o GIF).");
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) return setError(`La imagen supera ${MAX_UPLOAD_MB} MB.`);

    setProgress(0);
    const signed = await getUploadSignature(folder);
    if (!signed.ok) {
      setProgress(null);
      return setError(signed.message);
    }

    const body = new FormData();
    body.append("file", file);
    body.append("api_key", signed.data.apiKey);
    body.append("timestamp", String(signed.data.timestamp));
    body.append("signature", signed.data.signature);
    body.append("folder", signed.data.folder);
    body.append("allowed_formats", signed.data.allowedFormats);

    // XMLHttpRequest para poder mostrar el progreso de la subida.
    const xhr = new XMLHttpRequest();
    xhr.open("POST", signed.data.uploadUrl);
    xhr.upload.onprogress = (e) => e.lengthComputable && setProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      setProgress(null);
      try {
        const res = JSON.parse(xhr.responseText) as { secure_url?: string; error?: { message?: string } };
        if (xhr.status >= 200 && xhr.status < 300 && res.secure_url) {
          onUploaded(res.secure_url);
          setDone(true);
        } else {
          setError(res.error?.message ?? "Cloudinary rechazó la imagen.");
        }
      } catch {
        setError("Respuesta inválida de Cloudinary.");
      }
    };
    xhr.onerror = () => {
      setProgress(null);
      setError("No se pudo conectar con Cloudinary.");
    };
    xhr.send(body);
  };

  if (!enabled) {
    return (
      <p className="text-xs text-muted">
        Para subir archivos, configura Cloudinary (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET).
      </p>
    );
  }

  const uploading = progress !== null;
  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void handleFile(file);
        }}
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-paper/90 transition-colors hover:border-paper/50 disabled:cursor-wait disabled:opacity-60"
        >
          {uploading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Upload className="size-4" aria-hidden />}
          {uploading ? `Subiendo… ${progress}%` : "Subir imagen"}
        </button>
        <span className="text-xs text-muted">JPG, PNG, WebP, AVIF o GIF · máx. {MAX_UPLOAD_MB} MB</span>
      </div>
      {uploading && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full bg-accent transition-[width]" style={{ width: `${progress}%` }} />
        </div>
      )}
      {done && <p className="text-xs text-accent">Imagen subida. Recuerda guardar los cambios.</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

/** Color con selector nativo + valor hex editable. */
export function ColorField({
  name,
  label,
  defaultValue,
  errors,
  allowEmpty = false,
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  errors?: ActionState["errors"];
  allowEmpty?: boolean;
  hint?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? (allowEmpty ? "" : "#c6ff3d"));
  const valid = /^#[0-9a-f]{6}$/i.test(value);
  return (
    <Field label={label} name={name} errors={errors} hint={hint}>
      <div className="flex items-center gap-3">
        <input
          type="color"
          aria-label={`${label} (selector)`}
          value={valid ? value : "#000000"}
          onChange={(e) => setValue(e.target.value)}
          className="size-11 shrink-0 cursor-pointer rounded-lg border border-line bg-ink-2 p-1"
        />
        <input
          {...fieldProps(name, errors)}
          value={value}
          placeholder={allowEmpty ? "Sin color" : "#c6ff3d"}
          onChange={(e) => setValue(e.target.value)}
          className={`${inputClass} font-mono uppercase`}
        />
      </div>
    </Field>
  );
}

/** Lista editable de URLs para la galería (cada URL se envía como `gallery`). */
export function GalleryField({ defaultValue, errors }: { defaultValue: string[]; errors?: ActionState["errors"] }) {
  const [items, setItems] = useState(() => defaultValue.map((url, i) => ({ key: i, url })));
  const [nextKey, setNextKey] = useState(defaultValue.length);

  const update = (key: number, url: string) => setItems((list) => list.map((it) => (it.key === key ? { ...it, url } : it)));
  const remove = (key: number) => setItems((list) => list.filter((it) => it.key !== key));
  const move = (index: number, delta: number) =>
    setItems((list) => {
      const target = index + delta;
      if (target < 0 || target >= list.length) return list;
      const copy = [...list];
      [copy[index], copy[target]] = [copy[target]!, copy[index]!];
      return copy;
    });
  const add = () => {
    setItems((list) => [...list, { key: nextKey, url: "" }]);
    setNextKey((k) => k + 1);
  };

  const errorText = errors && Object.entries(errors).find(([k]) => k.startsWith("gallery"))?.[1]?.[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-paper/90">Galería</span>
        <span className="text-xs text-muted">{items.length} imágenes</span>
      </div>
      {items.length === 0 && <p className="text-sm text-muted">Sin imágenes. Agrega URLs para mostrar una galería en el detalle.</p>}
      <ul className="flex flex-col gap-2">
        {items.map((item, i) => (
          <li key={item.key} className="flex items-center gap-2">
            <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-ink-3">
              {item.url && isPreviewable(item.url) ? (
                // eslint-disable-next-line @next/next/no-img-element -- vista previa de cualquier origen
                <img src={item.url} alt="" className="size-full object-cover" />
              ) : (
                <ImageOff className="size-4 text-muted" aria-hidden />
              )}
            </div>
            <input
              name="gallery"
              aria-label={`Imagen ${i + 1} de la galería`}
              value={item.url}
              placeholder="https://…"
              onChange={(e) => update(item.key, e.target.value)}
              className={inputClass}
            />
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded-lg p-2 text-muted hover:text-paper disabled:opacity-30" aria-label="Subir imagen">
              <ArrowUp className="size-4" />
            </button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="rounded-lg p-2 text-muted hover:text-paper disabled:opacity-30" aria-label="Bajar imagen">
              <ArrowDown className="size-4" />
            </button>
            <button type="button" onClick={() => remove(item.key)} className="rounded-lg p-2 text-muted hover:text-red-400" aria-label="Quitar imagen">
              <X className="size-4" />
            </button>
          </li>
        ))}
      </ul>
      {errorText && <p className="text-xs text-red-400">{errorText}</p>}
      <button
        type="button"
        onClick={add}
        className="inline-flex w-fit items-center gap-2 rounded-full border border-dashed border-line px-4 py-2 text-sm text-paper/80 hover:border-paper/50"
      >
        <Plus className="size-4" aria-hidden />
        Agregar imagen
      </button>
    </div>
  );
}
