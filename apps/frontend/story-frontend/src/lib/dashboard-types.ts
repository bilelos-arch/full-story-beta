// Types pour les données du dashboard

export interface DashboardMetrics {
  totalUsers: number;
  totalTemplates: number;
  totalZones: number;
  totalPdfsGenerated: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
  [key: string]: any;
}

export interface TemplateStats {
  byCategory: ChartData[];
  byAgeRange: ChartData[];
  recentTemplates: number;
}

export interface UserStats {
  byRole: ChartData[];
  recentUsers: number;
}

export interface PdfStats {
  recentPdfs: number;
  totalPdfs: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  templateStats: TemplateStats;
  userStats: UserStats;
  pdfStats: PdfStats;
  chartData: {
    usersByRole: ChartData[];
    templatesByCategory: ChartData[];
    templatesByAgeRange: ChartData[];
    pdfsByMonth: ChartData[];
  };
  loading: boolean;
  error: string | null;
}

export interface UseDashboardDataReturn {
  data: DashboardData;
  refetch: () => Promise<void>;
  loading: boolean;
  error: string | null;
}