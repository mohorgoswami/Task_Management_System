const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [500, 'Project description cannot exceed 500 characters']
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  updatedDate: {
    type: Date,
    default: Date.now
  },
  taskCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for tasks
projectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project'
});

// Update the updatedDate before saving
projectSchema.pre('save', function(next) {
  this.updatedDate = Date.now();
  next();
});

// Update task count when tasks are added/removed
projectSchema.methods.updateTaskCount = async function() {
  const Task = mongoose.model('Task');
  this.taskCount = await Task.countDocuments({ project: this._id });
  await this.save();
};

module.exports = mongoose.model('Project', projectSchema);