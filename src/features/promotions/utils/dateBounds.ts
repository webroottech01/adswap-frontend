export function toDateInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getCrossPromotionDateBounds() {
  const today = new Date();
  const maxEnd = new Date(today);
  maxEnd.setDate(maxEnd.getDate() + 30);

  return {
    minStartDate: toDateInputValue(today),
    maxEndDate: toDateInputValue(maxEnd),
  };
}
