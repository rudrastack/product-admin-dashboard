# Product Admin Dashboard

A responsive Product Admin Dashboard built using Next.js, React,
Tailwind CSS, Axios, and DummyJSON API.

## Tech Stack

- Next.js
- React
- Tailwind CSS
- Axios
- DummyJSON API

## Features

- User login and logout
- Protected products page
- Responsive product table for desktop
- Responsive product cards for mobile
- Pagination
- Page size selection: 10 / 20 / 50
- Product search with debounce
- Search request cancellation using AbortController
- Category filtering
- Product sorting by price, rating, and title
- Product details page
- Product reviews
- Add product
- Edit product
- Delete product
- Form validation
- Loading state
- Error state with Retry
- Empty state
- URL state preservation

## Login Credentials

Username:

emilys

Password:

emilyspass

## Important Decisions

### Search and Category

Search takes priority when both search and category are selected.

### API Mutations

DummyJSON mutation APIs do not permanently persist changes.
Therefore, after a successful add, edit, or delete operation, the
application updates the local React state so the change is visible
immediately in the UI.

### Search Race Condition

Fast search requests can return out of order. To prevent an older
request from replacing newer results, the application uses debounce
and AbortController.

## Problem and Fix

### Problem

When the user typed quickly in the search box, multiple API requests
could be created and an older response could overwrite a newer search
result.

### Fix

A 500ms debounce was added so the API request is made after the user
stops typing. AbortController is also used to cancel the previous
request when a new search starts.

## API Structure

API calls are kept separate from UI components inside the `services`
folder.

Axios configuration is centralized inside:

`lib/axios.js`

## Setup

Clone the repository:

```bash
git clone https://github.com/rudrastack/product-admin-dashboard

## Install dependencies:

npm install

## Start the development server:

npm run dev

## Open:

http://localhost:3000

## AI_Usage

AI was used for implementation guidance, debugging assistance, and
code explanations during development. The implemented code was
reviewed and understood before submission and enhanced the ui of application