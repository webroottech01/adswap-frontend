import { BusinessCategory } from '../api';
import { buildCategoryTree, CategoryTreeNode } from './categoryTree';

export interface CategoryChecklistOption {
  id: number;
  name: string;
  label: string;
  parentName: string;
}

export function flattenChildCategories(categories: BusinessCategory[]): CategoryChecklistOption[] {
  const tree = buildCategoryTree(categories);
  const result: CategoryChecklistOption[] = [];

  const walk = (nodes: CategoryTreeNode[], parentName: string) => {
    nodes.forEach((node) => {
      if (node.children?.length) {
        walk(node.children, node.name);
      } else if (node.parent_category_id !== null) {
        result.push({
          id: node.id,
          name: node.name,
          parentName,
          label: `${parentName} › ${node.name}`,
        });
      }
    });
  };

  walk(tree, '');
  return result.sort((a, b) => a.label.localeCompare(b.label));
}
