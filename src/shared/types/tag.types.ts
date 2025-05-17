export type Tag = string;

export type SubCategory = {
  name: string;
  tags: Tag[];
};

export type MainCategory = {
  id: string; // "travel", "residence" ...
  title: string; // "여행", "주거" ...
  icon?: string; // optional: 추후 아이콘 연결 시 사용
  subCategories: SubCategory[];
};
