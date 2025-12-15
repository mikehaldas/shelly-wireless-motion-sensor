// This script is used to integrate a Shelly BLU wireless motion detector
// with a Viewtron IP camera NVR. The script monitors the motion sensor. When motion
// is detected, the script sends an HTTP Post to the a virtual alarm webhook endpoint on the NVR.
// The script can easily be modified to integrate the Shelly motion detector with any device
// by modifying the XML that it sends and the API_ENDPOINT that the XML is sent to.
// 
// This project requires a Shelly BLU Gateway, a Shelly BLU motion detector, and a
// Viewtron IP camera NVR
// https://www.viewtron.com/nvr
// https://us.shelly.com/products/shelly-blu-motion
// https://us.shelly.com/products/shelly-blu-gateway
//
// The script is uploaded to the Shelly BLU Gateway via the mobile app or web browser interface.
// This script was written by Mike Haldas, co-founder at CCTV Camera Pros.
// https://www.cctvcamerapros.com
// mike@cctvcamerapros.net


const SENSOR_MAC = "ec:1e:f4:a9:fc:8c";  // CHANGE TO YOUR MOTION SENSOR'S MAC ADDRESS
const USERNAME = "admin"; // NVR Username
const PASSWORD = "temp12345"; // NVR password
const NVR_IP = "192.168.0.147";
const NVR_PORT = "80";
const NVR_ALARM_PORT = "31";   // Virtual alarm port (31 = virtual 15 on Viewtron 16ch NVRs)


// XML payload for Viewtron NVR - do NOT change unless integrating with another system
const XML = '<?xml version="1.0" encoding="utf-8" ?>' +
'<config version="2.0.0" xmlns="http://www.Sample.ipc.com/ver10">' +
' <action>' +
'   <status>true</status>' +
' </action>' +
'</config>';

// This is the HTTP Post endpoint of the Viewtron NVR. Only modify this if you are using this script to communicate
// with a device other than a Viewtron NVR.
const API_ENDPOINT = "http://" + USERNAME + ":" + PASSWORD + "@" + NVR_IP + ":" + NVR_PORT + "/TriggerVirtualAlarm/" + NVR_ALARM_PORT;

let lastMotion = false;
let lastPacketId = -1;

print("MOTION SENSOR SCRIPT STARTED – Monitoring device:", SENSOR_MAC);

BLE.Scanner.Start({active: true, duration_ms: BLE.Scanner.INFINITE_SCAN});

BLE.Scanner.Subscribe(function(event, result) {
  if (event !== BLE.Scanner.SCAN_RESULT) return;
  if (result.addr !== SENSOR_MAC) return;

  let payload = result.service_data && result.service_data.fcd2 ? result.service_data.fcd2 : null;
  if (!payload && result.service_data && result.service_data["181a"]) {
    payload = result.service_data["181a"];
    print("Received UNENCRYPTED packet");
  }
  if (!payload) return;

  print("Received ENCRYPTED packet");

  // Grab the hex payload
  let hex = "";
  for (let b = 0; b < payload.length; b++) {
    let byte = payload.at(b);
    hex += (byte < 16 ? "0" : "") + byte.toString(16) + " ";
  }
  print("Payload hex: " + hex);

  // Deduplicate
  let packetId = payload.at(2);
  if (packetId === lastPacketId) return;
  lastPacketId = packetId;

  // Parse BTHome v2
  let i = 1;
  let motion = null;

  while (i < payload.length) {
    let id = payload.at(i++);

    if (id === 0x21) {                    // Motion state changed
      motion = payload.at(i++) === 1;
      print("Motion state:", motion ? "DETECTED" : "clear");
    }
    else if (id === 0x01) {                // Battery %
      let bat = payload.at(i++);
      print("Battery:", bat, "%");
    }
    else if (id === 0x0A) {                // Illuminance (24-bit)
      i += 3;                              // skip 3 bytes
    }
    else {
      // Skip everything else (most are 1 byte)
      i++;
    }
  }

  if (motion === null) {
    print("No motion field in this packet");
    return;
  }

  if (motion && !lastMotion) {
    lastMotion = true;
    print("MOTION DETECTED: Sending HTTP Post to Viewtron NVR");

    Shelly.call("HTTP.POST", {
      API_ENDPOINT: "http://" + USERNAME + ":" + PASSWORD + "@" + NVR_IP + ":" + NVR_PORT + "/TriggerVirtualAlarm/" + NVR_ALARM_PORT,
      body: XML,
      content_type: "text/xml"
    }, function(res, err) {
      print(err ? "NVR ERROR: " + JSON.stringify(err) : "NVR OK – code " + res.code);
    });

  } else if (!motion && lastMotion) {
    lastMotion = false;
    print("Motion detection cleared");
  }
});
