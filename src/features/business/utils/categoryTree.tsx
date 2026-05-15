import { ReactNode } from 'react';
import { BusinessCategory } from '../api';

/**
 * Category tree node structure
 */
export interface CategoryTreeNode extends BusinessCategory {
  children?: CategoryTreeNode[];
}

/**
 * Build a tree structure from flat category list
 */
export function buildCategoryTree(categories: BusinessCategory[]): CategoryTreeNode[] {
  const categoryMap = new Map<number, CategoryTreeNode>();
  const rootCategories: CategoryTreeNode[] = [];

  // First pass: create all nodes
  categories.forEach((category) => {
    categoryMap.set(category.id, {
      ...category,
      children: [],
    });
  });

  // Second pass: build tree structure
  categories.forEach((category) => {
    const node = categoryMap.get(category.id)!;
    
    if (category.parent_category_id === null) {
      // Root category
      rootCategories.push(node);
    } else {
      // Child category
      const parent = categoryMap.get(category.parent_category_id);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(node);
      } else {
        // Parent not found, treat as root
        rootCategories.push(node);
      }
    }
  });

  // Sort categories by sort_order
  const sortCategories = (cats: CategoryTreeNode[]): CategoryTreeNode[] => {
    return cats
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((cat) => ({
        ...cat,
        children: cat.children ? sortCategories(cat.children) : undefined,
      }));
  };

  return sortCategories(rootCategories);
}

/**
 * Render category options in tree structure
 */
export function renderCategoryOptions(
  categories: CategoryTreeNode[],
  level: number = 0,
  prefix: string = ''
): ReactNode[] {
  const options: ReactNode[] = [];

  categories.forEach((category) => {
    const indent = '  '.repeat(level);
    const displayName = level > 0 ? `${prefix}${category.name}` : category.name;
    
    options.push(
      <option key={category.id} value={category.name}>
        {indent}{displayName}
      </option>
    );

    // Render children recursively
    if (category.children && category.children.length > 0) {
      const childOptions = renderCategoryOptions(
        category.children,
        level + 1,
        level === 0 ? '└─ ' : '  └─ '
      );
      options.push(...childOptions);
    }
  });

  return options;
}









