// Normalizar nombre (trim y capitalizar la primera letra)
const normalizeName = (name: string) => {
    return name.trim().replace(/\b\w/g, char => char.toUpperCase());
};

export const normalizeRaceData = (name: string, date: string, url: string, platform: string) => {
    // Normalizar el nombre (Capitalizar la primera letra de cada palabra)
    const normalizedName = normalizeName(name);

    // Normalizar la fecha (asegurarse de que está en formato 'YYYY-MM-DD')
    const normalizedDate = new Date(date); // Normaliza a 'YYYY-MM-DD'

    // Normalizar URL (asegurarse de que tiene un formato correcto)
    const normalizedUrl = url.trim().toLowerCase();

    // Normalizar plataforma (convertir todo a minúsculas)
    const normalizedPlatform = platform.trim().toLowerCase();

    return {
        name: normalizedName,
        date: normalizedDate,
        url: normalizedUrl,
        platform: normalizedPlatform,
    };
};