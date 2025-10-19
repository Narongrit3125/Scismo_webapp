#!/usr/bin/env python3
"""
Script to fix Admin Projects page after database schema migration
"""

import re

def fix_projects_admin(content):
    """Fix all occurrences in Projects Admin page"""
    
    # 1. Fix project.year -> project.academicYear
    content = re.sub(r'\bproject\.year\b', 'project.academicYear', content)
    
    # 2. Fix formData.year -> formData.academicYear
    content = re.sub(r'\bformData\.year\b', 'formData.academicYear', content)
    
    # 3. Fix project.totalBudget -> project.budget
    content = re.sub(r'\bproject\.totalBudget\b', 'project.budget', content)
    
    # 4. Fix formData.totalBudget -> formData.budget
    content = re.sub(r'\bformData\.totalBudget\b', 'formData.budget', content)
    
    # 5. Remove usedBudget calculations (entire progress bar section)
    # Remove the budget progress section
    progress_pattern = r'{project\.status === \'IN_PROGRESS\' && \([^}]*usedBudget[^}]*\)}'
    content = re.sub(progress_pattern, '', content, flags=re.DOTALL)
    
    # 6. Remove coordinator display
    coordinator_display = r'<div className="flex items-center">\s*<User[^>]*>\s*<span>ผู้ประสานงาน:[^<]*</span>\s*</div>'
    content = re.sub(coordinator_display, '', content, flags=re.DOTALL)
    
    # 7. Remove coordinator from filter
    content = re.sub(
        r'\|\|\s*\(project\.coordinator && project\.coordinator\.toLowerCase\(\)\.includes\(searchTerm\.toLowerCase\(\)\)\)',
        '',
        content
    )
    
    # 8. Fix form inputs - remove priority input section
    priority_input_pattern = r'<div>\s*<label[^>]*>\s*ระดับความสำคัญ[^}]*</select>\s*</div>'
    content = re.sub(priority_input_pattern, '', content, flags=re.DOTALL)
    
    # 9. Remove coordinator input
    coordinator_input_pattern = r'<div>\s*<label[^>]*>\s*ผู้ประสานงาน[^}]*formData\.coordinator[^}]*</div>'
    content = re.sub(coordinator_input_pattern, '', content, flags=re.DOTALL)
    
    return content

# Read file
with open('src/app/admin/projects/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Apply fixes
fixed_content = fix_projects_admin(content)

# Write back
with open('src/app/admin/projects/page.tsx', 'w', encoding='utf-8') as f:
    f.write(fixed_content)

print("✅ Fixed Projects Admin page!")
print("Changes made:")
print("  - project.year → project.academicYear")
print("  - formData.year → formData.academicYear")
print("  - project.totalBudget → project.budget")
print("  - formData.totalBudget → formData.budget")
print("  - Removed progress bar section")
print("  - Removed coordinator references")
print("  - Removed priority input")
