/** Usuário da sessão, como o front o enxerga. Usado só para UX; a autorização real é do backend. */
export interface AuthUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly roles: readonly string[];
}

/** Contrato de `GET /api/v1/usuarios/me`. */
export interface MeResponse {
  id: string;
  nome: string;
  email: string;
  perfis: string[];
}

export const toAuthUser = (me: MeResponse): AuthUser => ({
  id: me.id,
  name: me.nome,
  email: me.email,
  roles: me.perfis ?? [],
});
