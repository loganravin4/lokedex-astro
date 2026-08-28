import { client } from './sanity';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);

export function urlForImage(source: any) {
  return builder.image(source);
}

export interface ExperienceProject {
  name: string;
  description: string;
  techs: string[];
  link?: string;
  github?: string;
}

export type ExperienceCategory = 'work' | 'campus';

export interface Experience {
  _id: string;
  title: string;
  company: string;
  category: ExperienceCategory;
  companyLogo?: any;
  companyWebsite?: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string[];
  projects?: ExperienceProject[];
  orderRank?: string;
}

export async function fetchExperiences(): Promise<Experience[]> {
  const query = `*[_type == "experience"] | order(
    coalesce(orderRank, "z"),
    current desc,
    coalesce(endDate, "9999-12-31") desc,
    startDate desc
  ) {
    _id,
    title,
    company,
    "category": coalesce(category, "work"),
    companyLogo,
    companyWebsite,
    location,
    startDate,
    endDate,
    current,
    description,
    projects,
    orderRank
  }`;

  return await client.fetch(query);
}