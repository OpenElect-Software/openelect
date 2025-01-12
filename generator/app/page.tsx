"use client";

import { useState } from 'react';
import { generateSecretKey, getPublicKey } from 'nostr-tools/pure';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Account {
  secretKey: string;
  publicKey: string;
  name: string;
}

export default function Home() {
  const [numAccounts, setNumAccounts] = useState<number>(1);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const generateAccounts = () => {
    const newAccounts = Array.from({ length: numAccounts }, () => {
      const sk = generateSecretKey();
      const pk = getPublicKey(sk);
      return {
        secretKey: Buffer.from(sk).toString('hex'),
        publicKey: pk,
        name: '',
      };
    });
    setAccounts(newAccounts);
  };

  const handleNameChange = (index: number, name: string) => {
    const updatedAccounts = [...accounts];
    updatedAccounts[index].name = name;
    setAccounts(updatedAccounts);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>OpenElect Account Generator</CardTitle>
          <CardDescription>Generate and manage Nostr accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Input
              type="number"
              min="1"
              value={numAccounts}
              onChange={(e) => setNumAccounts(parseInt(e.target.value))}
              placeholder="Number of accounts"
              className="w-48"
            />
            <Button onClick={generateAccounts}>Generate Accounts</Button>
          </div>
        </CardContent>
      </Card>

      {accounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Secret Key</TableHead>
                  <TableHead>Public Key</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={account.name}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                        placeholder="Enter account name"
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">{account.secretKey}</TableCell>
                    <TableCell className="font-mono text-sm">{account.publicKey}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
