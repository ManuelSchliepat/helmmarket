import { Skill } from './placeholder-data';

export interface Filters {
  searchQuery: string;
  activeCategory: string;
  complianceOnly: boolean;
  providerAgnosticOnly: boolean;
  freeOnly: boolean;
  priceRange: number;
  sortBy: string;
}

function normalizeStr(str: string | null | undefined): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function applyFilters(skills: Skill[], filters: Filters): Skill[] {
  const normalizedQuery = normalizeStr(filters.searchQuery);

  let results = skills.filter((skill) => {
    // 1. Search Filter
    if (normalizedQuery) {
      const nameMatch = normalizeStr(skill.name).includes(normalizedQuery);
      const descMatch = normalizeStr(skill.description).includes(normalizedQuery);
      const tagMatch = (skill.tags || []).some(tag => normalizeStr(tag).includes(normalizedQuery));
      if (!nameMatch && !descMatch && !tagMatch) return false;
    }

    // 2. Category Filter
    if (filters.activeCategory !== 'all' && skill.category !== filters.activeCategory) {
      return false;
    }

    // 3. Compliance Filter
    if (filters.complianceOnly && (!skill.compliance_labels || skill.compliance_labels.length === 0)) {
      return false;
    }


    // 4. Provider Agnostic Filter
    if (filters.providerAgnosticOnly && !skill.provider_switchable) {
      return false;
    }

    // 5. Free Skills Filter
    if (filters.freeOnly && skill.price_cents !== 0) {
      return false;
    }

    // 6. Price Range Filter
    if (skill.price_cents / 100 > filters.priceRange) {
      return false;
    }

    return true;
  });

  // 7. Sorting
  results.sort((a, b) => {
    switch (filters.sortBy) {
      case 'newest':
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      case 'price-low':
        return a.price_cents - b.price_cents;
      case 'price-high':
        return b.price_cents - a.price_cents;
      default: // popular / trending (stable mock)
        return 0;
    }
  });

  return results;
}

/**
 * Computes counts for each category based on current filters, 
 * but ignoring the category filter itself.
 */
export function computeCategoryCounts(skills: Skill[], filters: Omit<Filters, 'activeCategory'>): Record<string, number> {
  const baseFiltered = applyFilters(skills, { ...filters, activeCategory: 'all' });
  
  const counts: Record<string, number> = { all: baseFiltered.length };
  
  baseFiltered.forEach(skill => {
    counts[skill.category] = (counts[skill.category] || 0) + 1;
  });
  
  return counts;
}
