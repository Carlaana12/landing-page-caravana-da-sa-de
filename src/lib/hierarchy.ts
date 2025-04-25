import { HierarchicalItem, HierarchicalItemWithChildren, Breadcrumb } from './types';

export const buildHierarchy = (items: HierarchicalItem[]): HierarchicalItemWithChildren[] => {
  const map = new Map<string, HierarchicalItemWithChildren>();
  const roots: HierarchicalItemWithChildren[] = [];

  // Primeiro, criamos um mapa de todos os itens
  items.forEach(item => {
    map.set(item.id, { ...item, children: [] });
  });

  // Depois, construímos a hierarquia
  items.forEach(item => {
    const node = map.get(item.id)!;
    if (item.parent_id) {
      const parent = map.get(item.parent_id);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
};

export const getBreadcrumbs = (
  items: HierarchicalItem[],
  itemId: string
): Breadcrumb[] => {
  const breadcrumbs: Breadcrumb[] = [];
  let currentId = itemId;

  while (currentId) {
    const item = items.find(i => i.id === currentId);
    if (!item) break;

    breadcrumbs.unshift({
      id: item.id,
      name: item.name,
      type: item.type
    });

    currentId = item.parent_id || '';
  }

  return breadcrumbs;
};

export const validateHierarchy = (
  items: HierarchicalItem[],
  itemId: string,
  newParentId: string | null
): { valid: boolean; error?: string } => {
  // Um item não pode ser pai de si mesmo
  if (itemId === newParentId) {
    return { valid: false, error: 'Um item não pode ser pai de si mesmo' };
  }

  // Verificar recursão (um item não pode ser pai de seus ancestrais)
  let currentId = newParentId;
  while (currentId) {
    if (currentId === itemId) {
      return { valid: false, error: 'Um item não pode ser pai de seus ancestrais' };
    }
    const parent = items.find(i => i.id === currentId);
    currentId = parent?.parent_id || null;
  }

  return { valid: true };
};

export const getValidParents = (
  items: HierarchicalItem[],
  itemId: string,
  type: HierarchicalItem['type']
): HierarchicalItem[] => {
  return items.filter(item => {
    // Não incluir o próprio item
    if (item.id === itemId) return false;

    // Apenas itens do mesmo tipo
    if (item.type !== type) return false;

    // Verificar se o item não é descendente do item atual
    let currentId = item.id;
    while (currentId) {
      if (currentId === itemId) return false;
      const parent = items.find(i => i.id === currentId);
      currentId = parent?.parent_id || '';
    }

    return true;
  });
}; 