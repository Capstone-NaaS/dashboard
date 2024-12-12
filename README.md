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

To install the dashboard, run the following command:

```bash
$ npx @telegraph-notify/telegraph-dashboard
```

This will create a subdirectory named `telegraph-dashboard`. Navigate to this directoy and run:

```bash
$ npm install
```

To initialize the dashboard server, a `.env` file must be created with the following information:

| Key               | Value                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------------- |
| VITE_HTTP_GATEWAY | URL of the HTTP API Gateway. This is output by Telegraph CLI after depolyment.           |
| VITE_API_KEY      | The API key to access the HTTP Gateway. This is set during Telegraph CLI initialization. |

Please refer to [Telegraph CLI](https://github.com/telegraph-notify/telegraph-cli) for more information.

## Usage

### Running the Dashboard

The dashboard is intended to be run on localhost by a trusted entity. Run the following command to start the dashboard:

```bash
$ npm run prod
```

The server listens for connections on port `5173` and can be viewed from a browser at `localhost:5173/`.

### Interpreting Notification Logs

Notification logs are generated so developers can extract metrics from Telegraph if desired and as an observability tool.
When a notification failure occurs, the dashboard attaches a failure badge to the log.
The following table maps logs to their lambda's so users can understand where in the system to start debugging.

| Lambda               | Logs                                                                                                                                            |
| :------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| `sendEmail`          | <ul><li>Email sent.</li><li>Email could not be sent: SES failure.</li><li>Error sending email.</li></ul>                                        |
| `sendSlack`          | <ul><li>Slack notification sent.</li><li>Slack notification could not be sent.</li><li>Error sending slack notification.</li></ul>              |
| `dynamoLogger`       | <ul><li>Notification request received.</li><li>Notification not sent - channel disabled by user.</li></ul>                                      |
| `sendInitialData`    | <ul><li>In-app notification sent.</li></ul>                                                                                                     |
| `updateNotification` | <ul><li>In-app notification read.</li><li>In-app notification deleted.</li></ul>                                                                |
| `websocketBroadcast` | <ul><li>In-app notification sent.</li><li>In-app notification queued for sending.</li><li>In-app notification unable to be broadcast.</li></ul> |
