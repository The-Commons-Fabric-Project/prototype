export type Tag = {
  label: string;
  color: string;
  background: string;
};

export type Event = {
  id: string | number;
  month: string;
  day: number;
  title: string;
  time: string;
  organization?: string;
  description?: string;
  location?: string;
  tags?: Tag[];
  thumbnailUrl?: string;
};
