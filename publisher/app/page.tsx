"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Entry {
  name: string;
  number: string;
}

export default function DataEntry() {
  const [entries, setEntries] = useState<Entry[]>([
    { name: '', number: '' },
    { name: '', number: '' }
  ]);

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

  const submitData = () => {
    const jsonData = JSON.stringify(entries);
    console.log('Submitted data:', jsonData);
    // TODO: Publish to nostr relay
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Data Entry</CardTitle>
          <CardDescription>Enter names and numbers</CardDescription>
        </CardHeader>
        <CardContent>
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

