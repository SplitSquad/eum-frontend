import { create } from 'zustand';

interface InfoFormState {
  title: string;
  files: string[];
  category: string;
  content: string;

  setTitle: (title: string) => void;
  setFiles: (files: string[]) => void;
  setCategory: (category: string) => void;
  setContent: (content: string) => void;
}

export const useInfoFormStore = create<InfoFormState>(set => ({
  title: '',
  files: [],
  category: '',
  content: JSON.stringify({ type: 'doc', content: [] }),

  setFiles: files => set({ files }),
  setTitle: title => set({ title }),
  setContent: content => set({ content }),
  setCategory: category => set({ category }),
}));
