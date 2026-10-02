"use client";

import { ArrowDown, ArrowUp, ImageOff, Plus, X } from "lucide-react";
import { useState } from "react";
import type { ActionState } from "@/lib/actions/state";
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

/** Campo de URL de imagen con vista previa. Preparado para añadir subida (Vercel Blob) más adelante. */
export function ImageUrlField({
  name,
  label,
  defaultValue,
  hint,
  errors,
  kind = "image",
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  hint?: string;
  errors?: ActionState["errors"];
  kind?: "image" | "video";
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [broken, setBroken] = useState(false);
  const show = url && isPreviewable(url);

  return (
    <Field label={label} name={name} errors={errors} hint={hint ?? "Pega una URL pública (https://…) o una ruta de /public."}>
      <div className="flex gap-3">
        <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-ink-3">
          {show && !broken ? (
            kind === "video" ? (
              <video src={url} muted playsInline className="size-full object-cover" onError={() => setBroken(true)} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- vista previa de cualquier origen
              <img src={url} alt="" className="size-full object-cover" onError={() => setBroken(true)} />
            )
          ) : (
            <ImageOff className="size-5 text-muted" aria-hidden />
          )}
        </div>
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
      </div>
    </Field>
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
