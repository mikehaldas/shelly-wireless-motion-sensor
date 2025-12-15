# Shelly BLU Wireless Motion Sensor API Integration Script

This javascript project enables the integration of a Shelly BLUE wireless door sensor with a Viewtron security camera system. This is done via the custom script feature of Shelly BLU sensors and the HTTP Post / webhook API supported by Viewtron IP camera NVRs. Please note that the script can easily be modified so that it can be used to integrate any device with the Shelly window / door sensor. If you have an IoT device that supports an HTTP Post / webhook API, you can use this script to integrate the wireless door sensor.

## How the Integration Script Works

![Alt text](https://videos.cctvcamerapros.com/wp-content/files/Wireless-Motion-Sensor-Integration.jpg "Wireless Motion Sensor Integration")

This is how the integration between the Shelly wireless motion detector and Viewtron NVR works.

- The Shelly wireless motion sensor communicates with a Shelly BLU wireless Gateway via Bluetooth.
- The Shelly Blu Gateway (pictured in the middle, plugged into a standard power outlet) is connected via WIFI to the same network that the Viewtron NVR is on.
- The NVR is hard wired to the wireless router.
- The custom javascript code from this repository is installed on the Shelly Gateway. This code is triggered when the door sensor is opened.
- The javascript code makes an HTTP Post (webhook API) to trigger a virtual alarm on the NVR.
- The virtual alarm on the NVR can trigger video surveillance recording, mobile app push notification, an audio alarm, and many other alarm actions.

## Step by Step Setup Instructions

You can find step-by-step setup instructions with screenshots on this page. Please note that a Shelly BLU wireless door sensor is used in those setup instructions, but the process is the same except that you will install the script from this project to your Shelly BLU motion sensor. https://github.com/mikehaldas/shelly-wireless-motion-sensor/blob/main/script.js

https://videos.cctvcamerapros.com/v/wireless-door-sensor-alarm.html

## Viewtron IP Camera NVRs

You can find all of the Viewtron NVRs that support the virtual alarm API that work with this integration script on this page.

https://www.cctvcamerapros.com/IP-Camera-NVRs-s/1472.htm

## Shelly BLU Wireless Motion Sensor

You can find the Shelly BLU wireless motion sensor here.

https://us.shelly.com/products/shelly-blu-motion

You can find the Shelly BLU Wireless Gateway here.

https://us.shelly.com/products/shelly-blu-gateway

