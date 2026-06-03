import { client } from './sanity';
import imageUrlBuilder from '@sanity/image-url';
import type { Experience } from '../types/sanity';

const builder = imageUrlBuilder(client);

export function urlForImage(source: any) {
  return builder.image(source);
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