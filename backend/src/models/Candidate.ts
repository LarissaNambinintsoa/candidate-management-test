import mongoose, { Schema, Document } from 'mongoose';

export interface ICandidate extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  experience: number;
  skills: string[];
  isValidated: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CandidateSchema = new Schema({
  firstName: { type: String, required: true, trim: true, minlength: 2 },
  lastName: { type: String, required: true, trim: true, minlength: 2 },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true, match: /^\+?[0-9]{10,15}$/ },
  position: { type: String, required: true },
  experience: { type: Number, required: true, min: 0, max: 50 },
  skills: { type: [String], required: true, default: [] },
  isValidated: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null }
}, {
  timestamps: true
});

// Middleware pour exclure les documents soft-deleted des requêtes find
CandidateSchema.pre('find', function(this: any) {
  this.where({ deletedAt: null });
});

CandidateSchema.pre('findOne', function(this: any) {
  this.where({ deletedAt: null });
});

// Index pour améliorer les performances des soft deletes
CandidateSchema.index({ deletedAt: 1 });

export const Candidate = mongoose.model<ICandidate>('Candidate', CandidateSchema);