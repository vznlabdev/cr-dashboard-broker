"use client";

import { useState } from "react";
import { Users, Building2, ShieldCheck } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { CoverageType } from "@/types";
import type { SyndicateContact } from "@/types";
import {
  brokerTeam,
  syndicateContacts,
  delegatedAuthority,
} from "@/lib/mock-data/people";

const COVERAGE_LABELS: Record<CoverageType, string> = {
  ai_content_ip: "AI Content IP",
  deepfake_liability: "Deepfake",
  copyright_infringement: "Copyright",
  nilp_protection: "NILP",
  comprehensive: "Comprehensive",
};

const RELATIONSHIP_STYLES: Record<string, string> = {
  strong: "bg-[#28a745]/10 text-[#28a745] border-[#28a745]/30",
  moderate: "bg-[#ffc107]/15 text-[#e6a800] border-[#ffc107]/30",
  new: "bg-zinc-500/10 text-zinc-600 border-zinc-500/30",
};

const DA_STATUS_STYLES: Record<string, string> = {
  active: "bg-[#28a745]/10 text-[#28a745] border-[#28a745]/30",
  expiring_soon: "bg-[#ffc107]/15 text-[#e6a800] border-[#ffc107]/30",
  expired: "bg-[#dc3545]/10 text-[#dc3545] border-[#dc3545]/30",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function PeoplePage() {
  const [contactSheetOpen, setContactSheetOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<SyndicateContact | null>(null);

  const openContactDetail = (contact: SyndicateContact) => {
    setSelectedContact(contact);
    setContactSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          People
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Broker team, syndicate contacts and delegated authority
        </p>
      </div>

      <Tabs defaultValue="brokers" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="brokers" className="gap-2">
            <Users className="h-4 w-4" />
            Broker Team
          </TabsTrigger>
          <TabsTrigger value="contacts" className="gap-2">
            <Building2 className="h-4 w-4" />
            Syndicate Contacts
          </TabsTrigger>
          <TabsTrigger value="authority" className="gap-2">
            <ShieldCheck className="h-4 w-4" />
            Delegated Authority
          </TabsTrigger>
        </TabsList>

        {/* Broker Team */}
        <TabsContent value="brokers" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brokerTeam.map((broker) => (
              <Card key={broker.id}>
                <CardHeader className="flex flex-row items-start gap-3 pb-2">
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarFallback className="text-sm font-medium">
                      {getInitials(broker.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base">{broker.name}</CardTitle>
                    <CardDescription>{broker.role}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {broker.specialization.map((s) => (
                      <Badge key={s} variant="secondary" className="text-[10px] font-normal">
                        {COVERAGE_LABELS[s]}
                      </Badge>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <p className="font-mono font-medium">{broker.clientCount}</p>
                      <p className="text-[10px] text-muted-foreground">Clients</p>
                    </div>
                    <div>
                      <p className="font-mono font-medium">£{(broker.gwpHandled / 1000).toFixed(0)}k</p>
                      <p className="text-[10px] text-muted-foreground">GWP</p>
                    </div>
                    <div>
                      <p className="font-mono font-medium">{(broker.hitRatio * 100).toFixed(0)}%</p>
                      <p className="text-[10px] text-muted-foreground">Hit ratio</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1">Hit ratio</p>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${broker.hitRatio * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1">GWP (relative)</p>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/80 transition-all"
                        style={{
                          width: `${(broker.gwpHandled / Math.max(...brokerTeam.map((b) => b.gwpHandled))) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Syndicate Contacts */}
        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Syndicate contacts</CardTitle>
              <CardDescription>Click a row to open contact detail</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Syndicate</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Relationship</TableHead>
                    <TableHead>Territories</TableHead>
                    <TableHead className="text-right">Avg turnaround</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {syndicateContacts.map((c) => (
                    <TableRow
                      key={c.id}
                      className="cursor-pointer hover:bg-muted/30"
                      onClick={() => openContactDetail(c)}
                    >
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>
                        {c.syndicateName} ({c.syndicateNumber})
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{c.role}</TableCell>
                      <TableCell className="text-sm font-mono">{c.email}</TableCell>
                      <TableCell className="text-sm font-mono">{c.phone}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("font-normal capitalize", RELATIONSHIP_STYLES[c.relationshipStrength])}
                        >
                          {c.relationshipStrength}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{c.territories.join(", ")}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{c.avgQuoteTurnaround} days</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delegated Authority */}
        <TabsContent value="authority" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Delegated authority</CardTitle>
              <CardDescription>Authority holder, syndicate, limits and expiry; status badges for approaching/expired</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Authority holder</TableHead>
                    <TableHead>Syndicate</TableHead>
                    <TableHead>Max limit</TableHead>
                    <TableHead>Coverage types</TableHead>
                    <TableHead>Territories</TableHead>
                    <TableHead>Expiry date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {delegatedAuthority.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.authorityHolder}</TableCell>
                      <TableCell>{row.syndicate}</TableCell>
                      <TableCell className="font-mono text-sm">{row.maxLimit}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[180px]">
                        {row.coverageTypes}
                      </TableCell>
                      <TableCell className="text-sm">{row.territories}</TableCell>
                      <TableCell className="font-mono text-sm">{row.expiryDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-normal capitalize",
                            DA_STATUS_STYLES[row.status]
                          )}
                        >
                          {row.status === "expiring_soon" && "Expiring soon"}
                          {row.status === "active" && "Active"}
                          {row.status === "expired" && "Expired"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Contact detail sheet */}
      <Sheet open={contactSheetOpen} onOpenChange={setContactSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          {selectedContact && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedContact.name}</SheetTitle>
                <SheetDescription>
                  {selectedContact.syndicateName} ({selectedContact.syndicateNumber}) · {selectedContact.role}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</p>
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="text-sm font-mono text-primary hover:underline"
                  >
                    {selectedContact.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone</p>
                  <p className="text-sm font-mono">{selectedContact.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Relationship</p>
                  <Badge
                    variant="outline"
                    className={cn("mt-1 font-normal capitalize", RELATIONSHIP_STYLES[selectedContact.relationshipStrength])}
                  >
                    {selectedContact.relationshipStrength}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Territories</p>
                  <p className="text-sm">{selectedContact.territories.join(", ")}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Avg quote turnaround</p>
                  <p className="text-sm font-mono">{selectedContact.avgQuoteTurnaround} days</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Appetite by coverage</p>
                  <ul className="space-y-1 text-sm">
                    {(Object.entries(selectedContact.appetite) as [CoverageType, string][]).map(([cov, level]) => (
                      <li key={cov} className="flex items-center justify-between">
                        <span>{COVERAGE_LABELS[cov]}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] capitalize",
                            level === "hot" && "bg-[#28a745]/10 text-[#28a745]",
                            level === "warm" && "bg-[#ffc107]/15 text-[#e6a800]",
                            level === "cold" && "bg-zinc-500/10 text-zinc-600",
                            level === "declined" && "bg-[#dc3545]/10 text-[#dc3545]"
                          )}
                        >
                          {level}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
