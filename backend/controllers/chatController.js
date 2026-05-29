import { runAIPrompt, getAIClient } from '../config/ai.js';
import ResumeModel from '../models/Resume.js';
import UserModel from '../models/User.js';

// Pre-baked offline chatbot responses based on question keywords
const getOfflineChatResponse = (message, resumeContext = null) => {
  const msg = message.toLowerCase();
  
  const skillsList = resumeContext?.skills?.technical?.join(', ') || 'your tech stack';
  const score = resumeContext?.analysis?.overallScore || 'your evaluation score';

  if (msg.includes('score') || msg.includes('grade') || msg.includes('points')) {
    return `Your resume has an overall score of **${score}/100**. To boost it higher:
1. Double check that you've got an active GitHub and LinkedIn link in your header (+15 points).
2. Integrate more technical keywords directly matching the Job Description (+15-20 points).
3. Frame your experience bullet points using strong action verbs coupled with quantifiable metrics (e.g., 'saved 30 hours weekly by spearheading automation').`;
  }
  
  if (msg.includes('verb') || msg.includes('word') || msg.includes('action')) {
    return `Using active, impactful verbs is crucial for modern resumes! Avoid passive phrases like "Responsible for..." or "Worked on...".
Instead, start every single bullet point with verbs like:
* **Spearheaded** (e.g., *Spearheaded migration of legacy tables to Postgres...*)
* **Architected** (e.g., *Architected scalable microservices under AWS EKS...*)
* **Optimized** (e.g., *Optimized frontend payload bundles, yielding 25% faster render speeds...*)
* **Automated** (e.g., *Automated Jenkins integration scripts, shaving 4 hours off build times.*)`;
  }

  if (msg.includes('skill') || msg.includes('languages') || msg.includes('technolog')) {
    return `For skill optimization, ensure your core technical strengths are categorized clearly. 
Based on your file, your registered technical items include: *${skillsList}*.
* **Recruiter Recommendation**: Place your Skill category near the top if you're a junior developer, or on a compact sidebar if you're using a modern two-column layout. Avoid adding tools or soft skills to your hard tech lists. Keep them separate.`;
  }

  if (msg.includes('project') || msg.includes('portfolio')) {
    return `To make your projects sound recruiter-grade:
1. Don't just list what the project is—explain **why** you built it and the **business/technical result**.
2. Format your descriptions using the **STAR method** (Situation, Task, Action, Result).
3. Explicitly state the tech stack at the bottom of the project card, e.g., *[React, Node.js, Express, Docker]*.`;
  }

  if (msg.includes('experience') || msg.includes('job') || msg.includes('work')) {
    return `For work experience sections:
1. Limit descriptions to 3-5 bullet points per company.
2. Focus on **accomplishments and deliverables**, not just daily duties. Use numbers whenever possible (e.g., managed $5k budget, scaled database to 10k active users).
3. If you have gaps, keep date lists strictly to years (e.g., 2021 - 2022) to maintain a cohesive flow.`;
  }

  if (msg.includes('ats') || msg.includes('bot') || msg.includes('format')) {
    return `To stay highly ATS-compliant:
1. **Never** put vital text inside custom SVG graphics, floating text boxes, or complex tables. Many older parsers skip these entirely.
2. Use standard headers like **Professional Experience**, **Education**, and **Technical Skills** instead of creative alternatives like "My Journey" or "Places I've Been".
3. Save your file in standard PDF format. If using Microsoft Word, keep formatting extremely simple and standard.`;
  }

  return `Hello! I'm your AI Resume Coach. I've analyzed your profile details. 

Feel free to ask me questions like:
* *How can I optimize my projects section?*
* *How do I write better bullet points with action verbs?*
* *What is holding back my ATS score?*
* *Which of my skills are most in-demand?*

I'm ready to help you optimize this resume for placement!`;
};

/**
 * Handle AI Resume Coaching Chat sessions
 */
export const handleResumeChat = async (req, res) => {
  const { message, resumeId } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Please provide a chat message' });
  }

  try {
    let resumeContext = null;

    // If a resume ID was linked, extract the parsed content for AI context
    if (resumeId) {
      resumeContext = await ResumeModel.findById(resumeId);
      // Validate ownership
      if (resumeContext && resumeContext.userId !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Access denied to this resume data' });
      }
    }

    const { isConfigured } = getAIClient();
    
    // Retrieve user settings to get any potential user-configured API key
    const user = await UserModel.findById(req.user.id);
    const userSettings = user?.settings || null;

    // Use AI if configured
    if (isConfigured || userSettings?.customApiKey) {
      console.log('🤖 Sending chatbot inquiry to LLM Advisor...');
      
      const contextText = resumeContext 
        ? `RESUME OWNER: ${user?.username || 'User'}
           RESUME TEXT: 
           """
           ${resumeContext.parsedText.slice(0, 4000)}
           """
           CURRENT METRICS: Score: ${resumeContext.analysis.overallScore}/100. Tech Skills: ${resumeContext.skills.technical.join(', ')}`
        : 'No specific resume is currently loaded.';

      const systemPrompt = `You are a Senior Recruiter and Professional Career Advisor Chatbot.
Your goal is to provide elite, actionable, and friendly recommendations to help candidates optimize their resumes and land top tier placements.
Use Markdown formatting, bold headings, and bullet points. Be specific and reference their resume details if context is provided.`;

      const prompt = `
CONTEXT DETAILS:
${contextText}

USER QUESTION:
"${message}"

Provide a comprehensive, recruiter-grade answer. Be encouraging but highly analytical and practical. Keep it concise enough for a chat screen (2-3 short paragraphs or clean bullet points).
`;
      
      try {
        const responseJson = await runAIPrompt(prompt, systemPrompt);
        
        // Sometimes JSON-mode returns the message wrapped in a key. Let's inspect it.
        const replyText = responseJson.message || responseJson.response || responseJson.reply || JSON.stringify(responseJson);
        
        return res.status(200).json({
          success: true,
          reply: replyText
        });
      } catch (aiErr) {
        console.error('⚠️ LLM Chat execution error, falling back to offline patterns:', aiErr.message);
      }
    }

    // Offline heuristic fallback response
    console.log('ℹ️ Running offline rule chatbot assistant.');
    const replyText = getOfflineChatResponse(message, resumeContext);
    
    res.status(200).json({
      success: true,
      reply: replyText
    });

  } catch (error) {
    console.error('❌ Resume Chat Advisor Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to process advice inquiry' });
  }
};
