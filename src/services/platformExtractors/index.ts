import { Platform, PlatformExtractor } from '@/type/race';
import { sportmaniacExtractor } from './sportmaniacExtractor';

export const getExtractor = (platform: string): PlatformExtractor => {
  switch (platform) {
    case Platform.SPORTMANIAC:
      return sportmaniacExtractor;
    default:
      throw new Error(`Extractor para la plataforma ${platform} no implementado.`);
  }
};
