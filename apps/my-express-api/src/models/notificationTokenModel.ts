import mongoose,  { Document, Model } from 'mongoose';

interface PushTokenDocument extends Document {
  token: string;
  userId?: mongoose.Types.ObjectId;
  deviceId?: string;
  platform?: 'ios' | 'android' | 'web';
  appVersion?: string;
  isActive: boolean;
  lastUsed: Date;
}

interface PushTokenModel extends Model<PushTokenDocument> {
  getActiveTokens(userId?: mongoose.Types.ObjectId): Promise<PushTokenDocument[]>;
  deactivate(): Promise<PushTokenDocument>;
}

const pushTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model if you have one
    required: false // Optional if you want to support anonymous users
  },
  deviceId: {
    type: String,
    required: false,
    index: true // For finding tokens by device
  },
  platform: {
    type: String,
    enum: ['ios', 'android', 'web'],
    required: false
  },
  appVersion: {
    type: String,
    required: false
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  lastUsed: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
pushTokenSchema.pre('save', function(next) {
  this.updatedAt = new Date(Date.now());
  next();
});

// Static method to clean up expired tokens
pushTokenSchema.statics.cleanupExpiredTokens = function() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return this.deleteMany({
    lastUsed: { $lt: thirtyDaysAgo },
    isActive: false
  });
};

// Static method to get all active tokens
pushTokenSchema.statics.getActiveTokens = function(userId = null) {
  const query: { isActive: boolean; userId?: mongoose.Schema.Types.ObjectId } = { isActive: true };
  if (userId) {
    query.userId = userId;
  }
  return this.find(query).select('token');
};

// Instance method to mark token as inactive
pushTokenSchema.methods.deactivate = function() {
  this.isActive = false;
  this.updatedAt = Date.now();
  return this.save();
};

const PushToken = mongoose.model<PushTokenDocument, PushTokenModel>('PushToken', pushTokenSchema);

export default PushToken;