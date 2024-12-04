export const CATEGORIES = [
  "Elite Men",
  "Elite Women",
  "Master Men",
  "Master Women",
  "Amateur Men",
  "Amateur Women"
] as const;

export const INITIAL_PARTICIPATION = {
  runnerId: "",
  bib: 0,
  realPosition: 0,
  realTime: "",
  realPace: "",
  officialPosition: 0,
  officialTime: "",
  officialPace: "",
  category: "",
  realCategoryPosition: 0,
  realGenderPosition: 0,
  officialCategoryPosition: 0,
  officialGenderPosition: 0,
};