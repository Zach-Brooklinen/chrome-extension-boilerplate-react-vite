import { useState, useEffect } from 'react';

export type DyData = Record<string, unknown> | null;

export const useDyData = (): DyData => {
  const [dyData, setDyData] = useState<DyData>(null);

  useEffect(() => {
    chrome.storage.local.get('dyData', result => {
      if (result.dyData) setDyData(result.dyData as DyData);
    });

    const handleMessage = (message: { type: string }) => {
      if (message.type === 'BROOKLINEN_DY') {
        setDyData(message as DyData);
      }
    };
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);

  return dyData;
};
