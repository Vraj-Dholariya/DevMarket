// Vue component for project progress tracking
const ProgressTracker = {
  props: {
    projectId: {
      type: String,
      required: true
    },
    initialMilestones: {
      type: Array,
      default: () => []
    },
    isOwner: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      milestones: [],
      newMilestoneTitle: '',
      isLoading: false
    };
  },
  mounted() {
    // Parse initialMilestones if it's a string
    try {
      if (typeof this.initialMilestones === 'string') {
        this.milestones = JSON.parse(this.initialMilestones);
      } else if (Array.isArray(this.initialMilestones)) {
        this.milestones = this.initialMilestones;
      } else {
        this.milestones = [];
      }
      console.log('Loaded milestones:', this.milestones);
      console.log('Is owner:', this.isOwner);
    } catch (error) {
      console.error('Error parsing milestones:', error);
      this.milestones = [];
    }
  },
  computed: {
    progressPercentage() {
      if (this.milestones.length === 0) return 0;
      const completed = this.milestones.filter(m => m.completed).length;
      return Math.round((completed / this.milestones.length) * 100);
    },
    completedCount() {
      return this.milestones.filter(m => m.completed).length;
    }
  },
  methods: {
    async addMilestone() {
      if (!this.newMilestoneTitle.trim()) return;
      
      this.isLoading = true;
      try {
        const response = await fetch(`/projects/${this.projectId}/milestones`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title: this.newMilestoneTitle })
        });

        const data = await response.json();
        
        if (data.success) {
          this.milestones.push(data.milestone);
          this.newMilestoneTitle = '';
        }
      } catch (error) {
        console.error('Add milestone error:', error);
        alert('Could not add milestone');
      } finally {
        this.isLoading = false;
      }
    },
    async toggleMilestone(milestone) {
      try {
        const response = await fetch(
          `/projects/${this.projectId}/milestones/${milestone._id}/toggle`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        const data = await response.json();
        
        if (data.success) {
          milestone.completed = data.completed;
        }
      } catch (error) {
        console.error('Toggle milestone error:', error);
        alert('Could not update milestone');
      }
    },
    getProgressColor() {
      if (this.progressPercentage >= 80) return 'bg-green-600';
      if (this.progressPercentage >= 50) return 'bg-yellow-600';
      if (this.progressPercentage > 0) return 'bg-blue-600';
      return 'bg-gray-300 dark:bg-gray-600';
    }
  },
  template: `
    <div class="progress-tracker-component">
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-lg font-semibold">Project Progress</h3>
          <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {{ progressPercentage }}%
          </span>
        </div>
        <div class="progress-bar">
          <div class="h-full transition-all duration-500 rounded-full"
               :class="getProgressColor()"
               :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {{ completedCount }} of {{ milestones.length }} milestones completed
        </p>
      </div>

      <div v-if="isOwner" class="mb-6">
        <h4 class="font-medium mb-3">Add New Milestone</h4>
        <div class="flex gap-2">
          <input
            v-model="newMilestoneTitle"
            @keyup.enter="addMilestone"
            type="text"
            placeholder="Enter milestone title..."
            class="input flex-1"
            :disabled="isLoading"
          />
          <button
            @click="addMilestone"
            class="btn btn-primary"
            :disabled="isLoading || !newMilestoneTitle.trim()"
          >
            Add
          </button>
        </div>
      </div>

      <div class="space-y-3">
        <h4 class="font-medium">Milestones</h4>
        
        <div v-if="milestones.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No milestones yet.</p>
          <p v-if="isOwner" class="text-sm mt-2">Add your first milestone to track progress!</p>
        </div>

        <div
          v-for="milestone in milestones"
          :key="milestone._id"
          class="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <input
            type="checkbox"
            :checked="milestone.completed"
            @change="toggleMilestone(milestone)"
            class="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <div class="flex-1">
            <p
              :class="{ 
                'line-through text-gray-500 dark:text-gray-400': milestone.completed,
                'text-gray-900 dark:text-gray-100': !milestone.completed
              }"
            >
              {{ milestone.title }}
            </p>
          </div>
          <span
            v-if="milestone.completed"
            class="badge badge-success"
          >
            ✓ Complete
          </span>
        </div>
      </div>
    </div>
  `
};
