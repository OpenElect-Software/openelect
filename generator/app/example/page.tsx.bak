"use client";

import { useEffect, useState } from 'react';
import { initializeNDK } from '@/lib/ndkHelper';
import { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';

export default function Home() {
  const [ndk, setNdk] = useState<ReturnType<typeof initializeNDK>>();
  let [events, setEvents] = useState<NDKEvent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const ndkInstance = initializeNDK();
      setNdk(ndkInstance);
      await ndkInstance.connect();

      const filter: NDKFilter = { kinds: [1] };

      // Will return all found events
      let events = await ndkInstance.fetchEvents(filter);
      setEvents(Array.from(events));
      console.log(events);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Welcome to the Next.js App with NDK</h1>
      {/* display each event */}
      {events.map((event) => (
        <div key={event.id}>
          <h2>{event.id}</h2>
          <p>{event.content}</p>
        </div>
      ))}
    </div>
  );
}