import apiClient from '@/config/axios';

export interface InfoDetail {
  informationId: number;
  title: string;
  content: string;
  userName: string;
  createdAt: string;
  views: number;
  category: string;
}

export const getInfoDetail = async (id: string | number): Promise<InfoDetail> => {
  const res = await apiClient.get(`/information/${id}`);
  return res as InfoDetail;
};

export const deleteInfo = async (id: string | number): Promise<void> => {
  await apiClient.delete(`/information/${id}`);
};
