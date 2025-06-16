# Page snapshot

```yaml
- dialog "Create New Story":
  - heading "Create New Story" [level=2]
  - paragraph: Use the STAR method to structure your behavioral interview story
  - text: Story Title *
  - textbox "e.g., Led team through major system migration": Leadership Challenge
  - text: Categories
  - textbox "e.g., Leadership, Technical": Leadership, Team Management
  - text: Tags
  - textbox "e.g., team building, conflict resolution": conflict resolution, team building, decision making
  - text: Situation *
  - textbox "Describe the context and background of the situation..."
  - text: Task *
  - textbox "What was your responsibility or what needed to be accomplished?"
  - text: Action *
  - textbox "Describe the specific actions you took to address the situation..."
  - text: Result *
  - textbox "What was the outcome? Include metrics and impact where possible..."
  - text: Reflection (Optional)
  - textbox "What did you learn? What would you do differently?"
  - button "Create Story"
  - button "Close":
    - img
    - text: Close
```