export interface EventItem {
  id: string;
  title: string;
  category: 'حدث' | 'عرض' | 'افتتاح جديد' | 'مكان';
  locationName: string;
  coordinates: [number, number]; // lat, lng
  time: string;
  sourceUrl: string;
  aiSummary: string;
  isRemote?: boolean;
  isTrending?: boolean;
  isPopular?: boolean;
  image?: string;
  tags?: Interest[];
}

export type Interest = 'قهوة' | 'تقنية' | 'حياة ليلية' | 'فنون' | 'طعام' | 'رياضة' | 'طبيعة' | 'عائلات' | 'تسوق' | 'مطعم';
