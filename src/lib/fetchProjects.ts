import { client } from './sanity';
import type { Project } from '../types/sanity';

export async function fetchProjects(): Promise<Project[]> {
  const query = `*[_type == "project"] | order(orderRank) {
    _id,
    name,
    slug,
    description,
    shortDescription,
    types,
    techs,
    github,
    link,
    featured,
    orderRank
  }`;

  return await client.fetch(query);
}

export async function fetchFeaturedProjects(): Promise<Project[]> {
  const query = `*[_type == "project" && featured == true] | order(orderRank) {
    _id,
    name,
    slug,
    description,
    shortDescription,
    types,
    techs,
    github,
    link,
    featured,
    orderRank
  }`;

  return await client.fetch(query);
}