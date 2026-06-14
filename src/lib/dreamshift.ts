export type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced";
export type WeeklyTime = "<3h" | "3–7h" | "7h+";

export interface DreamProfile {
  id: string;
  name: string;
  dreamJob: string;
  experienceLevel: ExperienceLevel;
  weeklyTime: WeeklyTime;
  xp: number;
  coins: number;
  streak: number;
  completedMissions: number;
  skills: string[];
  createdAt: string;
  lastActive: string;
}

export interface Mission {
  id: string;
  title: string;
  scenario: string;
  objective: string;
  deliverables: string[];
  difficulty: string;
  estimated_time: string;
  evaluation_criteria: string[];
  profession: string;
  level: ExperienceLevel;
  status: "active" | "draft" | "completed";
  createdAt: string;
}

export interface Evaluation {
  id: string;
  missionId: string;
  submittedAt: string;
  score: number;
  metrics: { creativity: number; practicality: number; communication: number; execution: number };
  strengths: string[];
  improvements: string[];
  nextChallenge: string;
  xpAwarded: number;
  coinsAwarded: number;
  submission: string;
}

export const RANKS = ["Explorer", "Intern", "Junior Specialist", "Professional", "Senior", "Director", "Master"];

export const getLevel = (xp: number) => Math.max(1, Math.floor(xp / 250) + 1);
export const getRank = (xp: number) => RANKS[Math.min(RANKS.length - 1, Math.floor(xp / 500))];
export const getReadiness = (profile: DreamProfile) => Math.min(96, 18 + profile.completedMissions * 7 + Math.floor(profile.xp / 120));

const missionTemplates: Record<string, Partial<Mission>[]> = {
  entrepreneur: [
    {
      title: "Validate a local problem in 10 minutes",
      scenario: "You are exploring a new micro-startup idea for your city. Your manager wants quick evidence before any build work starts. Pick one everyday problem, name who feels it most, and validate three assumptions using fast desk research or people you already know.",
      objective: "Find a real problem, identify a customer segment, and test three assumptions without building anything.",
      deliverables: ["Problem statement", "Target customer", "Three assumptions", "Fast validation plan", "One risk you would test next"],
      difficulty: "Starter sprint",
      estimated_time: "8 minutes",
      evaluation_criteria: ["Specificity of problem", "Quality of assumptions", "Practical validation", "Clarity of next step"],
    },
    {
      title: "Design a no-code landing page experiment",
      scenario: "A mentor gives you one afternoon to prove demand for your idea. You need a landing page pitch, a call-to-action, and a simple metric that tells you if people care.",
      objective: "Create a lean experiment that can measure interest before investing money.",
      deliverables: ["One-sentence value proposition", "Landing page sections", "CTA", "Success metric", "Traffic source"],
      difficulty: "Growth lab",
      estimated_time: "25 minutes",
      evaluation_criteria: ["Customer focus", "Measurable metric", "Feasible acquisition", "Persuasive positioning"],
    },
  ],
  "product manager": [
    {
      title: "Prioritize five competing feature requests",
      scenario: "Your team has one week left in the sprint and five stakeholders are pushing different features. You must choose two, explain trade-offs, and protect user value.",
      objective: "Rank features using impact, effort, risk, and user urgency.",
      deliverables: ["Ranked list", "Reasoning for top two", "One feature to reject", "Stakeholder message"],
      difficulty: "Starter sprint",
      estimated_time: "9 minutes",
      evaluation_criteria: ["Prioritization logic", "User empathy", "Trade-off clarity", "Communication"],
    },
  ],
  "software engineer": [
    {
      title: "Debug a broken onboarding counter",
      scenario: "A signup flow says users completed 0 steps even after finishing onboarding. You cannot write code yet. Your tech lead asks for a debugging plan and the likely root causes.",
      objective: "Explain how you would isolate the bug and communicate your decisions.",
      deliverables: ["Three likely causes", "Debugging sequence", "Data you would inspect", "Plain-English explanation"],
      difficulty: "Starter sprint",
      estimated_time: "9 minutes",
      evaluation_criteria: ["Systematic debugging", "Technical reasoning", "Communication", "Risk awareness"],
    },
  ],
  architect: [
    {
      title: "Design a tiny study room under constraints",
      scenario: "A client has a 2.5m × 3m room, one window, a tight budget, and needs a calm study/work space. You must propose a layout that balances light, storage, and movement.",
      objective: "Create a practical layout concept with clear constraints and trade-offs.",
      deliverables: ["Layout description", "Furniture choices", "Lighting plan", "Constraint trade-offs"],
      difficulty: "Starter sprint",
      estimated_time: "9 minutes",
      evaluation_criteria: ["Constraint handling", "Usability", "Aesthetic reasoning", "Client communication"],
    },
  ],
};

export function generateMission(profile: DreamProfile, previous: Evaluation[] = []): Mission {
  const key = Object.keys(missionTemplates).find((job) => profile.dreamJob.toLowerCase().includes(job)) || "entrepreneur";
  const templates = missionTemplates[key];
  const template = templates[previous.length % templates.length];
  return {
    id: crypto.randomUUID(),
    profession: profile.dreamJob,
    level: profile.experienceLevel,
    status: "active",
    createdAt: new Date().toISOString(),
    ...(template as Mission),
  };
}

export function evaluateSubmission(submission: string, mission: Mission): Evaluation {
  const words = submission.trim().split(/\s+/).filter(Boolean).length;
  const base = Math.min(90, 48 + Math.floor(words / 3));
  const metrics = {
    creativity: Math.min(100, base + (submission.match(/idea|new|different|experiment/gi)?.length || 0) * 3),
    practicality: Math.min(100, base + (submission.match(/metric|time|cost|risk|step/gi)?.length || 0) * 3),
    communication: Math.min(100, base + (submission.length > 450 ? 8 : 0)),
    execution: Math.min(100, base + mission.deliverables.filter((d) => submission.toLowerCase().includes(d.split(" ")[0].toLowerCase())).length * 4),
  };
  const score = Math.round(Object.values(metrics).reduce((a, b) => a + b, 0) / 4);
  return {
    id: crypto.randomUUID(),
    missionId: mission.id,
    submittedAt: new Date().toISOString(),
    score,
    metrics,
    strengths: ["You connected the assignment to a realistic workplace decision.", "Your response shows useful early-career judgment and initiative."],
    improvements: ["Add more measurable evidence or constraints next time.", "Make your final recommendation easier for a busy manager to act on."],
    nextChallenge: `Increase the realism: add a concrete metric, stakeholder, or constraint for your next ${mission.profession} mission.`,
    xpAwarded: 60 + Math.round(score * 1.4),
    coinsAwarded: 10 + Math.round(score / 10),
    submission,
  };
}
