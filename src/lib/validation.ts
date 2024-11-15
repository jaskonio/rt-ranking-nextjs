import { Platform } from "@/type/race";

// Función para validar la URL
const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  
  // Función para validar la plataforma
  const isValidPlatform = (platform: string) => {
    const platformValues = Object.values(Platform);

    return platformValues.includes(platform as Platform);
  };
  
  // Función para validar la fecha
  const isValidDate = (date: string) => {
    // Expresión regular para validar la fecha en el formato 'YYYY-MM-DD'
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) return false;
  
    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate.getTime()) && date === parsedDate.toISOString().split('T')[0];
  };

  export const validateRaceData = (name: string, date: string, url: string, platform: string) => {
    const errors: string[] = [];
  
    // Validación de nombre
    if (!name || typeof name !== 'string') {
      errors.push('Nombre de la carrera es requerido');
    }
  
    // Validación de fecha
    if (!isValidDate(date)) {
      errors.push('Fecha inválida. Debe seguir el formato YYYY-MM-DD');
    }
  
    // Validación de URL
    if (!url || !isValidUrl(url)) {
      errors.push('URL no es Valida');
    }
  
    // Validación de plataforma
    if (!platform || !isValidPlatform(platform)) {
      errors.push('Plataforma no es valida');
    }
  
    return errors;
  };