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

export interface ExperienceProject {
  name: string;
  description: string;
  techs: string[];
  link?: string;
  github?: string;
}

export interface Experience {
  _id: string;
  title: string;
  company: string;
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