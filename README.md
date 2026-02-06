
# Examination Duty Roster 

A React-based web application for managing examination invigilation schedules. The system automatically generates duty rosters by assigning faculty and staff to examination rooms across multiple time slots while respecting availability constraints, workload limits, and scheduling rules.

This is a client-side application that runs entirely in the browser and stores data using localStorage.

## Features

* Room management with unique identifiers
* Exam slot creation with date and 12-hour time format (AM/PM)
* Staff and faculty management with role separation
* Faculty-specific constraints:

  * Preferred working days
  * Maximum duty count limits
* Automatic roster generation with rules:

  * 1 staff + 1 faculty per room (fallback to 2 faculty if staff unavailable)
  * No double-booking in the same time slot
  * Faculty assigned only on their preferred days
  * Maximum duty limits are respected
  * Workload is distributed as evenly as possible
* Roster status tracking (Complete / Pending)
* PDF export of the final roster
* Persistent storage using browser localStorage

## Tech Stack

* Frontend: React 18
* State Management: React Hooks (useState, useEffect)
* PDF Generation: @react-pdf/renderer
* Styling: CSS
* Storage: Browser localStorage
* Build Tool: Create React App
* Package Manager: npm

## Installation

### Prerequisites

* Node.js (v14 or higher)
* npm

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Laibayounas56/Duty-Roster.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open the application in your browser:

   ```
   http://localhost:3000
   ```

## How to Use

Follow this order for correct usage of the system:

### 1. Add Rooms

* First, create the examination rooms.
* Each room will be used during roster generation.
* Rooms are required before slots and assignments can be created.

### 2. Add Exam Slots

* Create exam slots by selecting:

  * Date
  * Start time and end time (12-hour format with AM/PM)
* Each slot represents one exam session.
* Assign Rooms to Slot

### 3. Add Faculty and Staff

* Add all staff and faculty members.
* For faculty, define:

  * Sub-role (e.g., Professor, Lecturer, etc.)
  * Preferred working days
  * Maximum duty count
* Staff members do not have duty limits.

### 4. Review Configuration

* Review the added:

  * Rooms
  * Slots
  * People (staff and faculty)
* Make sure all information is correct before generating the roster.

### 5. Generate Roster

* Click on **Generate Roster**.
* The system will:

  * Assign 1 staff + 1 faculty per room (or 2 faculty if staff are unavailable)
  * Respect faculty day preferences
  * Enforce maximum duty limits for faculty
  * Prevent assigning the same person to multiple rooms in the same slot
  * Balance workload across available personnel

### 6. View Roster

* Open the roster view to see:

  * Slot-wise room assignments
  * Assigned staff and faculty for each room
  * Status of each assignment (Complete / Pending)
  * Workload summary for each person

### 7. Download PDF

* Download the final roster as a PDF file.
* The PDF includes:

  * Complete roster grouped by slots and rooms
  * Clear listing of assigned staff and faculty
  * Formatted dates and times suitable for printing and official use

## PDF Output

The system generates a professional PDF report containing:

* Slot-wise duty allocation
* Room-wise assignments
* Staff and faculty names
* Clearly formatted date and time information

This PDF can be used for official distribution, printing, or record keeping.

## Assignment Rules (Summary)

* Each room is assigned:

  * 1 staff + 1 faculty, or
  * 2 faculty if staff are not available
* Faculty:

  * Are only assigned on their preferred days
  * Cannot exceed their maximum duty count
* No person can be assigned to more than one room in the same time slot
* The algorithm attempts to distribute duties fairly among all available personnel

## Data Storage

All data is stored in browser localStorage, including:

* Rooms
* Slots
* People (staff and faculty)
* Generated roster

Note: Clearing browser data will remove all saved information.

## Notes

* This is a client-only application. No server or database is required.
* The project is intended for academic and departmental use for managing examination duty rosters.
* Make sure to generate the roster before attempting to export the PDF.

