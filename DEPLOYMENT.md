# Firebase Functions & Security Rules Deployment Guide

This guide explains how to deploy the secure milestone management functions and Firestore security rules.

## Prerequisites

1. **Firebase CLI installed:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase project initialized:**
   ```bash
   firebase login
   firebase init
   ```

3. **Functions dependencies:**
   ```bash
   cd functions
   npm install firebase-admin firebase-functions
   ```

## Project Structure

```
legal-axis/
├── functions/
│   ├── src/
│   │   └── milestones.ts          # Callable functions
│   ├── package.json
│   └── tsconfig.json
├── firestore.rules                # Security rules
├── src/
│   └── services/
│       └── milestoneService.ts    # Client-side service
└── DEPLOYMENT.md
```

## Deployment Steps

### 1. Deploy Firestore Security Rules

```bash
# Deploy security rules
firebase deploy --only firestore:rules
```

### 2. Deploy Firebase Functions

```bash
# Deploy all functions
firebase deploy --only functions

# Or deploy specific functions
firebase deploy --only functions:addMilestone,functions:updateMilestone,functions:deleteMilestone
```

### 3. Verify Deployment

```bash
# List deployed functions
firebase functions:list

# View function logs
firebase functions:log
```

## Security Features

### 🔐 Authentication & Authorization

- **User Authentication**: All functions require valid Firebase Auth tokens
- **Case Ownership**: Only case owners can modify their cases and milestones
- **Data Validation**: Comprehensive input validation on both client and server

### 🛡️ Data Validation

**Milestone Validation:**
- Title: 1-100 characters
- Description: 1-500 characters  
- Amount: Positive number ≤ $1,000,000
- Status: Must be 'Pending', 'In Progress', or 'Completed'

**Case Validation:**
- Title: 1-200 characters
- Description: 1-2000 characters
- Required fields: clientId, caseTitle, caseDescription, milestones

### 🔒 Firestore Security Rules

**Case Access:**
- Read: Case owner or assigned lawyer
- Write: Case owner only
- Delete: Case owner only

**User Profiles:**
- Users can only access their own profile data

**Applications:**
- Lawyers can create applications for cases
- Case owners can view applications for their cases

## Function Details

### `addMilestone`
- **Purpose**: Add new milestone to existing case
- **Authentication**: Required
- **Authorization**: Case owner only
- **Input**: `{ caseId, milestoneData }`
- **Output**: `{ success, milestoneId, caseId }`

### `updateMilestone`
- **Purpose**: Update existing milestone fields
- **Authentication**: Required
- **Authorization**: Case owner only
- **Input**: `{ caseId, milestoneId, updateData }`
- **Output**: `{ success, milestoneId, caseId }`

### `deleteMilestone`
- **Purpose**: Remove milestone from case
- **Authentication**: Required
- **Authorization**: Case owner only
- **Input**: `{ caseId, milestoneId }`
- **Output**: `{ success, milestoneId, caseId }`

## Error Handling

### Client-Side Error Types

```typescript
// Authentication errors
'functions/unauthenticated' -> 'You must be logged in to perform this action'

// Authorization errors  
'functions/permission-denied' -> 'Only case owners can perform this action'

// Validation errors
'functions/invalid-argument' -> Custom validation message

// Not found errors
'functions/not-found' -> 'Case or milestone not found'

// Internal errors
'functions/internal' -> 'Failed to perform action. Please try again.'
```

### Server-Side Validation

- Input type checking
- Field length validation
- Numeric range validation
- Status enum validation
- Required field validation

## Testing

### Local Testing

```bash
# Start Firebase emulator
firebase emulators:start

# Test functions locally
firebase functions:shell
```

### Production Testing

1. **Test with authenticated user**
2. **Test with case owner**
3. **Test with non-owner (should fail)**
4. **Test with invalid data (should fail)**
5. **Test with non-existent case/milestone**

## Monitoring

### Function Monitoring

```bash
# View function metrics
firebase functions:log --only addMilestone

# Monitor performance
firebase functions:log --only updateMilestone --limit 50
```

### Security Monitoring

- Monitor failed authentication attempts
- Track permission denied errors
- Review function execution logs
- Monitor Firestore rule violations

## Best Practices

### Security
- Always validate input on both client and server
- Use transactions for data consistency
- Implement proper error handling
- Log security events

### Performance
- Use transactions sparingly
- Implement proper indexing
- Monitor function execution time
- Cache frequently accessed data

### Maintenance
- Regular security audits
- Update dependencies
- Monitor error rates
- Review access patterns

## Troubleshooting

### Common Issues

1. **Function not found**
   - Verify function is deployed
   - Check function name spelling
   - Ensure region is correct

2. **Permission denied**
   - Verify user authentication
   - Check case ownership
   - Review security rules

3. **Invalid argument**
   - Check input validation
   - Verify data types
   - Review field requirements

### Debug Commands

```bash
# View detailed logs
firebase functions:log --only addMilestone --debug

# Test function locally
firebase functions:shell

# Check function status
firebase functions:list
```

## Support

For issues with:
- **Functions**: Check Firebase Functions documentation
- **Security Rules**: Review Firestore security rules guide
- **Authentication**: Verify Firebase Auth setup
- **Deployment**: Check Firebase CLI documentation 