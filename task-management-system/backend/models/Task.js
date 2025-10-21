const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Task title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Task description is required'],
    trim: true,
    maxlength: [1000, 'Task description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    required: [true, 'Task status is required'],
    enum: {
      values: ['To Do', 'In Progress', 'Done'],
      message: 'Status must be either To Do, In Progress, or Done'
    },
    default: 'To Do'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Task must belong to a project']
  },
  priority: {
    type: String,
    enum: {
      values: ['Low', 'Medium', 'High'],
      message: 'Priority must be either Low, Medium, or High'
    },
    default: 'Medium'
  },
  order: {
    type: Number,
    default: 0
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  updatedDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ project: 1, order: 1 });

// Update the updatedDate before saving
taskSchema.pre('save', function(next) {
  this.updatedDate = Date.now();
  next();
});

// Update project's task count after task operations
taskSchema.post('save', async function() {
  const Project = mongoose.model('Project');
  const project = await Project.findById(this.project);
  if (project) {
    await project.updateTaskCount();
  }
});

taskSchema.post('remove', async function() {
  const Project = mongoose.model('Project');
  const project = await Project.findById(this.project);
  if (project) {
    await project.updateTaskCount();
  }
});

// Static method to get tasks by status for a project
taskSchema.statics.getTasksByStatus = function(projectId, status) {
  return this.find({ project: projectId, status: status }).sort({ order: 1 });
};

// Static method to get all tasks organized by status
taskSchema.statics.getTasksGroupedByStatus = async function(projectId) {
  const tasks = await this.find({ project: projectId }).sort({ order: 1 });
  
  return {
    'To Do': tasks.filter(task => task.status === 'To Do'),
    'In Progress': tasks.filter(task => task.status === 'In Progress'),
    'Done': tasks.filter(task => task.status === 'Done')
  };
};

module.exports = mongoose.model('Task', taskSchema);