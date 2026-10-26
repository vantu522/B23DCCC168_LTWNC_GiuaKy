import { create } from 'zustand';
import type { Category } from '../types/book';

interface FilterState {
  searchTerm: string;
  selectedCategory: Category | 'All';
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: Category | 'All') => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchTerm: '',
  selectedCategory: 'All',
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  resetFilters: () => set({ searchTerm: '', selectedCategory: 'All' }),
}));
