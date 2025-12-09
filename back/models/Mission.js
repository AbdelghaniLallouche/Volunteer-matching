const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requiredSkills: [{
    type: String
  }],
  interests: [{
    type: String
  }],
  wilaya: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  images: [{
    type: String
  }],
  associationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Association',
    required: true
  },
  applicants: [{
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Volunteer'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  }],
  acceptedVolunteers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer'
  }],
  maxVolunteers: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'completed'],
    default: 'open'
  }
}, {
  timestamps: true
});

// Cascade delete - remove mission references from volunteers when mission is deleted
missionSchema.pre('deleteOne', { document: true, query: false }, async function() {
  try {
    const Volunteer = require('./Volunteer');
    
    // Remove from appliedMissions
    await Volunteer.updateMany(
      { 'appliedMissions.missionId': this._id },
      { $pull: { appliedMissions: { missionId: this._id } } }
    );
    
    // Remove from history
    await Volunteer.updateMany(
      { history: this._id },
      { $pull: { history: this._id } }
    );
    
    console.log(`Cascade delete: Removed mission ${this._id} from all volunteers`);
  } catch (error) {
    console.error('Cascade delete error:', error);
    throw error;
  }
});

module.exports = mongoose.model('Mission', missionSchema);
