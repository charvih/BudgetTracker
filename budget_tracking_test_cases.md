# Budget Tracking WebApp - Test Cases

## 1. API Integration & Configuration Testing

### TC-001: API Connection
- **Objective**: Verify successful API connection with AppSmartHub
- **Steps**: 
  1. Launch the application
  2. Verify API endpoint is reachable
  3. Validate API authentication/credentials
- **Expected Result**: API connection successful, no timeout errors
- **Priority**: High

### TC-002: Invalid API Key
- **Objective**: Validate error handling for incorrect API credentials
- **Steps**:
  1. Configure incorrect API key in settings
  2. Attempt to fetch data
- **Expected Result**: Appropriate error message displayed, graceful failure
- **Priority**: High

### TC-003: API Rate Limiting
- **Objective**: Test behavior when API rate limit is exceeded
- **Steps**:
  1. Make multiple rapid API requests
  2. Monitor response after limit threshold
- **Expected Result**: Appropriate throttling message or queue management
- **Priority**: Medium

---

## 2. Dashboard Display Testing

### TC-004: Dashboard Load
- **Objective**: Verify all dashboard components load correctly
- **Steps**:
  1. Open the application home page
  2. Verify all widgets/cards display
  3. Check data population
- **Expected Result**: Dashboard fully loaded in <3 seconds
- **Priority**: High

### TC-005: Real-time Data Refresh
- **Objective**: Verify data updates without page refresh
- **Steps**:
  1. Open dashboard
  2. Add/modify a transaction
  3. Observe automatic refresh
- **Expected Result**: Data updates within 2 seconds
- **Priority**: High

---

## 3. Budget Category Operations Testing

### TC-006: Add New Budget Category
- **Objective**: Verify ability to create new budget category
- **Steps**:
  1. Click "Add Category" button
  2. Enter category name (e.g., "Groceries")
  3. Set budget limit ($500)
  4. Save
- **Expected Result**: Category created, appears in list
- **Priority**: High

### TC-007: Edit Budget Category
- **Objective**: Verify category modification functionality
- **Steps**:
  1. Select existing category
  2. Update name/budget amount
  3. Save changes
- **Expected Result**: Changes persist, reflected in dashboard
- **Priority**: High

### TC-008: Delete Budget Category
- **Objective**: Verify category deletion with data integrity
- **Steps**:
  1. Select category
  2. Confirm deletion
  3. Verify related transactions handling
- **Expected Result**: Category deleted, transactions archived or reassigned
- **Priority**: Medium

### TC-009: Duplicate Category Name
- **Objective**: Prevent duplicate category names
- **Steps**:
  1. Create category "Food"
  2. Attempt to create another "Food" category
- **Expected Result**: Validation error, user prevented from creating duplicate
- **Priority**: Medium

---

## 4. Income Management Testing

### TC-010: Add Income Entry
- **Objective**: Verify income transaction recording
- **Steps**:
  1. Click "Add Income"
  2. Enter amount, source, date
  3. Save
- **Expected Result**: Income recorded, balance updated correctly
- **Priority**: High

### TC-011: Income Validation
- **Objective**: Validate income input constraints
- **Steps**:
  1. Attempt to enter negative amount
  2. Attempt to enter non-numeric value
  3. Attempt to enter future-dated income
- **Expected Result**: Appropriate validation errors
- **Priority**: High

### TC-012: Income Editing
- **Objective**: Verify income modification
- **Steps**:
  1. Edit existing income entry
  2. Change amount/date
  3. Save
- **Expected Result**: Changes reflected in totals and history
- **Priority**: Medium

---

## 5. Expense Management Testing

### TC-013: Add Expense Entry
- **Objective**: Verify expense transaction recording
- **Steps**:
  1. Click "Add Expense"
  2. Enter amount, category, description, date
  3. Save
- **Expected Result**: Expense recorded under correct category
- **Priority**: High

### TC-014: Expense Validation
- **Objective**: Validate expense input constraints
- **Steps**:
  1. Attempt to add expense > category limit
  2. Attempt to add expense without category
  3. Attempt to add expense with special characters
- **Expected Result**: Validation messages, limits enforced
- **Priority**: High

### TC-015: Category Budget Alert
- **Objective**: Verify alert when expense exceeds budget
- **Steps**:
  1. Set category budget to $100
  2. Add expense of $150
- **Expected Result**: Warning displayed, transaction still recorded
- **Priority**: High

### TC-016: Edit Expense
- **Objective**: Verify expense modification
- **Steps**:
  1. Edit existing expense
  2. Change category/amount
  3. Save
- **Expected Result**: Category totals recalculated correctly
- **Priority**: Medium

---

## 6. Savings & Goals Testing

### TC-017: Create Savings Goal
- **Objective**: Verify goal creation functionality
- **Steps**:
  1. Click "Add Savings Goal"
  2. Enter goal name, target amount, deadline
  3. Save
- **Expected Result**: Goal created, tracking initiated
- **Priority**: High

### TC-018: Track Goal Progress
- **Objective**: Verify savings goal progress calculation
- **Steps**:
  1. Create goal for $1000
  2. Add $300 to savings
  3. Verify progress bar/percentage
- **Expected Result**: Progress displayed as 30%
- **Priority**: High

### TC-019: Goal Completion
- **Objective**: Verify notification when goal is met
- **Steps**:
  1. Create $500 goal
  2. Add transactions totaling $500+
  3. Observe completion status
- **Expected Result**: Goal marked complete, celebration message
- **Priority**: Medium

---

## 7. Reporting & Analytics Testing

### TC-020: Generate Monthly Report
- **Objective**: Verify report generation functionality
- **Steps**:
  1. Select month (e.g., June 2026)
  2. Click "Generate Report"
  3. Verify data accuracy
- **Expected Result**: Report shows income, expenses, balance, savings
- **Priority**: High

### TC-021: Report Download
- **Objective**: Verify report export functionality
- **Steps**:
  1. Generate report
  2. Click "Download" (CSV/PDF)
  3. Verify file creation
- **Expected Result**: File downloaded with correct format and data
- **Priority**: Medium

### TC-022: Category Breakdown Chart
- **Objective**: Verify expense breakdown visualization
- **Steps**:
  1. View analytics dashboard
  2. Verify pie/bar chart displays correct percentages
- **Expected Result**: Chart accurately represents category distribution
- **Priority**: Medium

---

## 8. Data Validation & Error Handling

### TC-023: Empty Field Validation
- **Objective**: Prevent submission of incomplete forms
- **Steps**:
  1. Attempt to save transaction without required fields
- **Expected Result**: Error message, form not submitted
- **Priority**: High

### TC-024: Data Type Validation
- **Objective**: Validate correct data types
- **Steps**:
  1. Attempt to enter text in amount field
  2. Attempt to enter invalid date format
- **Expected Result**: Type validation errors displayed
- **Priority**: High

### TC-025: Maximum Field Length
- **Objective**: Verify field length constraints
- **Steps**:
  1. Enter description exceeding 500 characters
- **Expected Result**: Field truncated or error shown
- **Priority**: Low

---

## 9. User Interface & Usability Testing

### TC-026: Responsive Design
- **Objective**: Verify UI adapts to different screen sizes
- **Steps**:
  1. Test on desktop (1920x1080)
  2. Test on tablet (768x1024)
  3. Test on mobile (375x667)
- **Expected Result**: UI properly formatted on all devices
- **Priority**: High

### TC-027: Navigation Flow
- **Objective**: Verify intuitive navigation between sections
- **Steps**:
  1. Navigate between Income, Expense, Savings, Reports
  2. Verify back/forward buttons work
- **Expected Result**: Smooth navigation, no broken links
- **Priority**: High

### TC-028: Loading States
- **Objective**: Verify loading indicators display
- **Steps**:
  1. Observe loading spinner during data fetch
  2. Verify "Loading..." text or animation
- **Expected Result**: Clear feedback that app is processing
- **Priority**: Medium

---

## 10. Data Persistence & Security Testing

### TC-029: Data Persistence After Logout
- **Objective**: Verify data persists across sessions
- **Steps**:
  1. Add transaction
  2. Log out
  3. Log in
  4. Verify transaction still exists
- **Expected Result**: All data preserved
- **Priority**: High

### TC-030: Session Timeout
- **Objective**: Verify session expiration handling
- **Steps**:
  1. Leave app idle for 30 minutes
  2. Attempt action
- **Expected Result**: Redirect to login, data not lost
- **Priority**: High

### TC-031: Input Sanitization
- **Objective**: Verify XSS/injection protection
- **Steps**:
  1. Attempt to enter <script> tags in description
  2. Attempt SQL injection in search
- **Expected Result**: Malicious input sanitized/blocked
- **Priority**: High

---

## 11. Performance Testing

### TC-032: Load Time
- **Objective**: Verify acceptable application load time
- **Steps**:
  1. Measure initial page load
  2. Measure dashboard render time
- **Expected Result**: Load time < 3 seconds
- **Priority**: Medium

### TC-033: Large Dataset Handling
- **Objective**: Verify performance with 1000+ transactions
- **Steps**:
  1. Load application with large dataset
  2. Navigate between sections
- **Expected Result**: UI remains responsive
- **Priority**: Medium

---

## 12. Integration Testing

### TC-034: Income + Expense Balance
- **Objective**: Verify balance calculation accuracy
- **Steps**:
  1. Add income $1000
  2. Add expense $300
  3. Verify balance = $700
- **Expected Result**: Calculation correct across all views
- **Priority**: High

### TC-035: Category Sync
- **Objective**: Verify category updates sync across sections
- **Steps**:
  1. Add category in settings
  2. Verify appears in expense dropdown
- **Expected Result**: Consistent across all modules
- **Priority**: High

---

## Test Execution Strategy

| Priority | Count | Timeline |
|----------|-------|----------|
| **High** | 20 | Sprint 1 |
| **Medium** | 12 | Sprint 2 |
| **Low** | 1 | Sprint 3 |

**Total Test Cases**: 33
