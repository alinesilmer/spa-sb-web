# Backend Setup Guide for Sentirse Bien Spa

This document provides comprehensive instructions for setting up the backend for the Sentirse Bien Spa website. The backend uses Firebase for authentication and database, and Node.js for API endpoints and business logic.

## Table of Contents

1. [Firebase Setup](#firebase-setup)
2. [Node.js Backend Setup](#nodejs-backend-setup)
3. [API Endpoints](#api-endpoints)
4. [Database Structure](#database-structure)
5. [Environment Variables](#environment-variables)
6. [Frontend Integration](#frontend-integration)
7. [Deployment](#deployment)

## Firebase Setup

### Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable Google Analytics if desired

### Step 2: Set Up Authentication

1. In the Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Enable the following sign-in methods:
   - Email/Password
   - Google (optional)
4. Configure the authorized domains to include your frontend domain

### Step 3: Set Up Firestore Database

1. In the Firebase Console, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in production mode" and select a location close to your target audience
4. Set up the following security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read all documents
    match /{document=**} {
      allow read: if request.auth != null;
    }

    // Users collection
    match /users/{userId} {
      // Users can only write to their own document
      allow write: if request.auth != null && request.auth.uid == userId;
      // Admins can write to any user document
      allow write: if request.auth != null &&
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Services collection
    match /services/{serviceId} {
      // Anyone can read services
      allow read: if true;
      // Only admins can write to services
      allow write: if request.auth != null &&
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Bookings collection
    match /bookings/{bookingId} {
      // Users can read their own bookings
      allow read: if request.auth != null &&
                   resource.data.userId == request.auth.uid;
      // Professionals can read bookings assigned to them
      allow read: if request.auth != null &&
                   resource.data.professionalId == request.auth.uid;
      // Admins can read all bookings
      allow read: if request.auth != null &&
                   get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      // Users can create bookings for themselves
      allow create: if request.auth != null &&
                     request.resource.data.userId == request.auth.uid;
      // Users can update their own bookings
      allow update: if request.auth != null &&
                     resource.data.userId == request.auth.uid;
      // Professionals can update bookings assigned to them
      allow update: if request.auth != null &&
                     resource.data.professionalId == request.auth.uid;
      // Admins can update all bookings
      allow update: if request.auth != null &&
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Contact messages collection
    match /contactMessages/{messageId} {
      // Anyone can create contact messages
      allow create: if true;
      // Only admins can read and update contact messages
      allow read, update: if request.auth != null &&
                            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```
