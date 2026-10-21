// Vue component for skill matching display
const SkillMatch = {
  props: ['userSkills', 'requiredSkills'],
  data() {
    return {
      matchPercentage: 0,
      missingSkills: [],
      matchingSkills: []
    };
  },
  mounted() {
    this.calculateMatch();
  },
  methods: {
    calculateMatch() {
      if (!this.requiredSkills || this.requiredSkills.length === 0) {
        this.matchPercentage = 100;
        this.missingSkills = [];
        this.matchingSkills = this.userSkills || [];
        return;
      }

      if (!this.userSkills || this.userSkills.length === 0) {
        this.matchPercentage = 0;
        this.missingSkills = this.requiredSkills;
        this.matchingSkills = [];
        return;
      }

      const normalizedUserSkills = this.userSkills.map(s => s.toLowerCase().trim());
      const normalizedRequiredSkills = this.requiredSkills.map(s => s.toLowerCase().trim());

      // Find matching skills
      this.matchingSkills = this.requiredSkills.filter(skill =>
        normalizedUserSkills.includes(skill.toLowerCase().trim())
      );

      // Find missing skills
      this.missingSkills = this.requiredSkills.filter(skill =>
        !normalizedUserSkills.includes(skill.toLowerCase().trim())
      );

      // Calculate percentage
      this.matchPercentage = Math.round(
        (this.matchingSkills.length / this.requiredSkills.length) * 100
      );
    },
    getMatchColor() {
      if (this.matchPercentage >= 80) return 'text-green-600 dark:text-green-400';
      if (this.matchPercentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
      return 'text-red-600 dark:text-red-400';
    },
    getProgressColor() {
      if (this.matchPercentage >= 80) return 'bg-green-600';
      if (this.matchPercentage >= 50) return 'bg-yellow-600';
      return 'bg-red-600';
    }
  },
  template: `
    <div class="skill-match-component">
      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium">Skill Match</span>
          <span class="text-2xl font-bold" :class="getMatchColor()">{{ matchPercentage }}%</span>
        </div>
        <div class="progress-bar">
          <div class="h-full transition-all duration-500 rounded-full" 
               :class="getProgressColor()"
               :style="{ width: matchPercentage + '%' }"></div>
        </div>
      </div>

      <div v-if="matchingSkills.length > 0" class="mb-4">
        <h4 class="text-sm font-medium mb-2 text-green-600 dark:text-green-400">✓ Matching Skills</h4>
        <div class="flex flex-wrap gap-2">
          <span v-for="skill in matchingSkills" :key="skill" 
                class="badge badge-success">
            {{ skill }}
          </span>
        </div>
      </div>

      <div v-if="missingSkills.length > 0" class="mb-4">
        <h4 class="text-sm font-medium mb-2 text-red-600 dark:text-red-400">✗ Missing Skills</h4>
        <div class="flex flex-wrap gap-2">
          <span v-for="skill in missingSkills" :key="skill" 
                class="badge badge-danger">
            {{ skill }}
          </span>
        </div>
      </div>

      <div v-if="matchPercentage === 100" class="alert alert-success">
        Perfect match! You have all the required skills.
      </div>
      <div v-else-if="matchPercentage >= 70" class="alert bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200">
        Great match! You're well-suited for this project.
      </div>
      <div v-else-if="matchPercentage >= 40" class="alert bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200">
        Good match! Consider learning the missing skills.
      </div>
      <div v-else class="alert bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200">
        This project may be challenging. Focus on building these skills first.
      </div>
    </div>
  `
};
