

## Plan: Add DEPARTMENTS Section to Sidebar

### What's Missing
The reference app at `district-case-flow.lovable.app` has a **DEPARTMENTS** collapsible section in the left sidebar, listing all 10 departments with case count badges (e.g., "Revenue 5", "Land Records 2"). The current project's sidebar only has Main, Administration, and Account sections -- no department quick-navigation.

### What Will Be Built

**File: `src/components/layout/AppSidebar.tsx`**

1. Import `useData` from DataContext and `departments` from sampleData, plus the `Building2` icon
2. Add a new `departments` section to `openSections` state (default collapsed)
3. After the Administration section and before Account, add a **DEPARTMENTS** collapsible section
4. Each department renders as a sidebar link pointing to `/cases?department=<encoded_dept_name>`
5. Each department item shows a small badge with the live case count (computed from `useData().cases`)
6. When sidebar is collapsed, departments section shows as a divider (consistent with other sections)
7. Department links visible based on permissions -- show for roles that have case list access

### Visual Match to Reference
- Section header: "DEPARTMENTS" with Building2 icon and chevron toggle
- Each item: department name (left) + count badge (right) in sidebar styling
- Clicking navigates to the case list pre-filtered by that department
- Counts are dynamic from the data context

### Files Changed
- `src/components/layout/AppSidebar.tsx` -- single file change

