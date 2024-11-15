import { PlatformExtractor, RunnerData } from "@/type/race";

const extractIdFromUrl = (url: string) => {
  const regex = /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/;
  const match = url.match(regex);
  return match ? match[0] : null;
}

const convertToGender = (genderString: string) => {
  if (!genderString) {
    return "";
  }

  return genderString === 'gender_0' ? 'H' : 'M';
}

const capitalizeText = (text: string) => {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const sportmaniacExtractor: PlatformExtractor = {
  async extractRunnerData(url: string): Promise<RunnerData[]> {
    const eventId = extractIdFromUrl(url);

    if (!eventId) throw new Error('ID not found in the provided URL');

    const baseUrl = 'https://sportmaniacs.com/es/races/rankings/' + eventId

    const data = await fetch(baseUrl);
    const eventRaceData = await data.json();
    const runnerRowsData = eventRaceData['data']['Rankings'];

    const runnerData: RunnerData[] = runnerRowsData.map((runner: any) => {
      const newRunnerData: RunnerData = {
        name: runner.name ? capitalizeText(runner.name) : "",
        surname: "",
        fullName: runner.name ? capitalizeText(runner.name) : "",
        bib: runner.dorsal ? parseInt(runner.dorsal) : 0,
        category: runner.category || null,
        gender: runner.gender ? convertToGender(runner.gender) : "",
        club: runner.club || null,
        finished: runner.finishedRace || false,

        officialPosition: runner.pos ? parseInt(runner.pos, 10) : 0,
        officialTime: runner.officialTime || null,
        officialPace: runner.average || null,
        officialCategoryPosition: runner.catPos ? parseInt(runner.catPos, 10) : 0,
        officialGenderPosition: runner.genPos ? parseInt(runner.genPos, 10) : 0,

        realPosition: runner.realPos ? parseInt(runner.realPos, 10) : 0,
        realTime: runner.realTime || null,
        realPace: runner.averageNet || null,
        realCategoryPosition: runner.realCatPos ? parseInt(runner.realCatPos, 10) : 0,
        realGenderPosition: runner.realGenPos ? parseInt(runner.realGenPos, 10) : 0,
      }
      return newRunnerData
    });

    return runnerData;
  },
};
