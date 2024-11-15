export enum Platform {
  SPORTMANIAC = 'sportmaniacs',
  TOPRUN = 'toprun',
  ANOTHER = 'another',
}

export interface RunnerData {
  name: string;
  surname: string;
  fullName: string;
  bib: number; // dorsal
  category: string;
  gender: string;
  club: string;
  finished: boolean;

  officialPosition: number;
  officialTime: string;
  officialPace: string;
  officialCategoryPosition: number;
  officialGenderPosition: number;

  realPosition: number;
  realTime: string;
  realPace: string;
  realCategoryPosition: number;
  realGenderPosition: number
}

export interface PlatformExtractor {
  extractRunnerData(url: string): Promise<RunnerData[]>;
}