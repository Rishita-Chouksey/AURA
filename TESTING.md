# 🧪 Testing Guide - AURA Dashboard

## Quick Start

```bash
npm run dev
```

Opens at: **http://localhost:5173**

---

## Authentication Testing

### ✅ Test 1: Successful Login
1. Go to login page
2. Email: `doctor@aura.com`
3. Password: `password123`
4. Click "Sign In"
5. **Expected**: Dashboard loads with "Medicines" page

### ❌ Test 2: Wrong Password
1. Go to login page
2. Email: `doctor@aura.com`
3. Password: `wrongpass`
4. Click "Sign In"
5. **Expected**: Error message "Invalid password"

### ✅ Test 3: Missing Fields
1. Clear email and password fields
2. Click "Sign In"
3. **Expected**: Error message "Please fill in all fields"

### ✅ Test 4: Create Account
1. Click "Create one" link
2. Fill all fields:
   - Name: `Dr. John Smith`
   - Email: `john@hospital.com`
   - Role: `Cardiologist`
   - Password: `test1234`
   - Confirm: `test1234`
3. Click "Create Account"
4. **Expected**: Dashboard loads with new user profile

---

## Navigation Testing

### ✅ Test 5: Navigate Pages
1. After login, click each nav item:
   - 💊 **Medicines** - See medicine database
   - ⭐ **Reviews** - See review charts and medicine cards
   - 📊 **Analytics** - See pie and bar charts

### ✅ Test 6: User Dropdown
1. Click user avatar + name in top-right
2. See dropdown with options:
   - 👤 Profile
   - ⚙️ Settings
   - 🚪 Logout
3. Click "Logout"
4. **Expected**: Returns to login page

---

## Profile Page Testing

### ✅ Test 7: View Profile
1. Click user dropdown
2. Click "👤 Profile"
3. **Expected**: See profile card with:
   - User avatar
   - Name
   - Email
   - Role
   - "Edit Profile" button

### ✅ Test 8: Edit Profile
1. On Profile page, click "Edit Profile"
2. Change Name: `Dr. New Name`
3. Change Email: `newemail@hospital.com`
4. Change Role: `Pediatrician`
5. Click "Save Changes"
6. **Expected**: Profile updates and shows new info

### ✅ Test 9: Cancel Edit
1. On Profile page, click "Edit Profile"
2. Make changes
3. Click "Cancel"
4. **Expected**: Changes discarded, profile unchanged

---

## Settings Page Testing

### ✅ Test 10: Toggle Notifications
1. Click user dropdown → "⚙️ Settings"
2. See "Notifications" section
3. Toggle checkboxes:
   - Email notifications for high-risk medicines
   - Weekly medicine review summary
4. **Expected**: Checkboxes toggle on/off (note: no persistence in demo)

### ✅ Test 11: Toggle Privacy
1. On Settings page, scroll to "Privacy"
2. Toggle checkboxes:
   - Share anonymous usage data
   - Two-factor authentication
3. **Expected**: Checkboxes toggle on/off

---

## Medicines Page Testing

### ✅ Test 12: View Medicines
1. Navigate to 💊 Medicines page
2. See three stat cards:
   - Total Medicines: 6
   - Safe to Use: 4
   - Total Reviews: 1,815
3. See table with medicine list

### ✅ Test 13: Search Medicines
1. On Medicines page, find search box
2. Type "aspirin"
3. **Expected**: Table filters to show only Aspirin
4. Clear search
5. **Expected**: All medicines show again

### ✅ Test 14: Medicine Table
1. See columns:
   - Medicine name
   - Review count
   - Suitability %
   - Rating (stars)
   - Status (badge)
2. Verify data:
   - Aspirin: 92% suitable, ✅ Safe to Use
   - Warfarin: 62% suitable, ⚠️ High Risk

---

## Reviews Page Testing

### ✅ Test 15: Sentiment Chart
1. Navigate to ⭐ Reviews page
2. See "Weekly Review Sentiment Trend" chart
3. Chart shows area graph with positive reviews increasing

### ✅ Test 16: Medicine Cards
1. On Reviews page, see 6 medicine cards
2. Each card shows:
   - Medicine name
   - ⭐ Rating
   - Risk level badge
   - Side effects
   - Suitable/Not Suitable percentages
3. Click on cards (ready for future functionality)

---

## Analytics Page Testing

### ✅ Test 17: Suitability Pie Chart
1. Navigate to 📊 Analytics page
2. See "Suitability Distribution" pie chart
3. Shows breakdown:
   - Safe (LOW): 4 medicines
   - Caution (MEDIUM): 1 medicine
   - High Risk: 1 medicine

### ✅ Test 18: Risk Level Bar Chart
1. On Analytics page, see "Reviews by Risk Level"
2. Bar chart shows high-risk medicines
3. See comparison of review counts

---

## Responsive Design Testing

### ✅ Test 19: Desktop View
1. Set browser width > 1200px
2. Verify:
   - All navigation items visible
   - Full-width page coverage
   - No scrollbars on sides
   - Charts fully visible

### ✅ Test 20: Tablet View
1. Resize to 768px - 1000px width
2. Verify:
   - Navigation responsive
   - Stats grid shows 2 columns
   - All content readable

### ✅ Test 21: Mobile View
1. Resize to < 500px width
2. Verify:
   - Content stacks vertically
   - Cards are readable
   - No horizontal scroll
   - Touch-friendly buttons

---

## Font & Styling Testing

### ✅ Test 22: Poppins Font
1. Inspect any text element
2. Right-click → Inspect (DevTools)
3. Check computed styles
4. **Expected**: `font-family: 'Poppins', sans-serif`

### ✅ Test 23: Light Theme Colors
1. Check page background
2. **Expected**: Light gray `#f8fafc`
3. Check text color
4. **Expected**: Dark `#1e293b`
5. Check buttons
6. **Expected**: Purple gradient

---

## Error Handling Testing

### ✅ Test 24: Empty Login
1. Leave fields blank
2. Click "Sign In"
3. **Expected**: Error "Please fill in all fields"

### ✅ Test 25: Invalid Password
1. Use correct email
2. Use incorrect password
3. Click "Sign In"
4. **Expected**: Error "Invalid password"

### ✅ Test 26: Invalid Password Match (Signup)
1. On signup page
2. Password: `test123`
3. Confirm Password: `test456`
4. Click "Create Account"
5. **Expected**: Error "Passwords don't match"

---

## Performance Testing

### ✅ Test 27: Build Time
```bash
npm run build
```
**Expected**: Build completes in < 500ms

### ✅ Test 28: Page Load
1. Open DevTools → Network tab
2. Clear cache
3. Refresh page
4. **Expected**: 
   - HTML: <1KB
   - CSS: <2KB
   - JS: ~600KB
   - Total load: <2 seconds

### ✅ Test 29: Animations
1. Navigate between pages
2. Hover over buttons
3. Open dropdowns
4. **Expected**: Smooth animations, no stuttering

---

## Checklist

- [ ] Authentication works (login/signup)
- [ ] Wrong password shows error
- [ ] Profile page is functional
- [ ] Settings page is functional
- [ ] Font is Poppins (not Manrope)
- [ ] Light theme applied throughout
- [ ] Full page coverage (no borders)
- [ ] Responsive on mobile/tablet/desktop
- [ ] Medicine data displayed correctly
- [ ] Risk levels are dynamic (not hardcoded)
- [ ] Charts render properly
- [ ] Navigation works
- [ ] Logout works
- [ ] No console errors

---

## Debugging

### Clear Cache
```bash
# Windows
rmdir node_modules -r -f && npm install
```

### Start Fresh
```bash
npm run dev -- --force
```

### Check for Errors
Open browser DevTools → Console tab and look for red errors

### Rebuild
```bash
npm run build
```

---

**All tests should pass!** ✅
