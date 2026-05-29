import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { useLocalFallback, LOCAL_DB_PATH } from '../config/db.js';

// Define Mongoose Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  settings: {
    theme: { type: String, default: 'dark' },
    customApiKey: { type: String, default: '' }
  }
}, { timestamps: true });

let UserModel;

if (!useLocalFallback) {
  UserModel = mongoose.models.User || mongoose.model('User', userSchema);
} else {
  // File-based Mock model matching Mongoose syntax
  class MockUserModel {
    _read() {
      if (!fs.existsSync(LOCAL_DB_PATH)) {
        fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify({ users: [], resumes: [], sessions: [] }, null, 2));
      }
      const data = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
      return data.users || [];
    }

    _write(users) {
      const data = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
      data.users = users;
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
    }

    async findOne(query) {
      const users = this._read();
      return users.find(u => {
        if (query.email && u.email !== query.email) return false;
        if (query._id && u._id !== query._id) return false;
        return true;
      }) || null;
    }

    async findById(id) {
      const users = this._read();
      return users.find(u => u._id === id) || null;
    }

    async create(userData) {
      const users = this._read();
      
      // Check unique email
      if (users.some(u => u.email === userData.email)) {
        throw new Error('Email already exists');
      }

      const newUser = {
        _id: 'u_' + Math.random().toString(36).substring(2, 11),
        username: userData.username,
        email: userData.email,
        password: userData.password,
        settings: {
          theme: userData.settings?.theme || 'dark',
          customApiKey: userData.settings?.customApiKey || ''
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      users.push(newUser);
      this._write(users);
      return newUser;
    }

    async findByIdAndUpdate(id, update, options = {}) {
      const users = this._read();
      const index = users.findIndex(u => u._id === id);
      if (index === -1) return null;

      // Handle nested settings updates
      const updatedUser = {
        ...users[index],
        ...update,
        settings: {
          ...users[index].settings,
          ...(update.settings || {})
        },
        updatedAt: new Date().toISOString()
      };

      users[index] = updatedUser;
      this._write(users);
      return updatedUser;
    }
  }

  UserModel = new MockUserModel();
}

export default UserModel;
