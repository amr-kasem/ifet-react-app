import React, { createContext, forwardRef, useEffect, useState } from "react";
// import mqtt from 'mqtt/dist/mqtt';
import mqtt from "mqtt";
import Receiver1 from "./Receiver";
import { useImperativeHandle } from "react";
import { useDispatch } from "react-redux";
import { generalActions } from "../../store/general-slice";

export const QosOption = createContext([]);

const HookMqtt = forwardRef((props, ref) => {
  const dispatch = useDispatch()
  const [client, setClient] = useState(null);
  const [connectStatus, setConnectStatus] = useState("Connect");

  const mqttConnect = (host, mqttOption) => {
    if (client == null) {
      setClient(mqtt.connect(host, mqttOption));
    }
  };

  const reconnect = () => {
    const url = `ws://${window.location.hostname}:8084/mqtt`;
    // const url = `wss://${window.location.hostname}:8084/mqtt`;
    const clientId = `mqttjs_ + ${Math.random().toString(16).substr(2, 8)}`;
    options.clientId = clientId;
    mqttConnect(url, options);
  };

  useEffect(() => {
    if (client) {
      client.on("connect", () => {
        setConnectStatus("Connected");
      });
      client.on("error", (err) => {
        console.error("Connection error: ", err);
        client.end();
      });
      client.on("reconnect", () => {
        setConnectStatus("Reconnecting");
      });
      client.on("message", (topic, message) => {
        const payload = { topic, message: message.toString() };
        // console.log("topic",topic)
        dispatch(
          generalActions.setPayload({
            value: payload,
          })
        );
      });
    }
  }, [client]);

  const mqttSub = (subscription) => {
    if (client) {
      const { topic, qos } = subscription;
      client.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.log("Subscribe to topics error", error);
          return;
        }
      });
    }
  };

  useImperativeHandle(ref, () => ({
    mqttPub(context) {
      if (client) {
        const { topic, qos, payload } = context;
        client.publish(topic, payload, { qos }, (error) => {
          if (error) {
            console.log("Publish error: ", error);
            reconnect();
          }
        });
        console.log("omda payload sended: ", payload , "at topic:" , topic);
      }
    },
  }));

  useEffect(() => {
    props.topics.forEach((topic, index) => {
      const record = {
        topic: topic,
        qos: 1,
      };
      mqttSub(record);
    });
  }, [props.topics]);

  const options = {
    host: `${window.location.hostname}`,
    keepalive: 300,
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1,
    connectTimeout: 30 * 1000,
    will: {
      topic: "WillMsg",
      payload: "Connection Closed abnormally..!",
      qos: 1,
      retain: false,
    },
    rejectUnauthorized: false,
  };

  reconnect();

  return (
    <>
      <Receiver1 deviceID={props.deviceID} devices={props.devices} />
    </>
  );
});

export default HookMqtt;
