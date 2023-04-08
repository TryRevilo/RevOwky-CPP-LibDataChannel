import {useState, useEffect, useCallback, useRef} from 'react';

export function useRevWebSocket(signalingServerUrl) {
  const [webSocket, setWebSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(
    message => {
      if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        webSocket.send(JSON.stringify(message));
      }
    },
    [webSocket],
  );

  const connectWebSocket = useCallback(() => {
    const newWebSocket = new WebSocket(signalingServerUrl);

    newWebSocket.addEventListener('error', event => {
      setError(event.error);
    });

    newWebSocket.addEventListener('close', () => {
      setWebSocket(null);
    });

    newWebSocket.addEventListener('open', () => {
      setWebSocket(newWebSocket);
    });

    newWebSocket.addEventListener('message', event => {
      const message = JSON.parse(event.data);

      console.log('>>> message ', JSON.stringify(message));

      setMessages(prevMessages => [...prevMessages, message]);
    });
  }, [signalingServerUrl]);

  const reconnectIntervalIdRef = useRef(null);

  useEffect(() => {
    if (!webSocket || webSocket.readyState !== WebSocket.OPEN) {
      connectWebSocket();
    }
  }, [connectWebSocket, webSocket]);

  useEffect(() => {
    if (!reconnectIntervalIdRef.current) {
      reconnectIntervalIdRef.current = setInterval(() => {
        if (!webSocket || webSocket.readyState === WebSocket.CLOSED) {
          connectWebSocket();
        }
      }, 5000);
    }

    return () => {
      clearInterval(reconnectIntervalIdRef.current);
      reconnectIntervalIdRef.current = null;
    };
  }, [connectWebSocket, webSocket]);

  return {webSocket, messages, error, sendMessage};
}
