export async function generateProductDescription(
  productName: string,
  category: string
): Promise<string> {
  const response = await fetch('/api/ai/product-description', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productName, category }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.success || typeof payload.description !== 'string') {
    throw new Error(payload?.error || 'Could not generate a product description.');
  }

  return payload.description;
}