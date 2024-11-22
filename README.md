# Telegraph - Dashboard

Telegraph's dashboard is a centralized location for visualizing your Telegraph implementation and an observability tool. Through the dashboard administrators can inspect notification requests passed to the system, users and their associated preferences managed by the service, and service analytics such as:

- Successful and failed notification deliveries
- Notification deliveries by channel
- Notification failures by channel

Additionally, a Dead Letter Queue page alerts you when messages failed processing and were diverted to the service's dead letter queue.

## Install

(insert npm instructions here)

## Usage

### Running the Dashboard

The dashboard is intened to be run on localhost by a trusted entity. To initialize the dashboard server run the following command from the installed directory `some-named-dashboard-folder-here`:

`npm run start`

The server listens for connections on port `5173` and can be viewed from a browser at `localhost:5173/`.
