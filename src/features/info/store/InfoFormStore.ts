import { create } from 'zustand';
import { getInfoDetail, InfoDetail } from '../api/infoApi';

interface InfoFormState {
  informationId?: number;
  title: string;
  files: string[];
  category: string;
  content: string;
  userName?: string;
  createdAt?: string;
  views?: number;

  setTitle: (title: string) => void;
  setFiles: (files: string[]) => void;
  setCategory: (category: string) => void;
  setContent: (content: string) => void;
  setAll: (data: Partial<InfoFormState>) => void;
  reset: () => void;
  fetchAndSetDetail: (id: string | number) => Promise<void>;
}

export const useInfoFormStore = create<InfoFormState>(set => ({
  informationId: undefined,
  title: '',
  files: [],
  category: '',
  content: JSON.stringify({ type: 'doc', content: [] }),
  userName: '',
  createdAt: '',
  views: 0,

  setFiles: files => set({ files }),
  setTitle: title => set({ title }),
  setContent: content => set({ content }),
  setCategory: category => set({ category }),
  setAll: data => set(state => ({ ...state, ...data })),
  reset: () =>
    set({
      informationId: undefined,
      title: '',
      files: [],
      category: '',
      content: JSON.stringify({ type: 'doc', content: [] }),
      userName: '',
      createdAt: '',
      views: 0,
    }),
  fetchAndSetDetail: async (id: string | number) => {
    const detail = await getInfoDetail(id);
    set(state => ({
      ...state,
      ...detail,
    }));
  },
}));
