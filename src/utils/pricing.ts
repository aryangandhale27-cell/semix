export const calculateSemixSellingPrice = (semixPrice: number): number => {
  const safeValue = Number.isFinite(semixPrice) ? Math.max(0, semixPrice) : 0;

  if (safeValue < 5) return 4.99;
  if (safeValue <= 300) return safeValue * 1.4;
  if (safeValue <= 1400) return safeValue * 1.3;
  return safeValue * 1.25;
};

export const calculateSemixMrp = (sellingPrice: number): number => {
  const safeValue = Number.isFinite(sellingPrice) ? Math.max(0, sellingPrice) : 0;
  return safeValue * 1.25;
};

export const getProductPriceBreakdown = (semixPrice: number) => {
  const sellingPrice = calculateSemixSellingPrice(semixPrice);
  const mrp = calculateSemixMrp(sellingPrice);

  return {
    semixPrice,
    sellingPrice: Number(sellingPrice.toFixed(2)),
    mrp: Number(mrp.toFixed(2)),
  };
};
