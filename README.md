# Telegraph Dashboard

The dashboard is a centralized location for visualizing your Telegraph service implementation and an observability tool for monitoring system health.

## Features

- View notification status and filter notification requests by recipient ID or channel.
- View users and filter by User ID, Email, or notification preferences.
- Visualize system activity and performance with charts displaying:
  - Successful and failed notification deliveries.
  - Notification deliveries by channel.
  - Notification failures by channel.
- Inspect messages which failed processing and were diverted to the service's dead letter queue.

## Installation

<!-- TO DO: add more details later -->

## Usage

### Running the Dashboard

The dashboard is intened to be run on localhost by a trusted entity. To initialize the dashboard server run the following command from the installed directory:

<!-- TO DO: add npm install instructions -->

The server listens for connections on port `5173` and can be viewed from a browser at `localhost:5173/`.
