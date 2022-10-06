export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init)
  return res.json()
}

export const ITEMS_PER_PAGE = 25
export const DEFAULT_PAGE = 1
export const DEFAULT_LOCATION = 'IP'
