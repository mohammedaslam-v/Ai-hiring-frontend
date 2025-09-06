# 🚀 Frontend-Backend Integration Guide

This guide explains how your React frontend is now integrated with the AI Hiring Backend API.

## ✅ **What's Been Updated**

### **1. Services Layer**
- **`candidate.service.ts`** - Updated to use real backend API instead of mock responses
- **`instance.ts`** - Configured to connect to `http://localhost:5000`

### **2. Hooks Layer**
- **`useCandidateApplication.tsx`** - Updated to use new backend integration
- **`useBackendIntegration.ts`** - New hook for backend API operations

### **3. Types Layer**
- **`application.ts`** - Added backend response interfaces
- **Field mapping** - Frontend fields mapped to backend schema

## 🔧 **Key Changes Made**

### **API Endpoint Changes**
```typescript
// OLD (Mock)
const mockResponse = { /* mock data */ };

// NEW (Backend)
const response = await axiosInstance.post('/api/candidate/application', formData);
```

### **Field Mapping**
| Frontend Field | Backend Field | Notes |
|----------------|---------------|-------|
| `phone` | `phoneNumber` | Phone number field |
| `timeSlots` | `availableTimeSlots` | Time availability |
| `resume` | `resumeFile` | File upload field |

### **Data Transformation**
```typescript
// Frontend data structure
{
  firstName: "John",
  phone: "1234567890",        // Maps to phoneNumber
  timeSlots: ["6:00 AM - 8:00 AM"]  // Maps to availableTimeSlots
}

// Backend expects
{
  firstName: "John",
  phoneNumber: "1234567890",
  availableTimeSlots: ["6:00 AM - 8:00 AM"]
}
```

## 📱 **How to Use the Integration**

### **1. Application Submission**
The form now automatically sends data to the backend:

```typescript
// In your form component
const { formik, isLoading, handleFileUpload } = useCandidateApplication();

// Form submission happens automatically when formik.submitForm() is called
// Data is transformed and sent to: POST /api/candidate/application
```

### **2. File Upload**
Resume files are now handled by the backend:

```typescript
// File validation is built-in
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  // Validates file type (PDF, DOC, DOCX)
  // Validates file size (max 10MB)
  // Automatically sends to backend with form data
};
```

### **3. Error Handling**
Backend errors are now properly displayed:

```typescript
// Validation errors from backend
if (response.data.error) {
  toast.error(response.data.error);
}

// Field-specific errors
if (response.data.details) {
  // Handle validation details array
}
```

## 🧪 **Testing the Integration**

### **1. Backend Test Component**
Use the `BackendTest` component to verify connectivity:

```tsx
import { BackendTest } from '@/components/BackendTest';

// Add to any page for testing
<BackendTest />
```

### **2. Manual Testing**
Test individual endpoints:

```bash
# Health check
curl http://localhost:5000/health

# Test application submission
curl -X POST http://localhost:5000/api/candidate/application \
  -F "firstName=Test" \
  -F "lastName=User" \
  -F "email=test@example.com" \
  -F "phoneNumber=1234567890" \
  -F "position=Role 1 - Educator" \
  -F "subjects[]=English" \
  -F "availableDays[]=Monday" \
  -F "availableTimeSlots[]=6:00 AM - 8:00 AM" \
  -F "resumeFile=@/path/to/test.pdf"
```

## 🔍 **Debugging & Troubleshooting**

### **1. Check Console Logs**
The API instance now logs all requests and responses:

```typescript
// Request logs
console.log('API Request:', 'POST', '/api/candidate/application');

// Response logs
console.log('API Response:', 201, '/api/candidate/application');

// Error logs
console.error('API Error:', 400, '/api/candidate/application', 'Validation failed');
```

### **2. Common Issues**

#### **CORS Errors**
- Ensure backend is running on port 5000
- Check that `FRONTEND_URL` in backend `.env` is set to `http://localhost:8080`

#### **File Upload Errors**
- Verify file type is PDF, DOC, or DOCX
- Check file size is under 10MB
- Ensure `uploads/` directory exists in backend

#### **Validation Errors**
- Check that all required fields are filled
- Verify field values match backend enum constraints
- Look at `response.data.details` for specific field errors

### **3. Network Tab**
Check the Network tab in browser DevTools:
- Verify requests are going to `localhost:5000`
- Check request payload format
- Look at response status codes and data

## 📋 **API Endpoints Available**

| Method | Endpoint | Description | Frontend Usage |
|--------|----------|-------------|----------------|
| POST | `/api/candidate/application` | Submit application | Form submission |
| GET | `/api/candidate/applications` | Get all applications | Admin dashboard |
| GET | `/api/candidate/applications/:id` | Get specific application | View application |
| PUT | `/api/candidate/applications/:id/status` | Update status | Admin actions |
| DELETE | `/api/candidate/applications/:id` | Delete application | Admin actions |
| GET | `/api/candidate/applications/stats` | Get statistics | Admin dashboard |
| GET | `/health` | Server health | Connectivity test |

## 🎯 **Next Steps**

### **1. Test the Integration**
1. Start your backend server: `npm run dev` (in backend directory)
2. Start your frontend: `npm run dev` (in frontend directory)
3. Use the `BackendTest` component to verify connectivity
4. Submit a test application through your form

### **2. Monitor the Flow**
1. Fill out the candidate application form
2. Select a resume file (PDF, DOC, or DOCX)
3. Submit the form
4. Check browser console for API logs
5. Verify data is stored in MySQL

### **3. Handle Edge Cases**
- Test with invalid file types
- Test with files larger than 10MB
- Test with missing required fields
- Test with duplicate email addresses

## 🚨 **Important Notes**

### **1. Backend Requirements**
- MySQL must be running and accessible
- Backend server must be running on port 5000
- CORS must be configured for `localhost:8080`

### **2. File Upload**
- Files are stored locally in backend `uploads/` directory
- Consider cloud storage for production
- File size limit: 10MB
- Supported formats: PDF, DOC, DOCX

### **3. Error Handling**
- Backend validation errors are displayed to users
- Network errors show user-friendly messages
- File validation happens on both frontend and backend

## 🎉 **Success Indicators**

Your integration is working when:
- ✅ Backend health check returns success
- ✅ Application submission creates records in MySQL
- ✅ Resume files are uploaded and stored
- ✅ Error messages are properly displayed
- ✅ Form validation works with backend constraints

---

**You're all set! 🚀** 

Your frontend is now fully integrated with the backend. The candidate application form will automatically send data to MySQL through your Node.js API. Test it out and let me know if you need any adjustments!
