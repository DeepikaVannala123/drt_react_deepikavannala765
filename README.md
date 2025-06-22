# 🛰️ Satellite Data Viewer

A modern, responsive web application for searching, filtering, and exploring satellite data from the global space tracking network. Built with React, TypeScript, and Tailwind CSS.

## ✨ Features

### 🔍 **Search & Discovery**
- **Real-time Search**: Search satellites by name or NORAD Catalog ID
- **Advanced Filtering**: Filter by object type and orbit codes
- **Smart Results**: Instant search with Enter key trigger
- **Large Dataset Handling**: Virtualized rendering for optimal performance

### 📊 **Data Management**
- **Sortable Columns**: Sort by name, NORAD ID, launch date, and country
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Counts**: Live filter counts and statistics
- **Error Handling**: Robust error states with retry functionality

### 🎯 **Selection System**
- **Multi-Select**: Select up to 10 satellites for detailed analysis
- **Persistent Storage**: Selections saved to localStorage
- **Individual Management**: Add/remove satellites individually
- **Bulk Operations**: Clear all selections at once

### 🚀 **User Experience**
- **Modern UI**: Clean, professional interface with smooth animations
- **Loading States**: Beautiful loading indicators and skeleton screens
- **Mobile-First**: Fully responsive design with mobile-optimized layouts
- **Accessibility**: Keyboard navigation and screen reader support

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS for modern, responsive design
- **State Management**: React Context API with localStorage persistence
- **Data Fetching**: TanStack Query for efficient API management
- **Virtualization**: TanStack Virtual for large dataset rendering
- **Icons**: Lucide React for consistent iconography
- **Build Tool**: Vite for fast development and optimized builds

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Modern web browser with ES2020+ support

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd satellite-data-viewer
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Start Development Server
```bash
npm run dev
# or
yarn dev
```

### 4. Open in Browser
Navigate to `http://localhost:5173` to view the application.

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ErrorState.tsx   # Error handling component
│   ├── FilterSidebar.tsx # Advanced filtering interface
│   ├── LoadingState.tsx # Loading indicators
│   ├── SatelliteTable.tsx # Main data table with virtualization
│   ├── SearchBar.tsx    # Search input with filter toggle
│   └── SelectionPanel.tsx # Satellite selection management
├── contexts/            # React Context providers
│   └── SelectedSatellitesContext.tsx # Selection state management
├── pages/              # Main application pages
│   ├── SatelliteViewer.tsx # Primary search and filter interface
│   └── SelectedSatellites.tsx # Selected satellites overview
├── services/           # API and external service integrations
│   └── satelliteApi.ts # Satellite data API client
├── types/              # TypeScript type definitions
│   └── satellite.ts    # Satellite data models and interfaces
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles and Tailwind imports
```

## 🔌 API Integration

The application integrates with the Digantara Satellite API:

**Base URL**: `https://backend.digantara.dev/v1`

#### Get Satellites
```
GET /satellites
```

**Query Parameters**:
- `objectTypes`: Comma-separated list of object types
  - Options: `"ROCKET BODY"`, `"DEBRIS"`, `"UNKNOWN"`, `"PAYLOAD"`
- `attributes`: Comma-separated list of required attributes
  - Available: `noradCatId`, `intlDes`, `name`, `launchDate`, `decayDate`, `objectType`, `launchSiteCode`, `countryCode`, `orbitCode`

**Example Request**:
```bash
curl -X 'GET' \
  'https://backend.digantara.dev/v1/satellites?objectTypes=PAYLOAD,ROCKET%20BODY&attributes=noradCatId,name,launchDate' \
  -H 'accept: application/json'
```

## 🎨 Component Overview

### Core Components

#### `SatelliteTable`
- **Purpose**: Main data display with virtualized rendering
- **Features**: Sorting, selection, responsive design
- **Performance**: Handles 25,000+ records efficiently

#### `FilterSidebar`
- **Purpose**: Advanced filtering interface
- **Features**: Object type and orbit code filters
- **UX**: Slide-out panel with backdrop overlay

#### `SelectionPanel`
- **Purpose**: Manage selected satellites
- **Features**: Individual removal, bulk operations, persistence
- **Storage**: Automatic localStorage synchronization

#### `SearchBar`
- **Purpose**: Primary search interface
- **Features**: Real-time search, filter toggle, visual indicators
- **Interaction**: Enter-to-search with immediate feedback

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 768px - Stacked layout, simplified table
- **Tablet**: 768px - 1024px - Adaptive grid, condensed filters  
- **Desktop**: > 1024px - Full feature layout, side-by-side panels

## 💾 Data Persistence

Selected satellites are automatically saved to browser localStorage:

```typescript
// Storage key
const STORAGE_KEY = 'selectedSatellites';

// Automatic save/load
useEffect(() => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    setSelectedSatellites(JSON.parse(stored));
  }
}, []);
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

## 🌟 Key Features Deep Dive

### Virtualized Rendering
Uses TanStack Virtual for efficient rendering of large datasets:
- **Performance**: Renders only visible rows
- **Memory**: Minimal DOM footprint
- **Smooth Scrolling**: 60fps scrolling experience

### Advanced Filtering
Multi-dimensional filtering system:
- **Object Types**: PAYLOAD, ROCKET BODY, DEBRIS, UNKNOWN
- **Orbit Codes**: 19 different orbit classifications
- **Search**: Name and NORAD ID partial matching

### Selection Management
Sophisticated selection system:
- **Limit**: Maximum 10 satellites
- **Persistence**: Survives page reloads
- **Individual Control**: Add/remove specific satellites
- **Bulk Operations**: Clear all selections

## 🎯 Usage Examples

### Basic Search
1. Enter satellite name or NORAD ID in search bar
2. Press Enter to execute search
3. Results appear in the main table

### Advanced Filtering
1. Click "Filters" button next to search bar
2. Select desired object types and orbit codes
3. Click "Apply Filters" to update results
4. Filter sidebar closes automatically

### Satellite Selection
1. Use checkboxes in the table to select satellites
2. Monitor selection count in the selection panel
3. Remove individual satellites using the X button
4. Proceed to detailed view with "Proceed with Selection"

## 🚀 Performance Optimizations

- **Virtualized Lists**: Only render visible table rows
- **Query Caching**: TanStack Query caches API responses
- **Debounced Search**: Prevents excessive API calls
- **Lazy Loading**: Components load on demand
- **Optimized Bundles**: Tree-shaking and code splitting

## 🔒 Error Handling

Comprehensive error handling throughout:
- **API Errors**: User-friendly error messages with retry options
- **Network Issues**: Automatic retry with exponential backoff
- **Data Validation**: Type-safe data handling with TypeScript
- **Storage Errors**: Graceful localStorage failure handling
