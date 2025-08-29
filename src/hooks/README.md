# Custom Hooks Documentation

This document describes all the custom hooks in the project, their purpose, and how to use them.

## 🏗️ Architecture Overview

The hooks system follows a modular architecture with:
- **Base hooks** (`useApi`) for common functionality
- **Domain-specific hooks** for different areas (admin, applications, candidates)
- **Form hooks** for form-specific logic
- **Utility hooks** for common utilities

## 🔧 Base Hooks

### `useApi<T>`

Base hook for API operations with consistent error handling and loading states.

```typescript
import { useApi } from '@/hooks';

const myApiHook = useApi<MyResponseType>(
  myApiFunction,
  {
    onSuccess: (data) => console.log('Success:', data),
    onError: (error) => console.error('Error:', error),
    onFinally: () => console.log('Operation completed')
  }
);

// Usage
const result = await myApiHook.execute(param1, param2);
```

**Returns:**
- `loading`: boolean - Current loading state
- `error`: string | null - Current error state
- `execute`: function - Execute the API operation
- `clearError`: function - Clear the current error
- `setError`: function - Set a custom error message

## 👨‍💼 Admin Hooks

### `useAdmin`

Comprehensive hook for admin-related operations.

```typescript
import { useAdmin } from '@/hooks';

const {
  loading,
  error,
  getDashboardStats,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
  getAdminProfile,
  clearAllErrors
} = useAdmin();
```

**Features:**
- Individual operation states for granular control
- Combined loading and error states
- Bulk error clearing
- Type-safe responses

## 📋 Application Hooks

### `useApplications`

Hook for application management operations.

```typescript
import { useApplications } from '@/hooks';

const {
  loading,
  error,
  getApplicationsCount,
  getApplicationsPage,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  clearAllErrors
} = useApplications();
```

**Features:**
- Pagination support
- Filtering capabilities
- Individual operation tracking
- Bulk error management

## 👤 Candidate Hooks

### `useCandidate`

Hook for candidate-related operations.

```typescript
import { useCandidate } from '@/hooks';

const {
  loading,
  error,
  submitApplication,
  uploadResume,
  getApplicationStatus,
  updateCandidateProfile,
  getCandidateProfile,
  clearAllErrors
} = useCandidate();
```

**Features:**
- Application submission
- Resume upload
- Profile management
- Status tracking

## 📝 Form Hooks

### `useCandidateApplication`

Form-specific hook for candidate application management.

```typescript
import { useCandidateApplication } from '@/hooks';

const {
  formik,
  isLoading,
  validationError,
  apiError,
  handleArrayFieldChange,
  handleFileUpload,
  clearError,
  submitApplication
} = useCandidateApplication();
```

**Features:**
- Formik integration
- Array field handling
- File upload management
- Validation error handling

### `useCandidateLogin`

Hook for candidate login functionality.

```typescript
import { useCandidateLogin } from '@/hooks';

const {
  isLoading,
  validationError,
  handleLogin,
  clearError
} = useCandidateLogin();
```

**Features:**
- Mock login simulation
- Token management
- Navigation handling
- Error state management

### `useAdminLogin`

Hook for admin login functionality.

```typescript
import { useAdminLogin } from '@/hooks';

const {
  isLoading,
  validationError,
  handleLogin,
  clearError
} = useAdminLogin();
```

**Features:**
- Mock admin login
- Role-based authentication
- Dashboard navigation
- Error handling

## 🎯 Utility Hooks

### `useAuth`

Context-based authentication hook.

```typescript
import { useAuth } from '@/hooks';

const { user, signIn, signOut, isAuthenticated } = useAuth();
```

### `useTheme`

Theme management hook.

```typescript
import { useTheme } from '@/hooks';

const { theme, toggleTheme } = useTheme();
```

### `useLocalStorage`

Local storage management hook.

```typescript
import { useLocalStorage } from '@/hooks';

const [value, setValue, removeValue, clearAll] = useLocalStorage('key', defaultValue);
```

### `useMobile`

Mobile device detection hook.

```typescript
import { useMobile } from '@/hooks';

const isMobile = useMobile();
```

### `useToast`

Toast notification hook.

```typescript
import { useToast } from '@/hooks';

const { toast } = useToast();
```

## 🚀 Best Practices

### 1. **Consistent Error Handling**
All hooks use the base `useApi` hook for consistent error handling and loading states.

### 2. **Type Safety**
All hooks are fully typed with TypeScript interfaces for responses and parameters.

### 3. **Modular Design**
Each hook focuses on a specific domain or functionality, making them easy to maintain and test.

### 4. **Reusability**
Hooks are designed to be reusable across different components and scenarios.

### 5. **State Management**
Individual operation states are exposed for granular control over loading and error states.

## 📁 File Structure

```
src/hooks/
├── index.ts                 # Main exports
├── useApi.ts               # Base API hook
├── useAdmin.ts             # Admin operations
├── useApplications.ts      # Application management
├── useCandidate.ts         # Candidate operations
├── useAuth.ts              # Authentication
├── useTheme.ts             # Theme management
├── useLocalStorage.tsx     # Local storage
├── useMobile.tsx           # Mobile detection
├── useToast.ts             # Toast notifications
├── useAnalytics.ts         # Analytics
├── useApplicationsPagination.ts # Pagination
└── forms/                  # Form-specific hooks
    ├── useCandidateApplication.tsx
    ├── useCanidateLogin.tsx
    └── useAdminLogin.tsx
```

## 🔄 Migration Guide

### From Old Hooks to New Hooks

**Before:**
```typescript
const { loading, error, submitApplication } = useCandidate();
```

**After:**
```typescript
const { 
  loading, 
  error, 
  submitApplication,
  applicationSubmission: { loading: submitLoading, error: submitError }
} = useCandidate();
```

### Benefits of New System

1. **Granular Control**: Individual operation states
2. **Better Error Handling**: Consistent error management
3. **Type Safety**: Full TypeScript support
4. **Reusability**: Modular design
5. **Maintainability**: Centralized logic

## 🧪 Testing

All hooks are designed to be easily testable:
- Pure functions where possible
- Clear input/output contracts
- Mockable dependencies
- Isolated state management

## 📚 Examples

See the individual hook files for detailed examples and usage patterns.
