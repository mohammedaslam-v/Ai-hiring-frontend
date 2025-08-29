# Constants Structure

This directory contains all the constants used throughout the application, organized by category for better maintainability and readability.

## Structure

```
src/utils/constants/
├── index.ts              # Main index file that exports all constants
├── api.ts                # API endpoints, URLs, and service-related constants
├── validation.ts         # Validation messages and rules
├── form.ts               # Form field labels, placeholders, and form-related constants
├── navigation.ts         # Navigation routes, paths, and navigation-related constants
├── ui.ts                 # UI constants - colors, sizes, component variants
├── messages.ts           # Toast messages, notifications, and user-facing messages
├── data.ts               # Data constants - country codes, time slots, subjects, etc.
├── app.ts                # Application-specific constants - branding, content, config
└── README.md             # This file
```

## Usage

### Importing Constants

```typescript
// Import specific constants
import { ROUTES } from '@/utils/constants/navigation';
import { TOAST_MESSAGES } from '@/utils/constants/messages';
import { FORM_LABELS } from '@/utils/constants/form';

// Import multiple constants from different files
import { ROUTES, NAVIGATION_LABELS } from '@/utils/constants/navigation';
import { VALIDATION_MESSAGES, VALIDATION_RULES } from '@/utils/constants/validation';

// Import all constants (not recommended for performance)
import * as Constants from '@/utils/constants';
```

### Legacy Support

For backward compatibility, the old `src/utils/const.ts` file still exists and exports the constants that are currently imported by existing components. New components should import from the new constants structure.

## Constants Categories

### 1. API Constants (`api.ts`)

- **API_ENDPOINTS**: All API endpoint paths
- **API_CONFIG**: API configuration (base URL, timeouts, retry settings)
- **HTTP_STATUS**: HTTP status codes
- **CONTENT_TYPES**: MIME types
- **HEADERS**: Common HTTP headers

```typescript
import { API_ENDPOINTS, API_CONFIG } from '@/utils/constants/api';

// Usage
const loginUrl = API_ENDPOINTS.LOGIN;
const baseUrl = API_CONFIG.BASE_URL;
```

### 2. Validation Constants (`validation.ts`)

- **VALIDATION_MESSAGES**: All validation error messages
- **VALIDATION_RULES**: Validation rules and constraints
- **VALIDATION_SCHEMAS**: Validation patterns and schemas

```typescript
import { VALIDATION_MESSAGES, VALIDATION_RULES } from '@/utils/constants/validation';

// Usage
const firstNameRequired = VALIDATION_MESSAGES.FIRST_NAME.REQUIRED;
const minNameLength = VALIDATION_RULES.MIN_NAME_LENGTH;
```

### 3. Form Constants (`form.ts`)

- **FORM_LABELS**: Form field labels
- **FORM_PLACEHOLDERS**: Input placeholders
- **FORM_SECTIONS**: Form section titles
- **FORM_VALIDATION**: Form validation states
- **FORM_INITIAL_VALUES**: Default form values
- **FORM_FIELD_TYPES**: Input field types

```typescript
import { FORM_LABELS, FORM_PLACEHOLDERS } from '@/utils/constants/form';

// Usage
<Label>{FORM_LABELS.FIRST_NAME}</Label>
<Input placeholder={FORM_PLACEHOLDERS.FIRST_NAME} />
```

### 4. Navigation Constants (`navigation.ts`)

- **ROUTES**: All application routes
- **NAVIGATION_LABELS**: Navigation menu labels
- **REDIRECT_PATHS**: Default redirect paths
- **NAVIGATION_CONFIG**: Navigation configuration

```typescript
import { ROUTES } from '@/utils/constants/navigation';

// Usage
navigate(ROUTES.CANDIDATE.APPLICATION);
<Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
```

### 5. UI Constants (`ui.ts`)

- **UI_COLORS**: Color schemes and semantic colors
- **UI_SIZES**: Spacing, component sizes, layout sizes
- **UI_VARIANTS**: Component variants
- **UI_ANIMATIONS**: Transition durations and easing
- **UI_BREAKPOINTS**: Responsive breakpoints
- **UI_ICONS**: Icon sizes and positioning

```typescript
import { UI_COLORS, UI_SIZES } from '@/utils/constants/ui';

// Usage
className={`bg-${UI_COLORS.SUCCESS.PRIMARY} p-${UI_SIZES.SPACING.MD}`}
```

### 6. Messages Constants (`messages.ts`)

- **TOAST_MESSAGES**: Success, error, info, and warning messages
- **NOTIFICATION_MESSAGES**: Application status and system messages
- **USER_MESSAGES**: Welcome, instruction, and help messages
- **ERROR_MESSAGES**: Form, network, and authentication errors

```typescript
import { TOAST_MESSAGES } from '@/utils/constants/messages';

// Usage
toast.success(TOAST_MESSAGES.SUCCESS.LOGIN);
toast.error(TOAST_MESSAGES.ERROR.LOGIN_FAILED);
```

### 7. Data Constants (`data.ts`)

- **COUNTRY_CODES**: Available country codes
- **TIME_SLOTS**: Available time slots with demand indicators
- **AVAILABLE_DAYS**: Available days with demand indicators
- **SUBJECTS**: Available subjects
- **POSITIONS**: Available positions
- **ADDITIONAL_LANGUAGES**: Additional language options
- **APPLICATION_STATUSES**: Application status values
- **FEEDBACK_CATEGORIES**: Feedback category options
- **FEEDBACK_RATINGS**: Rating options
- **MOCK_DATA**: Mock data configuration
- **PAGINATION**: Pagination settings
- **FILE_UPLOAD**: File upload constraints
- **TIMEOUTS**: Timeout values
- **STORAGE_KEYS**: Local storage keys

```typescript
import { COUNTRY_CODES, TIME_SLOTS, SUBJECTS } from '@/utils/constants/data';

// Usage
const countryOptions = COUNTRY_CODES.map(code => ({ value: code, label: code }));
const highDemandSlots = TIME_SLOTS.filter(slot => slot.highDemand);
```

### 8. App Constants (`app.ts`)

- **APP_CONFIG**: Application metadata and configuration
- **APP_CONTENT**: Application content (hero, features, process, CTA, footer)
- **APP_STATS**: Application statistics
- **APP_FEATURES**: Feature descriptions
- **APP_HIRING_STEPS**: Hiring process steps
- **APP_IMAGES**: Image paths and configurations
- **APP_THEME**: Theme colors, gradients, and shadows

```typescript
import { APP_CONFIG, APP_CONTENT } from '@/utils/constants/app';

// Usage
<h1>{APP_CONFIG.NAME}</h1>
<p>{APP_CONTENT.HERO.SUBTITLE}</p>
```

## Best Practices

### 1. Use Descriptive Names

```typescript
// Good
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const DEFAULT_TIMEOUT = 30000;

// Avoid
const MAX = 10 * 1024 * 1024;
const TIMEOUT = 30000;
```

### 2. Group Related Constants

```typescript
// Good
export const VALIDATION_MESSAGES = {
  FIRST_NAME: {
    REQUIRED: 'First name is required',
    MIN_LENGTH: 'First name must be at least 2 characters',
    MAX_LENGTH: 'First name must not exceed 50 characters',
  },
  // ... other fields
};

// Avoid
export const FIRST_NAME_REQUIRED = 'First name is required';
export const FIRST_NAME_MIN_LENGTH = 'First name must be at least 2 characters';
export const FIRST_NAME_MAX_LENGTH = 'First name must not exceed 50 characters';
```

### 3. Use `as const` for Type Safety

```typescript
// Good
export const STATUSES = ['pending', 'approved', 'rejected'] as const;

// Avoid
export const STATUSES = ['pending', 'approved', 'rejected'];
```

### 4. Import Only What You Need

```typescript
// Good
import { ROUTES } from '@/utils/constants/navigation';

// Avoid
import * as Constants from '@/utils/constants';
```

### 5. Keep Constants Immutable

```typescript
// Good
export const CONFIG = {
  API_URL: 'https://api.example.com',
  TIMEOUT: 30000,
} as const;

// Avoid
export let CONFIG = {
  API_URL: 'https://api.example.com',
  TIMEOUT: 30000,
};
```

## Migration Guide

### From Hard-coded Values

```typescript
// Before
const message = "Login successful!";
const route = "/candidate/application";
const maxSize = 10 * 1024 * 1024;

// After
import { TOAST_MESSAGES, ROUTES, FILE_UPLOAD } from '@/utils/constants';
const message = TOAST_MESSAGES.SUCCESS.LOGIN;
const route = ROUTES.CANDIDATE.APPLICATION;
const maxSize = FILE_UPLOAD.MAX_SIZE;
```

### From Old Constants File

```typescript
// Before
import { stats, features, hiringSteps } from "@/utils/const";

// After
import { APP_STATS, APP_FEATURES, APP_HIRING_STEPS } from "@/utils/constants/app";
```

## Adding New Constants

1. **Identify the category** - Choose the most appropriate constants file
2. **Follow the naming convention** - Use UPPER_SNAKE_CASE for constants
3. **Group related constants** - Use objects to organize related values
4. **Add TypeScript types** - Use `as const` for better type inference
5. **Update the index file** - Export new constants from the main index
6. **Document the changes** - Update this README if needed

## Benefits

- **Maintainability**: All constants are centralized and easy to update
- **Consistency**: Ensures consistent values across the application
- **Type Safety**: TypeScript provides better type checking
- **Reusability**: Constants can be reused across components
- **Internationalization Ready**: Easy to replace with i18n keys
- **Testing**: Constants can be easily mocked in tests
- **Performance**: Reduces bundle size by avoiding duplicate strings

## Troubleshooting

### Common Issues

1. **Import errors**: Check the correct file path and export name
2. **Type errors**: Ensure constants are properly typed with `as const`
3. **Circular dependencies**: Avoid importing constants in the constants files themselves

### Debugging

```typescript
// Check what's exported
console.log('Available constants:', Object.keys(Constants));

// Check specific constant value
console.log('ROUTES:', Constants.ROUTES);
```

## Contributing

When adding new constants:

1. Follow the existing structure and naming conventions
2. Add proper TypeScript types
3. Update this README if adding new categories
4. Ensure constants are properly exported from the main index
5. Test that imports work correctly in components
