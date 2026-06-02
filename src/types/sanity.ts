export interface Project {
    _id: string;
    name: string;
    slug: {
      current: string;
    };
    description: string;
    shortDescription: string;
    types: string[];
    techs: string[];
    github?: string;
    link?: string;
    featured: boolean;
    orderRank?: string;
  }

export interface Experience {
  _id: string;
  title: string;
  company: string;
  companyWebsite?: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string[];
  projects?: {
    name: string;
    description: string;
    techs: string[];
    link?: string;
    github?: string;
  }[];
}