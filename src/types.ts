export type DatasetType = 'text' | 'image' | 'code' | 'audio' | 'video';

export interface Dataset {
  id: string;
  title: string;
  description: string;
  type: DatasetType;
  price: number;
  license: string;
  rating: number;
  downloads: number;
  revenue: number;
  creator: string;
  createdAt: string;
  sampleData: string[];
  tags: string[];
  isVerified: boolean;
}

export interface RevenueData {
  month: string;
  revenue: number;
  downloads: number;
}

export interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  datasetName: string;
}
