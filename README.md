# Kanban Board

## Project Overview

The **Kanban Board** is a modern web-based task management application built with **SvelteKit**, **JavaScript**, and **Tailwind CSS**.  
It allows users to create and organize issues visually in a Kanban-style layout with columns representing different task statuses such as *To Do*, *Doing*, and *Done*.  
This project focuses on a smooth user experience, responsive design, and clean animations for an interactive workflow tool suitable for both personal and small-team use.

The application provides an intuitive drag-and-drop experience, dynamic UI updates, and persistent data storage directly in the browser.  
It’s ideal for anyone who wants to manage projects, organize tasks, or simply keep track of daily goals in a visually structured way.

---

## Features

- **Task Creation**  
  Create new issues easily with details such as title, description, due date, story points, and priority.  
  Each issue appears instantly on the board in the correct column.

- **Task Organization**  
  Issues are grouped by status (*To Do*, *Doing*, *Done*) with distinct colors, for easy visual tracking.

- **Persistent Storage**  
  All created issues are saved in the browser’s `localStorage`. This means that refreshing or reopening the page retains all your data without requiring a backend.

- **Visual Feedback**  
  Tasks that are overdue are highlighted with a red background and subtle animations to grab attention.

---

## How It Works

1. **Add a New Issue**  
   Use the “Create Issue” button to open a form. Fill out all necessary fields such as title, description, due date, story points, and priority.

2. **View on Kanban Board**  
   After saving, the issue appears in the appropriate status column, automatically categorized.

3. **Stay Organized**  
   Because the data is stored in `localStorage`, your issues remain intact even after refreshing or closing the browser tab.

4. **Visual Cues**  
   Tasks that are overdue are visually emphasized, making time-sensitive work easier to track.

---

## Installation and Development

### 1. Clone the Repository

Clone the project into your local environment:

```bash
git clone git@github.com:ermihuti/KanbanBoard.git
```

### 2. Install Dependencies

Install the necessary dependencies specified in the package.json file:

``` bash
npm install
```

### 3. Run the Development Server:

Start the SvelteKit development server:

```bash
npm run dev
```

Once running, open the displayed local address (usually http://localhost:5173) in your browser.