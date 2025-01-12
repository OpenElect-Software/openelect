"use client";

import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { finalizeEvent, verifyEvent } from 'nostr-tools/pure'
import { hexToBytes } from '@noble/hashes/utils'
import { Relay } from 'nostr-tools/relay'

interface Entry {
  name: string;
  number: string;
}

export default function DataEntry() {
  const [entries, setEntries] = useState<Entry[]>([
    { name: '', number: '' },
    { name: '', number: '' }
  ]);
  const [secretKey, setSecretKey] = useState<string>('');
  const [serverUrl, setServerUrl] = useState<string>('');
  const [urlError, setUrlError] = useState<string>('');

  const handleNameChange = (index: number, name: string) => {
    const updatedEntries = [...entries];
    updatedEntries[index].name = name;
    setEntries(updatedEntries);
  };

  const handleNumberChange = (index: number, number: string) => {
    const updatedEntries = [...entries];
    updatedEntries[index].number = number;
    setEntries(updatedEntries);
  };

  const addRow = () => {
    setEntries([...entries, { name: '', number: '' }]);
  };

  const validateServerUrl = (url: string) => {
    if (url.startsWith('ws://') || url.startsWith('wss://')) {
      setUrlError('');
      return true;
    } else {
      setUrlError('Server URL must start with ws:// or wss://');
      return false;
    }
  };

  const handleServerUrlChange = (url: string) => {
    setServerUrl(url);
    validateServerUrl(url);
  };

  const submitData = useCallback(async () => {
    if (!secretKey) {
      console.error('Secret key is required');
      return;
    }

    if (!validateServerUrl(serverUrl)) {
      console.error('Invalid server URL');
      return;
    }

    const jsonData = JSON.stringify(entries);
    console.log('Submitted data:', jsonData);
    console.log('Server URL:', serverUrl);

    const nsecBytes = hexToBytes(secretKey);

    try {
      const event = finalizeEvent({
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: jsonData,
      }, nsecBytes);
      
      const isGood = verifyEvent(event);

      if (isGood) {
        console.log('Event created and verified successfully:', event);
        const relay = await Relay.connect(serverUrl)
        console.log(`connected to ${relay.url}`)
        await relay.publish(event)
        console.log('published event')
        relay.close()
        // TODO: give user visual feedback
      } else {
        console.error('Event verification failed');
      }
    } catch (error) {
      console.error('Error creating or verifying event:', error);
    }
  }, [entries, secretKey, serverUrl]);

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Data Entry</CardTitle>
          <CardDescription>Enter names, numbers, and server details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4">
            <div>
              <Input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter your secret key"
                className="w-full"
              />
            </div>
            <div>
              <Input
                type="text"
                value={serverUrl}
                onChange={(e) => handleServerUrlChange(e.target.value)}
                placeholder="Enter server URL (ws:// or wss://)"
                className="w-full"
              />
              {urlError && <p className="text-red-500 text-sm mt-1">{urlError}</p>}
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Number</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      value={entry.name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      placeholder="Enter name"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={entry.number}
                      onChange={(e) => handleNumberChange(index, e.target.value)}
                      placeholder="Enter number"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-between">
            <Button onClick={addRow}>Add Row</Button>
            <Button onClick={submitData}>Submit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

