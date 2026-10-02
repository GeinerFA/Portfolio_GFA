/** Estado que devuelven las Server Actions del admin (importable desde componentes cliente). */
export type ActionState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export const initialState: ActionState = { ok: false };
