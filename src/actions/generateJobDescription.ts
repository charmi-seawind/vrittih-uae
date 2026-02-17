"use server";

interface JobDescriptionParams {
  jobTitle: string;
  company: string;
  requirements?: string[];
  responsibilities?: string[];
}

export const generateJobDescription = async (params: JobDescriptionParams) => {
  try {
    const { jobTitle, company, requirements = [], responsibilities = [] } = params;

    // Generate a basic job description template
    const description = `
We are looking for a talented ${jobTitle} to join our team at ${company}.

Key Responsibilities:
${responsibilities.length > 0 
  ? responsibilities.map(item => `• ${item}`).join('\n')
  : `• Perform duties related to ${jobTitle} role
• Collaborate with team members
• Meet project deadlines and deliverables`
}

Requirements:
${requirements.length > 0
  ? requirements.map(item => `• ${item}`).join('\n')
  : `• Relevant experience in ${jobTitle} field
• Strong communication skills
• Ability to work in a team environment`
}

What We Offer:
• Competitive salary
• Health benefits
• Professional development opportunities
• Collaborative work environment
    `.trim();

    return { success: true, description };
  } catch (error) {
    return { error: "Failed to generate job description!" };
  }
};