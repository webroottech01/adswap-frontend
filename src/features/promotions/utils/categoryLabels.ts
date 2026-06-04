import type { BusinessCategory } from '@/features/business/api';
import { flattenChildCategories } from '@/features/business/utils/categoryOptions';

export function categoryLabelsFromIds(
  categories: BusinessCategory[],
  ids: number[],
): string {
  if (!ids.length) return '';
  const options = flattenChildCategories(categories);
  const names = ids
    .map((id) => options.find((o) => o.id === id)?.label ?? options.find((o) => o.id === id)?.name)
    .filter(Boolean);
  return names.join(', ');
}
