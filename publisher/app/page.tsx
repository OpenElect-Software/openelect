"use client";

import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { finalizeEvent, verifyEvent } from 'nostr-tools/pure'
import { hexToBytes } from '@noble/hashes/utils'
// import { getPublicKey } from 'nostr-tools'

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

  const submitData = useCallback(() => {
    if (!secretKey) {
      console.error('Secret key is required');
      return;
    }

    const jsonData = JSON.stringify(entries);
    console.log('Submitted data:', jsonData);

    const nsecBytes = hexToBytes(secretKey);
    // const nsecHex = bytesToHex(nsecBytes);
    // const pubkey = getPublicKey(nsecBytes);

    // Create and verify Event
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
        // TODO: Publish to nostr relay
      } else {
        console.error('Event verification failed');
      }
    } catch (error) {
      console.error('Error creating or verifying event:', error);
    }
  }, [entries, secretKey]);

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Data Entry</CardTitle>
          <CardDescription>Enter names and numbers</CardDescription>
        </CardHeader>
        <CardContent>
        <div className="mb-4">
          <Input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="Enter your secret key"
            className="w-full"
          />
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

