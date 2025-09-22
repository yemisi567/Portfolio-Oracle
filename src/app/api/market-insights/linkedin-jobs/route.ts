/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = "jobs-api14.p.rapidapi.com";

interface LinkedInJob {
  jobId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  postedDate: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  skills?: string[];
  experienceLevel?: string;
  jobType?: string;
}

interface JobSearchParams {
  keywords: string;
  locationId: string;
  datePosted?: "anyTime" | "past24h" | "pastWeek" | "pastMonth";
  sort?: "mostRelevant" | "mostRecent";
  limit?: number;
}

export async function GET(request: NextRequest) {
  try {
    if (!RAPIDAPI_KEY) {
      return NextResponse.json(
        { error: "RapidAPI key not configured" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const keywords = searchParams.get("keywords") || "software engineer";
    const locationId = searchParams.get("locationId") || "92000000"; // Global
    const datePosted = searchParams.get("datePosted") || "anyTime";
    const sort = searchParams.get("sort") || "mostRelevant";
    const limit = parseInt(searchParams.get("limit") || "50");

    // Fetch jobs from LinkedIn API
    const jobs = await fetchLinkedInJobs({
      keywords,
      locationId,
      datePosted: datePosted as any,
      sort: sort as any,
      limit,
    });

    // Extract skills from job descriptions
    const jobsWithSkills = await extractSkillsFromJobs(jobs);

    // Aggregate skills by country
    const skillsByCountry = aggregateSkillsByCountry(jobsWithSkills);

    return NextResponse.json({
      success: true,
      data: {
        jobs: jobsWithSkills,
        skillsByCountry,
        totalJobs: jobsWithSkills.length,
        searchParams: {
          keywords,
          locationId,
          datePosted,
          sort,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching LinkedIn jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch market insights" },
      { status: 500 }
    );
  }
}

async function fetchLinkedInJobs(
  params: JobSearchParams
): Promise<LinkedInJob[]> {
  const url = `https://jobs-api14.p.rapidapi.com/v2/linkedin/search?query=${encodeURIComponent(params.keywords)}&location=${getLocationName(params.locationId)}&datePosted=${getDatePosted(params.datePosted)}&experienceLevels=intern;entry;associate;midSenior;director&workplaceTypes=remote;hybrid;onSite&employmentTypes=contractor;fulltime;parttime;intern;temporary`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-host": RAPIDAPI_HOST,
      "x-rapidapi-key": RAPIDAPI_KEY!,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`LinkedIn API error (${response.status}):`, errorText);
    throw new Error(`LinkedIn API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  return (
    data.jobs?.map((job: any) => ({
      jobId: job.jobId || job.id || job.job_id,
      title: job.title || job.jobTitle || job.job_title,
      company: job.company || job.companyName || job.company_name,
      location: job.location || job.jobLocation || job.job_location,
      description: job.description || job.jobDescription || job.job_description,
      postedDate: job.postedDate || job.datePosted || job.date_posted,
      salary: job.salary
        ? {
            min: job.salary.min,
            max: job.salary.max,
            currency: job.salary.currency,
          }
        : undefined,
      experienceLevel: job.experienceLevel || job.experience_level,
      jobType: job.jobType || job.job_type,
    })) || []
  );
}

async function extractSkillsFromJobs(
  jobs: LinkedInJob[]
): Promise<LinkedInJob[]> {
  const techSkills = [
    // Programming Languages
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "Go",
    "Rust",
    "Swift",
    "Kotlin",
    "PHP",
    "Ruby",
    "Scala",
    "R",
    "MATLAB",
    "Perl",
    "Haskell",
    "Clojure",
    "Erlang",
    "Elixir",

    // Web Technologies
    "React",
    "Vue",
    "Angular",
    "Node.js",
    "Express",
    "Django",
    "Flask",
    "Spring",
    "Laravel",
    "ASP.NET",
    "Ruby on Rails",
    "jQuery",
    "Bootstrap",
    "Tailwind CSS",
    "SASS",
    "LESS",

    // Databases
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "Elasticsearch",
    "Cassandra",
    "DynamoDB",
    "SQLite",
    "Oracle",
    "SQL Server",
    "MariaDB",
    "Neo4j",
    "CouchDB",

    // Cloud & DevOps
    "AWS",
    "Azure",
    "GCP",
    "Docker",
    "Kubernetes",
    "Terraform",
    "Ansible",
    "Jenkins",
    "GitLab CI",
    "GitHub Actions",
    "CircleCI",
    "Travis CI",
    "Vagrant",
    "Chef",
    "Puppet",

    // Mobile Development
    "React Native",
    "Flutter",
    "Xamarin",
    "Ionic",
    "Cordova",
    "PhoneGap",

    // Data Science & AI
    "TensorFlow",
    "PyTorch",
    "Pandas",
    "NumPy",
    "Scikit-learn",
    "Keras",
    "OpenCV",
    "Jupyter",
    "Apache Spark",
    "Hadoop",
    "Tableau",
    "Power BI",
    "D3.js",

    // Other Technologies
    "GraphQL",
    "REST API",
    "Microservices",
    "Serverless",
    "Blockchain",
    "Web3",
    "Machine Learning",
    "Deep Learning",
    "Computer Vision",
    "NLP",
    "Data Analysis",
  ];

  return jobs.map((job) => {
    const description = job.description.toLowerCase();
    const foundSkills: string[] = [];

    techSkills.forEach((skill) => {
      const skillLower = skill.toLowerCase();
      if (description.includes(skillLower)) {
        foundSkills.push(skill);
      }
    });

    const skillPatterns = [
      /\b(?:experience with|knowledge of|proficient in|skilled in|expertise in)\s+([A-Za-z\s]+)/gi,
      /\b(?:required|preferred|must have|should have)\s*:?\s*([A-Za-z\s,]+)/gi,
      /\b(?:technologies?|tools?|frameworks?|languages?)\s*:?\s*([A-Za-z\s,]+)/gi,
    ];

    skillPatterns.forEach((pattern) => {
      const matches = description.match(pattern);
      if (matches) {
        matches.forEach((match) => {
          const extracted = match.replace(
            /(?:experience with|knowledge of|proficient in|skilled in|expertise in|required|preferred|must have|should have|technologies?|tools?|frameworks?|languages?)\s*:?\s*/gi,
            ""
          );
          const skills = extracted
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s.length > 2);
          skills.forEach((skill) => {
            if (
              techSkills.some((ts) => ts.toLowerCase() === skill.toLowerCase())
            ) {
              foundSkills.push(skill);
            }
          });
        });
      }
    });

    return {
      ...job,
      skills: [...new Set(foundSkills)], 
    };
  });
}

function aggregateSkillsByCountry(jobs: LinkedInJob[]): Record<
  string,
  {
    country: string;
    skills: Record<string, number>;
    totalJobs: number;
    topSkills: Array<{ skill: string; count: number; percentage: number }>;
  }
> {
  const countryData: Record<
    string,
    {
      skills: Record<string, number>;
      totalJobs: number;
    }
  > = {};

  jobs.forEach((job) => {
    const country = extractCountryFromLocation(job.location);
    if (!countryData[country]) {
      countryData[country] = {
        skills: {},
        totalJobs: 0,
      };
    }

    countryData[country].totalJobs++;

    job.skills?.forEach((skill) => {
      countryData[country].skills[skill] =
        (countryData[country].skills[skill] || 0) + 1;
    });
  });

  const result: Record<string, any> = {};

  Object.entries(countryData).forEach(([country, data]) => {
    const totalSkills = Object.values(data.skills).reduce(
      (sum, count) => sum + count,
      0
    );

    const topSkills = Object.entries(data.skills)
      .map(([skill, count]) => ({
        skill,
        count,
        percentage: totalSkills > 0 ? (count / totalSkills) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    result[country] = {
      country,
      skills: data.skills,
      totalJobs: data.totalJobs,
      topSkills,
    };
  });

  return result;
}

function extractCountryFromLocation(location: string): string {
  const locationLower = location.toLowerCase();

  if (
    locationLower.includes("united states") ||
    locationLower.includes("usa") ||
    locationLower.includes("us")
  ) {
    return "United States";
  }
  if (
    locationLower.includes("united kingdom") ||
    locationLower.includes("uk") ||
    locationLower.includes("england")
  ) {
    return "United Kingdom";
  }
  if (locationLower.includes("canada")) {
    return "Canada";
  }
  if (locationLower.includes("australia")) {
    return "Australia";
  }
  if (locationLower.includes("germany")) {
    return "Germany";
  }
  if (locationLower.includes("france")) {
    return "France";
  }
  if (locationLower.includes("netherlands")) {
    return "Netherlands";
  }
  if (locationLower.includes("singapore")) {
    return "Singapore";
  }
  if (locationLower.includes("india")) {
    return "India";
  }
  if (locationLower.includes("japan")) {
    return "Japan";
  }

  return "Global";
}

// Helper function to convert location ID to location name
function getLocationName(locationId: string): string {
  const locationMap: Record<string, string> = {
    "92000000": "Worldwide",
    "101165590": "United States",
    "101620260": "United Kingdom",
    "101174742": "Canada",
    "101452733": "Australia",
    "101282430": "Germany",
    "101451783": "France",
    "101452735": "Netherlands",
    "101452734": "Singapore",
    "101165591": "India",
    "101452736": "Japan",
  };
  return locationMap[locationId] || "Worldwide";
}

// Helper function to convert datePosted format
function getDatePosted(datePosted?: string): string {
  const dateMap: Record<string, string> = {
    anyTime: "any",
    past24h: "day",
    pastWeek: "week",
    pastMonth: "month",
  };

  return dateMap[datePosted || "anyTime"] || "month";
}
