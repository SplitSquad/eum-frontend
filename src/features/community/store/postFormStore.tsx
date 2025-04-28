import { create } from 'zustand';
import { JSONContent } from '@tiptap/react';

interface PostFormState {
  title: string;
  postType: string;
  city?: string;
  district?: string;
  neighborhood?: string;
  category: string;
  tag: string;
  content: string;
  isAnonymous?: boolean;

  setTitle: (title: string) => void;
  setPostType: (postType: string) => void;
  setCity: (city: string) => void;
  setDistrict: (districts: string) => void;
  setNeighborhood: (neighborhoods: string) => void;
  setCategory: (category: string) => void;
  setTag: (tag: string) => void;
  setContent: (content: string) => void;
  setIsAnonymous: (isAnonymous: boolean) => void;

  //setField: <K extends keyof PostFormState>(key: K, value: PostFormState[K]) => void;
}

export const usePostFormStore = create<PostFormState>(set => ({
  title: '',
  postType: '',
  city: '',
  district: '',
  neighborhood: '',
  category: '',
  tag: '',
  content: JSON.stringify({ type: 'doc', content: [] }),
  isAnonymous: false,
  //content: {type:'doc',content:[]},
  setTitle: title => set({ title }),
  setPostType: postType => set({ postType }),
  setCity: city => set({ city, district: '', neighborhood: '' }),
  setDistrict: district => set({ district, neighborhood: '' }),
  setNeighborhood: neighborhood => set({ neighborhood }),
  setCategory: category => set({ category, tag: '' }),
  setTag: tag => set({ tag }),
  setContent: content => set({ content }),
  setIsAnonymous: isAnonymous => set({ isAnonymous }),
}));
