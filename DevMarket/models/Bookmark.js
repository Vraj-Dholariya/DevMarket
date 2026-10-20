const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure each user can bookmark a project only once
bookmarkSchema.index({ user: 1, project: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
