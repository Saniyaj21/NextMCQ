const BASE = process.env.NEXT_PUBLIC_API_URL;

async function request(path, { headers: extraHeaders = {}, ...rest } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
    ...rest,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Something went wrong');
  return data;
}

export const api = {
  post: (path, body, token) =>
    request(path, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
};
