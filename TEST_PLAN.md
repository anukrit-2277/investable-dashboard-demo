# Access Request State Persistence Test Plan

## Issue Description
When an investor requests access to a company and an admin approves it, refreshing the page shows "Request Access" button again instead of "Access Approved".

## Root Cause
Race condition between UserContext loading user data from localStorage and CompanyCard component trying to fetch access status before user data is fully loaded.

## Fixes Applied

### 1. Enhanced UserContext (`src/context/UserContext.tsx`)
- Added `isLoading` state to track when user data is being loaded
- Added error handling for localStorage parsing
- Prevented localStorage removal during initial loading

### 2. Improved CompanyCard Component (`src/components/CompanyCard.tsx`)
- Added `isLoading` check to prevent premature API calls
- Implemented localStorage caching for access status (5-minute cache)
- Added comprehensive debug logging
- Memoized functions with `useCallback`
- Added cache validation and expiration
- Added manual refresh and cache clear buttons

### 3. Caching System
- Cache key format: `access_status_{email}_{companyId}`
- 5-minute cache validity
- Automatic cache invalidation
- Cache updates when status changes

## Test Steps

### Prerequisites
1. Backend server running on port 5050
2. Frontend server running on port 8082
3. MongoDB running
4. Browser console open for debug logs

### Test Case 1: Initial Load with Approved Access
1. **Setup**: Ensure you have an approved access request in the database
2. **Action**: Open browser and navigate to `http://localhost:8082`
3. **Expected**: Should show "Access Approved" immediately
4. **Check Console**: Look for debug logs showing cache usage or API call

### Test Case 2: Page Refresh with Approved Access
1. **Setup**: Have an approved access request visible
2. **Action**: Refresh the page (F5 or Cmd+R)
3. **Expected**: Should still show "Access Approved" after refresh
4. **Check Console**: Should see cache being used

### Test Case 3: New Access Request
1. **Setup**: Find a company without access request
2. **Action**: Click "Request Access" and submit
3. **Expected**: Should show "Request Pending" immediately
4. **Action**: Refresh the page
5. **Expected**: Should still show "Request Pending"

### Test Case 4: Admin Approval Flow
1. **Setup**: Have a pending access request
2. **Action**: Admin approves the request (via admin panel)
3. **Action**: Investor refreshes the page
4. **Expected**: Should show "Access Approved"

### Test Case 5: Manual Refresh
1. **Setup**: Have any access status visible
2. **Action**: Click the refresh button (🔄)
3. **Expected**: Should fetch latest status from API
4. **Check Console**: Should see API call logs

### Test Case 6: Cache Clear
1. **Setup**: Have cached access status
2. **Action**: Click the clear cache button (🗑️)
3. **Expected**: Should clear cache and fetch fresh data
4. **Check Console**: Should see cache clear logs

## Debug Information

### Console Logs to Look For
- `[CompanyCard Debug] Component mounted for company:`
- `[CompanyCard Debug] useEffect triggered:`
- `[CompanyCard Debug] All conditions met, checking cache...`
- `[CompanyCard Debug] Using cached status:`
- `[CompanyCard Debug] No cache found, fetching from API...`
- `[AccessRequest Debug] API data:`
- `[AccessRequest Debug] Matched request:`

### Cache Keys
- Format: `access_status_{email}_{companyId}`
- Example: `access_status_anukrit@gmail.com_3436a77b-75bd-46c1-b9c9-e46a1697a878`

### API Endpoints
- GET `/api/access-requests/investor/{email}` - Get all requests for investor
- POST `/api/access-requests` - Create new access request
- PATCH `/api/access-requests/{id}` - Update request status (admin only)

## Expected Behavior After Fix

1. **Immediate Load**: Access status should be visible immediately on page load
2. **Persistent State**: Status should persist across page refreshes
3. **Cache Efficiency**: Should use cache when available, reducing API calls
4. **Real-time Updates**: Should detect status changes when admin approves/denies
5. **Manual Control**: Users can manually refresh or clear cache as needed

## Troubleshooting

### If Issue Persists
1. Check browser console for error messages
2. Verify backend API is responding correctly
3. Check localStorage for cached data
4. Verify user data is loading correctly from UserContext
5. Test with manual refresh button

### Common Issues
- **Race Condition**: User data not loaded when component mounts
- **Cache Invalidation**: Cache expired or corrupted
- **API Errors**: Backend not responding or returning incorrect data
- **User Context**: User data not properly loaded from localStorage 