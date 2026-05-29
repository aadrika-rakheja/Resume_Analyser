import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { useLocalFallback, LOCAL_DB_PATH } from '../config/db.js';

const resumeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  filename: { type: String, required: true },
  parsedText: { type: String, default: '' },
  jobDescription: { type: String, default: '' },
  skills: {
    technical: [String],
    tools: [String],
    soft: [String]
  },
  experience: [{
    role: String,
    company: String,
    duration: String,
    details: String
  }],
  education: [{
    degree: String,
    school: String,
    year: String,
    gpa: String
  }],
  projects: [{
    name: String,
    tech: [String],
    details: String
  }],
  contact: {
    email: String,
    phone: String,
    linkedin: String,
    github: String,
    portfolio: String
  },
  analysis: {
    overallScore: { type: Number, default: 0 },
    atsFriendliness: { type: Number, default: 0 },
    skillRelevance: { type: Number, default: 0 },
    formattingQuality: { type: Number, default: 0 },
    experienceQuality: { type: Number, default: 0 },
    projectRelevance: { type: Number, default: 0 },
    keywordOptimization: { type: Number, default: 0 },
    grammarReadability: { type: Number, default: 0 },
    keywordMatch: {
      percentage: { type: Number, default: 0 },
      matched: [String],
      missing: [String]
    },
    suggestions: {
      missingSkills: [String],
      wordingImprovements: [String],
      atsTips: [String],
      projectRecommendations: [String],
      actionVerbs: [String],
      industryImprovements: [String]
    },
    recruiterInsights: { type: String, default: '' }
  }
}, { timestamps: true });

let ResumeModel;

if (!useLocalFallback) {
  ResumeModel = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
} else {
  class MockResumeModel {
    _read() {
      if (!fs.existsSync(LOCAL_DB_PATH)) {
        fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify({ users: [], resumes: [], sessions: [] }, null, 2));
      }
      const data = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
      return data.resumes || [];
    }

    _write(resumes) {
      const data = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
      data.resumes = resumes;
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
    }

    async find(query = {}) {
      const resumes = this._read();
      return resumes.filter(r => {
        for (let key in query) {
          if (r[key] !== query[key]) return false;
        }
        return true;
      }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    async findById(id) {
      const resumes = this._read();
      return resumes.find(r => r._id === id) || null;
    }

    async findOne(query = {}) {
      const resumes = this._read();
      return resumes.find(r => {
        for (let key in query) {
          if (r[key] !== query[key]) return false;
        }
        return true;
      }) || null;
    }

    async create(resumeData) {
      const resumes = this._read();
      const newResume = {
        _id: 'r_' + Math.random().toString(36).substring(2, 11),
        ...resumeData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      resumes.push(newResume);
      this._write(resumes);
      return newResume;
    }

    async findByIdAndUpdate(id, update, options = {}) {
      const resumes = this._read();
      const index = resumes.findIndex(r => r._id === id);
      if (index === -1) return null;

      const updatedResume = {
        ...resumes[index],
        ...update,
        analysis: {
          ...resumes[index].analysis,
          ...(update.analysis || {})
        },
        updatedAt: new Date().toISOString()
      };

      resumes[index] = updatedResume;
      this._write(resumes);
      return updatedResume;
    }

    async findByIdAndDelete(id) {
      const resumes = this._read();
      const index = resumes.findIndex(r => r._id === id);
      if (index === -1) return null;
      const deletedResume = resumes[index];
      resumes.splice(index, 1);
      this._write(resumes);
      return deletedResume;
    }
  }

  ResumeModel = new MockResumeModel();
}

export default ResumeModel;
