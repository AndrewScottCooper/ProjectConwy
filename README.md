# ProjectConwy

**Real estate data exploration and visualization platform using ASP.NET Core, React, and Azure SQL.**

## Purpose
Analyze and visualize large-scale housing data with interactive tools and machine learning. Built as a portfolio project to demonstrate full stack and data science integration.

## Tech Stack
- ASP.NET Core Web API
- React (Vite)
- Azure SQL Database
- SQL Server Management Studio
- GitHub
- 
## Dataset
Using a 2.2 million row dataset of US real estate listings (sourced from Kaggle). Data includes:
- Listing status (sold, for sale, etc.)
- Bedrooms, bathrooms, land and house size
- Location (city, state, zip)
- Sale prices and previous sale dates

- Link to dataset: https://www.kaggle.com/datasets/ahmedshahriarsakib/usa-real-estate-dataset/data

## Data Processing
- Raw data loaded into a staging table on Azure
- organized data and added columns marking complete/ incomplete listings and tagged reasons
- Views defined for efficient querying

## Views Implemented
- `vw_CompleteListings`: only fully usable records
- `vw_SoldListingsWithPrice`: 1 year window of sold house pricing data
- `vw_ListingsByQuality`: breakdown of missing info

## Next Steps
- Create REST API endpoints for filtered listings
- Connect API to React frontend
- Add map-based UI with county level visualizations
- Train ML models to predict price and compare against current listings.

---
