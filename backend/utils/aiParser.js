import { getAIClient, runAIPrompt } from '../config/ai.js';
import { analyzeResumeOffline } from './nlpParser.js';

/**
 * High-performance orchestrator for Resume Analysis.
 * Orchestrates online AI analysis (Gemini/OpenAI) or falls back to
 * a local, high-fidelity offline rule-based NLP parser automatically.
 */
/**
 * Reshapes the flat offline NLP result into the expected {skills, experience, education, projects, contact, analysis} structure.
 */
const shapeOfflineResult = (offlineResult) => {
  const {
    overallScore,
    atsFriendliness,
    skillRelevance,
    formattingQuality,
    experienceQuality,
    projectRelevance,
    keywordOptimization,
    grammarReadability,
    keywordMatch,
    contact,
    skills,
    education,
    experience,
    projects,
    suggestions,
    recruiterInsights
  } = offlineResult;

  return {
    skills,
    experience,
    education,
    projects,
    contact,
    analysis: {
      overallScore,
      atsFriendliness,
      skillRelevance,
      formattingQuality,
      experienceQuality,
      projectRelevance,
      keywordOptimization,
      grammarReadability,
      keywordMatch,
      suggestions,
      recruiterInsights
    }
  };
};

export const analyzeResume = async (resumeText, jobDescription = '', userSettings = null) => {
  const { isConfigured } = getAIClient();

  // If user provides a custom API key in their settings, we can dynamically override the environment
  const geminiKey = userSettings?.customApiKey || process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!isConfigured && !userSettings?.customApiKey) {
    console.log('ℹ️ Utilizing high-fidelity Offline Heuristic NLP Parser.');
    return shapeOfflineResult(analyzeResumeOffline(resumeText, jobDescription));
  }

  // Construct structured analysis prompt
  const systemInstruction = `You are a Recruiter-Grade ATS and Resume Analytics Engine.
Analyze the following resume text and compare it with the Job Description (if provided).
Your response MUST be a strictly formatted JSON object matching this structure:
{
  "skills": {
    "technical": ["skill1", "skill2"],
    "tools": ["tool1", "tool2"],
    "soft": ["softskill1"]
  },
  "experience": [
    { "role": "Role Title", "company": "Company Name", "duration": "Duration/Dates", "details": "Key accomplishments" }
  ],
  "education": [
    { "degree": "Degree", "school": "School Name", "year": "Graduation Year", "gpa": "GPA or N/A" }
  ],
  "projects": [
    { "name": "Project Name", "tech": ["React", "Node"], "details": "Description of project" }
  ],
  "contact": {
    "email": "Email Address",
    "phone": "Phone Number",
    "linkedin": "LinkedIn URL",
    "github": "GitHub URL",
    "portfolio": "Portfolio/Website URL"
  },
  "analysis": {
    "overallScore": 85, // Integer 0-100
    "atsFriendliness": 80, // Integer 0-100
    "skillRelevance": 90, // Integer 0-100
    "formattingQuality": 85, // Integer 0-100
    "experienceQuality": 80, // Integer 0-100
    "projectRelevance": 85, // Integer 0-100
    "keywordOptimization": 75, // Integer 0-100
    "grammarReadability": 90, // Integer 0-100
    "keywordMatch": {
      "percentage": 65, // Jaccard similarity percentage or keyword overlap
      "matched": ["react", "node"],
      "missing": ["docker", "typescript"]
    },
    "suggestions": {
      "missingSkills": ["Docker", "TypeScript"],
      "wordingImprovements": ["Replace 'helped with database' with 'Engineered indexed MongoDB schemas, reducing latency by 40%'"],
      "atsTips": ["Save as a clean PDF to prevent document format corruptions in ATS machines."],
      "projectRecommendations": ["Design a cloud deployment workflow using AWS or GCP to highlight infrastructure skills."],
      "actionVerbs": ["Spearheaded", "Optimized", "Architected"],
      "industryImprovements": ["Categorize technical expertise into distinct lists (Databases, Languages, Frontends) for immediate readability."]
    },
    "recruiterInsights": "Recruiter grade evaluation summary (1-2 sentences) about their profile viability."
  }
}`;

  const prompt = `
RESUME TEXT:
"""
${resumeText.slice(0, 10000)} 
"""

JOB DESCRIPTION (IF APPLICABLE):
"""
${jobDescription ? jobDescription.slice(0, 5000) : 'Not Provided'}
"""

Please run a comprehensive analysis. Make sure the JSON keys match the specified schema exactly. All score ratings should be granular and integers between 0 and 100.
`;

  try {
    console.log('🤖 Invoking LLM Parser for Resume Analysis...');
    const result = await runAIPrompt(prompt, systemInstruction);

    // Safety check and merge contact details from offline regex if AI missed them
    const offlineContact = analyzeResumeOffline(resumeText, '').contact;
    const finalContact = {
      email: result.contact?.email || offlineContact.email || '',
      phone: result.contact?.phone || offlineContact.phone || '',
      linkedin: result.contact?.linkedin || offlineContact.linkedin || '',
      github: result.contact?.github || offlineContact.github || '',
      portfolio: result.contact?.portfolio || offlineContact.portfolio || ''
    };

    return {
      skills: result.skills || { technical: [], tools: [], soft: [] },
      experience: result.experience || [],
      education: result.education || [],
      projects: result.projects || [],
      contact: finalContact,
      analysis: result.analysis || {
        overallScore: 60,
        atsFriendliness: 60,
        skillRelevance: 60,
        formattingQuality: 60,
        experienceQuality: 60,
        projectRelevance: 60,
        keywordOptimization: 60,
        grammarReadability: 60,
        keywordMatch: { percentage: 0, matched: [], missing: [] },
        suggestions: { missingSkills: [], wordingImprovements: [], atsTips: [], projectRecommendations: [], actionVerbs: [], industryImprovements: [] },
        recruiterInsights: 'Analysis completed.'
      }
    };
  } catch (err) {
    console.error('⚠️ LLM Parsing failed, using robust Offline NLP Fallback:', err.message);
    return shapeOfflineResult(analyzeResumeOffline(resumeText, jobDescription));
  }
};
