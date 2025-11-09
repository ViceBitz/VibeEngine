# Migration Summary: AWS Amplify → Express + MongoDB

## Overview

This document summarizes the migration of the AIATL application from AWS Amplify (DynamoDB) to Express.js + MongoDB.

## What Was Migrated

### Backend (Server)

✅ **Authentication System**
- Migrated from AWS Cognito to JWT-based authentication
- Password hashing with bcrypt
- User registration and login endpoints

✅ **Database Models**
- `User` model (email, password, githubToken)
- `Project` model (userId, repoId)
- `Feature` model (projectId, featureName, summaries, filenames, neighbors)

✅ **API Routes**
- `/api/auth/*` - Authentication endpoints
- `/api/github/*` - GitHub OAuth and repository operations
- `/api/gemini/*` - Gemini AI integration
- `/api/projects/*` - Project and feature management
- `/api/workflows/*` - Workflow orchestration

✅ **GitHub Integration**
- OAuth flow (get URL, handle callback)
- Repository listing
- File content retrieval
- Repository connection

✅ **Gemini AI Integration**
- Feature generation (promptType 1)
- Map generation (promptType 2)
- Context gathering (promptType 3)
- Code generation (promptType 4)
- Function calling support

✅ **Workflow System**
- Onboarding workflow (analyze repo, generate features)
- Modification workflow (AI code changes)
- Workflow status tracking

### Frontend (React)

✅ **API Client** (`src/lib/api.ts`)
- Replaces `aws-amplify/data` client
- REST API calls with JWT authentication
- Organized by feature (auth, github, gemini, projects, workflows)

✅ **Authentication Context** (`src/contexts/AuthContext.tsx`)
- Replaces Amplify Auth hooks
- JWT token management
- User state management

✅ **Components Migrated**
- `ConnectGithub` - Uses new API client
- `Dashboard` - Uses new API and auth context
- `LoginForm` - Uses new auth API
- `RequireAuth` - Uses new auth context
- `UserMenu` - Uses new auth context
- `Onboarding` - Uses new GitHub API
- `GithubCallback` - Uses new OAuth API

✅ **Hooks Migrated**
- `useAgenticWorkflow` - Uses new workflows API

## What Needs Manual Migration

⚠️ **Data Migration**
- Export existing DynamoDB data
- Transform user IDs (Cognito sub → MongoDB ObjectId)
- Import into MongoDB

⚠️ **Environment Variables**
- Set up `.env` files for both server and frontend
- Configure GitHub OAuth app
- Add Gemini API key

⚠️ **Step Functions Workflows**
- Original used AWS Step Functions
- Migrated to Express-based workflow orchestration
- May need adjustment for complex workflows

⚠️ **Webhook Handling**
- GitHub webhook creation is placeholder
- Need to implement webhook endpoint and event handling

⚠️ **File Storage**
- Prompts moved from S3 to local filesystem
- Ensure prompts directory is accessible

## API Mapping

### GraphQL → REST

| GraphQL | REST |
|---------|------|
| `client.models.User.get()` | `GET /api/auth/me` |
| `client.queries.listGithubRepos()` | `GET /api/github/repos` |
| `client.queries.getRepoFiles()` | `GET /api/github/repos/:owner/:repo/files` |
| `client.queries.agenticWorkflow()` | `POST /api/workflows/onboarding` or `/modification` |
| `client.models.Project.list()` | `GET /api/projects` |
| `client.models.Feature.list()` | `GET /api/projects/:id/features` |

## Breaking Changes

1. **User IDs**: Changed from Cognito sub (string) to MongoDB ObjectId
2. **Authentication**: No more Cognito session management
3. **API Calls**: All GraphQL → REST API calls
4. **Error Handling**: Different error response format
5. **Token Storage**: JWT in localStorage instead of Cognito session

## Testing Checklist

- [ ] User registration
- [ ] User login
- [ ] GitHub OAuth flow
- [ ] Repository listing
- [ ] Repository connection
- [ ] Feature map generation
- [ ] AI chat interface
- [ ] Code modification workflow
- [ ] Feature visualization

## Next Steps

1. Set up MongoDB (local or Atlas)
2. Configure environment variables
3. Test authentication flow
4. Test GitHub integration
5. Test AI workflows
6. Migrate existing data (if applicable)
7. Deploy backend to hosting service
8. Deploy frontend to hosting service

## Support

For issues or questions about the migration, refer to the main README.md or check the code comments in the migrated files.

