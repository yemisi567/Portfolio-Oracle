/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

// Country location IDs for LinkedIn API
const COUNTRY_LOCATION_IDS = {
  "United States": "92000000",
  "United Kingdom": "90000070",
  "Canada": "90000084",
  "Germany": "90000087",
  "Australia": "90000085",
  "Netherlands": "90000089",
  "Singapore": "90000090",
  "Japan": "90000092",
  "France": "90000088",
  "India": "90000091",
  "Global": "92000000",
};

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

// Generate random salary ranges based on country and job type
function generateRandomSalaryRange(country: string, jobTitle: string) {
  const countryData = {
    "United States": { min: 60000, max: 200000, currency: "USD" },
    "United Kingdom": { min: 35000, max: 120000, currency: "GBP" },
    "Canada": { min: 50000, max: 160000, currency: "CAD" },
    "Germany": { min: 40000, max: 120000, currency: "EUR" },
    "Australia": { min: 60000, max: 180000, currency: "AUD" },
    "Netherlands": { min: 35000, max: 110000, currency: "EUR" },
    "Singapore": { min: 40000, max: 150000, currency: "SGD" },
    "Japan": { min: 4000000, max: 15000000, currency: "JPY" },
    "France": { min: 30000, max: 100000, currency: "EUR" },
    "India": { min: 500000, max: 2500000, currency: "INR" },
  };

  const baseRange = countryData[country as keyof typeof countryData] || countryData["United States"];
  
  const randomFactor = 0.8 + Math.random() * 0.4; 
  const min = Math.round(baseRange.min * randomFactor);
  const max = Math.round(baseRange.max * randomFactor);
  
  // Adjust based on job type
  let multiplier = 1;
  if (jobTitle.toLowerCase().includes("senior") || jobTitle.toLowerCase().includes("lead")) {
    multiplier = 1.2 + Math.random() * 0.3; 
  } else if (jobTitle.toLowerCase().includes("junior") || jobTitle.toLowerCase().includes("entry")) {
    multiplier = 0.6 + Math.random() * 0.2; 
  } else if (jobTitle.toLowerCase().includes("architect") || jobTitle.toLowerCase().includes("principal")) {
    multiplier = 1.4 + Math.random() * 0.4; 
  } else {
    multiplier = 0.9 + Math.random() * 0.2; 
  }

  const finalMin = Math.round(min * multiplier);
  const finalMax = Math.round(max * multiplier);

  // Format based on currency
  const formatSalary = (amount: number) => {
    if (baseRange.currency === "JPY" || baseRange.currency === "INR") {
      return amount.toLocaleString();
    }
    return amount.toLocaleString();
  };

  return {
    min: finalMin,
    max: finalMax,
    currency: baseRange.currency,
    display: `${baseRange.currency === "USD" ? "$" : baseRange.currency === "EUR" ? "€" : baseRange.currency === "GBP" ? "£" : baseRange.currency === "JPY" ? "¥" : baseRange.currency === "INR" ? "₹" : baseRange.currency}${formatSalary(finalMin)} - ${baseRange.currency === "USD" ? "$" : baseRange.currency === "EUR" ? "€" : baseRange.currency === "GBP" ? "£" : baseRange.currency === "JPY" ? "¥" : baseRange.currency === "INR" ? "₹" : baseRange.currency}${formatSalary(finalMax)}`
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countries = searchParams.get("countries")?.split(",") || ["United States"];
    const keywords = searchParams.get("keywords")?.split(",") || ["software engineer"];
    const limit = parseInt(searchParams.get("limit") || "10");

    const country = countries[0];
    const keyword = keywords[0];

    console.log(`Trying RapidAPI first for ${country} - ${keyword}`);

    // Step 1: Try RapidAPI first
    if (RAPIDAPI_KEY) {
      try {
        const rapidApiJobs = await fetchRapidApiJobs(country, keyword, limit);
        
        if (rapidApiJobs.length > 0) {
          console.log(`RapidAPI returned ${rapidApiJobs.length} jobs`);
          
          // Process RapidAPI data
          const processedJobs = rapidApiJobs.map(job => ({
            ...job,
            salary: generateRandomSalaryRange(country, job.title),
            experienceLevel: extractExperienceLevel(job.title),
            jobType: extractJobType(job.title),
            skills: extractSkillsFromTitle(job.title, job.companyName),
          }));

          const marketInsights = processMarketData(processedJobs, [country]);
          
          return NextResponse.json({
            success: true,
            data: marketInsights,
            metadata: {
              totalJobs: processedJobs.length,
              countries: [country],
              keywords: [keyword],
              generatedAt: new Date().toISOString(),
              source: 'rapidapi'
            },
          });
        }
      } catch (error) {
        console.log('RapidAPI failed, falling back to market insights:', error);
      }
    }

    // Step 2: Fallback to our market insights endpoint
    console.log('Falling back to market insights endpoint');
    
    const fallbackResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/market-insights/trending-skills?countries=${encodeURIComponent(country)}&keywords=${encodeURIComponent(keyword)}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (fallbackResponse.ok) {
      const fallbackData = await fallbackResponse.json();
      if (fallbackData.success && fallbackData.data) {
        if (fallbackData.data.trendingRoles) {
          fallbackData.data.trendingRoles = fallbackData.data.trendingRoles.map((role: any) => ({
            ...role,
            salary: generateRandomSalaryRange(country, role.role)
          }));
        }
      }
      
      return NextResponse.json({
        ...fallbackData,
        metadata: {
          ...fallbackData.metadata,
          source: 'fallback'
        }
      });
    }

    // Step 3: If both fail, return empty data
    return NextResponse.json({
      success: true,
      data: {
        countryInsights: {},
        globalTrends: { topSkills: [], totalSkills: 0, avgSkillsPerJob: 0 },
        trendingRoles: [],
        summary: { totalJobs: 0, countriesAnalyzed: 0, topSkills: [], topRoles: [] },
      },
      metadata: {
        totalJobs: 0,
        countries: [country],
        keywords: [keyword],
        generatedAt: new Date().toISOString(),
        source: 'none',
        message: "No data available from any source"
      },
    });

  } catch (error) {
    console.error("Error in rapidapi-first endpoint:", error);
    return NextResponse.json(
      { error: "Failed to fetch market insights" },
      { status: 500 }
    );
  }
}

async function fetchRapidApiJobs(country: string, keyword: string, limit: number): Promise<any[]> {
  const locationId = COUNTRY_LOCATION_IDS[country as keyof typeof COUNTRY_LOCATION_IDS] || "92000000";
  const url = `https://jobs-api14.p.rapidapi.com/v2/linkedin/search?query=${encodeURIComponent(keyword)}&location=${getLocationName(locationId)}&datePosted=month&experienceLevels=intern;entry;associate;midSenior;director&workplaceTypes=remote;hybrid;onSite&employmentTypes=contractor;fulltime;parttime;intern;temporary`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "jobs-api14.p.rapidapi.com",
      "x-rapidapi-key": RAPIDAPI_KEY!,
    },
  });

  if (!response.ok) {
    throw new Error(`RapidAPI error: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.data && Array.isArray(data.data)) {
    return data.data.map((job: any) => ({
      jobId: job.id,
      title: job.title,
      company: job.companyName,
      location: job.location,
      description: generateJobDescription(job.title, job.companyName),
      postedDate: job.datePosted,
      country,
      keyword,
    }));
  }

  return [];
}

function generateJobDescription(title: string, company: string): string {
  const titleLower = title.toLowerCase();
  
  const templates = {
    "software engineer": `We are looking for a Software Engineer to join our team at ${company}. You will be responsible for designing, developing, and maintaining software applications. Experience with JavaScript, Python, Java, React, Node.js, and modern development tools is required.`,
    "frontend": `Join ${company} as a Frontend Developer and help build amazing user experiences. You'll work with React, JavaScript, TypeScript, Vue.js, Angular, and modern frontend frameworks to create responsive and interactive web applications.`,
    "backend": `We're seeking a Backend Developer at ${company} to build scalable server-side applications. Experience with Node.js, Python, Java, Go, databases like PostgreSQL and MongoDB, and cloud platforms like AWS is essential.`,
    "fullstack": `Join our team at ${company} as a Full Stack Developer. You'll work on both frontend and backend development, using technologies like React, Node.js, Python, TypeScript, PostgreSQL, and various modern frameworks.`,
    "data scientist": `We're looking for a Data Scientist at ${company} to analyze complex datasets and build machine learning models. Experience with Python, R, SQL, and statistical analysis is required.`,
    "devops": `Join ${company} as a DevOps Engineer to manage our infrastructure and deployment pipelines. Experience with Docker, Kubernetes, AWS, and CI/CD tools is essential.`,
    "mobile": `We're seeking a Mobile Developer at ${company} to build iOS and Android applications. Experience with React Native, Swift, Kotlin, or Flutter is required.`,
    "infrastructure": `Join our team at ${company} as an Infrastructure Engineer. You'll work on scalable systems, cloud platforms, and automation tools. Experience with AWS, Azure, or GCP is preferred.`,
  };
  
  for (const [key, template] of Object.entries(templates)) {
    if (titleLower.includes(key)) {
      return template;
    }
  }
  
  return `Join ${company} as a Software Engineer. You'll work on exciting projects and help build innovative solutions. Experience with modern development practices and technologies is preferred.`;
}

function extractExperienceLevel(title: string): string {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes("senior") || titleLower.includes("lead") || titleLower.includes("principal")) {
    return "Senior";
  } else if (titleLower.includes("junior") || titleLower.includes("entry") || titleLower.includes("new grad")) {
    return "Entry Level";
  } else if (titleLower.includes("mid") || titleLower.includes("intermediate")) {
    return "Mid Level";
  } else {
    return "Mid Level";
  }
}

function extractJobType(title: string): string {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes("fullstack") || titleLower.includes("full-stack") || titleLower.includes("full stack")) {
    return "Full-time";
  } else if (titleLower.includes("part-time") || titleLower.includes("parttime")) {
    return "Part-time";
  } else if (titleLower.includes("contract") || titleLower.includes("freelance")) {
    return "Contract";
  } else if (titleLower.includes("intern") || titleLower.includes("internship")) {
    return "Internship";
  } else {
    return "Full-time";
  }
}

function extractSkillsFromTitle(title: string, company: string): string[] {
  const titleLower = title.toLowerCase();
  
  const skills: string[] = [];
  
  // Extract skills based on job title
  if (titleLower.includes("frontend") || titleLower.includes("front-end")) {
    skills.push("React", "JavaScript", "TypeScript", "HTML", "CSS");
  }
  if (titleLower.includes("backend") || titleLower.includes("back-end")) {
    skills.push("Node.js", "Python", "Java", "PostgreSQL", "MongoDB");
  }
  if (titleLower.includes("fullstack") || titleLower.includes("full-stack")) {
    skills.push("React", "Node.js", "JavaScript", "TypeScript", "PostgreSQL");
  }
  if (titleLower.includes("data")) {
    skills.push("Python", "SQL", "Machine Learning", "Statistics");
  }
  if (titleLower.includes("devops")) {
    skills.push("Docker", "Kubernetes", "AWS", "CI/CD");
  }
  if (titleLower.includes("mobile")) {
    skills.push("React Native", "Swift", "Kotlin", "Flutter");
  }
  
  const commonSkills = ["JavaScript", "Python", "Java", "React", "Node.js", "TypeScript", "Git", "SQL"];
  const randomSkills = commonSkills.sort(() => 0.5 - Math.random()).slice(0, 3);
  skills.push(...randomSkills);
  
  return [...new Set(skills)]; 
}

function processMarketData(jobs: any[], countries: string[]) {
  const skills: Record<string, number> = {};
  const roles: Record<string, number> = {};
  
  jobs.forEach(job => {
    job.skills?.forEach((skill: string) => {
      skills[skill] = (skills[skill] || 0) + 1;
    });
    
    const role = extractRoleFromTitle(job.title);
    if (role) {
      roles[role] = (roles[role] || 0) + 1;
    }
  });
  
  const topSkills = Object.entries(skills)
    .map(([skill, count]) => ({ skill, count, percentage: (count / jobs.length) * 100 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
    
  const trendingRoles = Object.entries(roles)
    .map(([role, count]) => ({ role, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  
  return {
    countryInsights: {
      [countries[0]]: {
        country: countries[0],
        totalJobs: jobs.length,
        topSkills,
        topRoles: trendingRoles,
        avgSalary: 0,
        skillsCount: Object.keys(skills).length,
      }
    },
    globalTrends: {
      topSkills,
      totalSkills: Object.keys(skills).length,
      avgSkillsPerJob: jobs.reduce((sum, job) => sum + (job.skills?.length || 0), 0) / jobs.length,
    },
    trendingRoles,
    summary: {
      totalJobs: jobs.length,
      countriesAnalyzed: countries.length,
      topSkills: topSkills.slice(0, 10),
      topRoles: trendingRoles.slice(0, 10),
    },
  };
}

function extractRoleFromTitle(title: string): string | null {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes("software engineer") || titleLower.includes("software developer")) {
    return "Software Engineer";
  } else if (titleLower.includes("frontend") || titleLower.includes("front-end")) {
    return "Frontend Developer";
  } else if (titleLower.includes("backend") || titleLower.includes("back-end")) {
    return "Backend Developer";
  } else if (titleLower.includes("fullstack") || titleLower.includes("full-stack")) {
    return "Full Stack Developer";
  } else if (titleLower.includes("data scientist")) {
    return "Data Scientist";
  } else if (titleLower.includes("devops")) {
    return "DevOps Engineer";
  } else if (titleLower.includes("mobile")) {
    return "Mobile Developer";
  } else if (titleLower.includes("infrastructure")) {
    return "Infrastructure Engineer";
  }
  
  return "Software Engineer";
}
