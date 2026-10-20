// Calculate skill match percentage between user skills and required skills
const calculateSkillMatch = (userSkills, requiredSkills) => {
  if (!requiredSkills || requiredSkills.length === 0) {
    return { percentage: 100, missingSkills: [] };
  }

  if (!userSkills || userSkills.length === 0) {
    return { percentage: 0, missingSkills: requiredSkills };
  }

  // Normalize skills to lowercase for comparison
  const normalizedUserSkills = userSkills.map(skill => skill.toLowerCase().trim());
  const normalizedRequiredSkills = requiredSkills.map(skill => skill.toLowerCase().trim());

  // Find matching skills
  const matchingSkills = normalizedRequiredSkills.filter(skill => 
    normalizedUserSkills.includes(skill)
  );

  // Find missing skills
  const missingSkills = requiredSkills.filter(skill => 
    !normalizedUserSkills.includes(skill.toLowerCase().trim())
  );

  // Calculate percentage
  const percentage = Math.round((matchingSkills.length / normalizedRequiredSkills.length) * 100);

  return { percentage, missingSkills };
};

// Calculate project readiness score
const calculateReadinessScore = (project) => {
  let score = 0;
  let maxScore = 100;

  // Description completeness (20 points)
  if (project.description && project.description.length >= 100) {
    score += 20;
  } else if (project.description && project.description.length >= 50) {
    score += 10;
  }

  // Required skills defined (20 points)
  if (project.requiredSkills && project.requiredSkills.length >= 3) {
    score += 20;
  } else if (project.requiredSkills && project.requiredSkills.length > 0) {
    score += 10;
  }

  // Technologies defined (15 points)
  if (project.technologies && project.technologies.length >= 2) {
    score += 15;
  } else if (project.technologies && project.technologies.length > 0) {
    score += 8;
  }

  // Has team members (15 points)
  if (project.teamMembers && project.teamMembers.length > 0) {
    score += 15;
  }

  // Has milestones (20 points)
  if (project.milestones && project.milestones.length >= 3) {
    score += 20;
  } else if (project.milestones && project.milestones.length > 0) {
    score += 10;
  }

  // Category and difficulty set (10 points)
  if (project.category && project.difficulty) {
    score += 10;
  }

  return Math.min(score, maxScore);
};

module.exports = { calculateSkillMatch, calculateReadinessScore };
