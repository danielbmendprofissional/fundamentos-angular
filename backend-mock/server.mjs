// Backend FAKE só para rodar o front de estudo. Não é parte do projeto Angular.
// Simula o BFF (cookie de sessão), o "Keycloak" (página de login) e a API de usuários.
// Sem dependências: node backend-mock/server.mjs
import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';

const PORT = Number(process.env.PORT ?? 5000);
const DELAY_MS = Number(process.env.MOCK_DELAY ?? 200);

// Quem pode "logar" na página de login fake.
const CONTAS = [
  { id: 'u1', nome: 'Ana Admin', email: 'ana@exemplo.com', perfis: ['admin'] },
  { id: 'u2', nome: 'Bia Usuária', email: 'bia@exemplo.com', perfis: ['usuario'] },
];

const usuarios = [
  { id: '1', nome: 'Carlos Lima', email: 'carlos@exemplo.com', telefone: '(11) 91234-5678', criadoEm: '2026-03-15T14:30:00Z' },
  { id: '2', nome: 'Diana Souza', email: 'diana@exemplo.com', telefone: '1133334444', criadoEm: '2026-10-02T09:05:00Z' },
];

/** Processamentos assíncronos: id -> { inicio, falhar }. */
const relatorios = new Map();
const DURACAO_RELATORIO_MS = 8000;

/** O status é calculado pelo tempo decorrido, como se um worker estivesse trabalhando. */
function estadoRelatorio(id) {
  const r = relatorios.get(id);
  if (!r) return null;
  const progresso = Math.min(100, Math.floor(((Date.now() - r.inicio) / DURACAO_RELATORIO_MS) * 100));
  if (r.falhar && progresso >= 60) {
    return { id, status: 'falhou', progresso: 60, motivo: 'Falha simulada ao gerar o relatório.' };
  }
  if (progresso >= 100) {
    return { id, status: 'concluido', progresso: 100, arquivo: `relatorio-${id.slice(0, 8)}.pdf` };
  }
  return { id, status: 'processando', progresso };
}

/** sid -> { conta, tokenExpirado } */
const sessoes = new Map();

const pausa = () => new Promise((resolve) => setTimeout(resolve, DELAY_MS));

function cookies(req) {
  return Object.fromEntries(
    (req.headers.cookie ?? '')
      .split(';')
      .map((c) => c.trim().split('='))
      .filter(([k]) => k),
  );
}

async function corpo(req) {
  const partes = [];
  for await (const parte of req) partes.push(parte);
  return Buffer.concat(partes).toString('utf8');
}

function json(res, status, dados) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(dados === undefined ? '' : JSON.stringify(dados));
}

/** Problem Details (RFC 9457), o formato que o front espera. */
function problema(res, status, { title, detail, code, errors }) {
  res.writeHead(status, { 'Content-Type': 'application/problem+json' });
  res.end(JSON.stringify({ status, title, detail, code, errors, traceId: randomUUID() }));
}

function redirecionar(res, destino, cabecalhos = {}) {
  res.writeHead(302, { Location: destino, ...cabecalhos });
  res.end();
}

/** Só caminhos internos; o backend real também precisa validar isso. */
const returnUrlSeguro = (url) => (url?.startsWith('/') && !url.startsWith('//') ? url : '/');

const escapar = (texto) => texto.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function paginaLogin(returnUrl) {
  const opcoes = CONTAS.map(
    (c) => `<label><input type="radio" name="conta" value="${c.id}" ${c.id === 'u1' ? 'checked' : ''}>
      ${escapar(c.nome)} <small>(${c.perfis.join(', ')})</small></label>`,
  ).join('\n');
  return `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Login (mock)</title>
<body style="font-family:system-ui;max-width:24rem;margin:4rem auto">
<h1>Login (Keycloak fake)</h1>
<form method="post" action="/api/v1/auth/login" style="display:grid;gap:.75rem">
<input type="hidden" name="returnUrl" value="${escapar(returnUrl)}">
${opcoes}
<button>Entrar</button></form></body></html>`;
}

function sessaoDe(req) {
  return sessoes.get(cookies(req).sid) ?? null;
}

const servidor = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const rota = `${req.method} ${url.pathname}`;
  // Só loga o que é do app: coletores externos (ex.: Prometheus/Alloy) batem em /metrics sem parar.
  if (url.pathname !== '/metrics') console.log(rota);
  await pausa();

  // --- Fluxo de login/logout (redirects de página inteira) ---
  if (rota === 'GET /api/v1/auth/login') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(paginaLogin(returnUrlSeguro(url.searchParams.get('returnUrl'))));
  }

  if (rota === 'POST /api/v1/auth/login') {
    const form = new URLSearchParams(await corpo(req));
    const conta = CONTAS.find((c) => c.id === form.get('conta'));
    if (!conta) return redirecionar(res, '/api/v1/auth/login');
    const sid = randomUUID();
    sessoes.set(sid, { conta, tokenExpirado: false });
    return redirecionar(res, returnUrlSeguro(form.get('returnUrl')), {
      'Set-Cookie': `sid=${sid}; HttpOnly; Path=/; SameSite=Lax`,
    });
  }

  if (rota === 'GET /api/v1/auth/logout') {
    sessoes.delete(cookies(req).sid);
    return redirecionar(res, '/', { 'Set-Cookie': 'sid=; Path=/; Max-Age=0' });
  }

  // --- Daqui em diante exige sessão ---
  const sessao = sessaoDe(req);
  if (!sessao) {
    return problema(res, 401, { title: 'Não autenticado', detail: 'Faça login.' });
  }

  if (rota === 'POST /api/v1/auth/refresh') {
    sessao.tokenExpirado = false;
    res.writeHead(204);
    return res.end();
  }

  // Simula o access token expirado: o front deve chamar /auth/refresh e repetir a request.
  if (sessao.tokenExpirado) {
    return problema(res, 401, {
      title: 'Token expirado',
      detail: 'Sua sessão precisa ser renovada.',
      code: 'auth.access-token-expired',
    });
  }

  // Atalho de demonstração: GET /api/__mock/expirar-token e depois use o app.
  if (rota === 'GET /api/__mock/expirar-token') {
    sessao.tokenExpirado = true;
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Token marcado como expirado. A próxima chamada da API vai receber 401 e o front fará o refresh.');
  }

  // --- API de usuários ---
  if (rota === 'GET /api/v1/usuarios/me') {
    const { id, nome, email, perfis } = sessao.conta;
    return json(res, 200, { id, nome, email, perfis });
  }

  if (rota === 'GET /api/v1/usuarios') {
    return json(res, 200, usuarios);
  }

  if (rota === 'POST /api/v1/usuarios') {
    const dados = JSON.parse((await corpo(req)) || '{}');

    // Cenário de demonstração de erro 500 (o front mostra notificação, não stacktrace).
    if (dados.nome === 'erro500') {
      return problema(res, 500, { title: 'Erro interno' });
    }

    const errors = {};
    if (!dados.nome || dados.nome.trim().length < 3) errors.Nome = ['Informe ao menos 3 caracteres.'];
    if (!dados.email) errors.Email = ['Informe o e-mail.'];
    else if (usuarios.some((u) => u.email === dados.email)) errors.Email = ['E-mail já cadastrado.'];
    if (Object.keys(errors).length) {
      return problema(res, 422, { title: 'Dados inválidos', errors });
    }

    const criado = { id: String(usuarios.length + 1), ...dados, criadoEm: new Date().toISOString() };
    usuarios.unshift(criado);
    return json(res, 201, criado);
  }

  // --- Processamento assíncrono: 202 Accepted + consulta de status (polling) ---
  if (rota === 'POST /api/v1/relatorios') {
    const dados = JSON.parse((await corpo(req)) || '{}');
    const id = randomUUID();
    relatorios.set(id, { inicio: Date.now(), falhar: dados.simularFalha === true });
    res.writeHead(202, { 'Content-Type': 'application/json', Location: `/api/v1/relatorios/${id}` });
    return res.end(JSON.stringify(estadoRelatorio(id)));
  }

  const consulta = url.pathname.match(/^\/api\/v1\/relatorios\/([\w-]+)$/);
  if (req.method === 'GET' && consulta) {
    const estado = estadoRelatorio(consulta[1]);
    return estado ? json(res, 200, estado) : problema(res, 404, { title: 'Relatório não encontrado' });
  }

  problema(res, 404, { title: 'Não encontrado' });
});

servidor.listen(PORT, () => {
  console.log(`Backend mock em http://localhost:${PORT} (delay ${DELAY_MS}ms)`);
});
