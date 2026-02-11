"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ThemedChartWrapper } from "@/components/broker/themed-chart-wrapper";
import { riskGradeColors } from "@/lib/status-colors";
import { cn } from "@/lib/utils";
import { clients } from "@/lib/mock-data/clients";
import { policies } from "@/lib/mock-data/policies";
import { claims } from "@/lib/mock-data/claims";
import { getClientRiskScores } from "@/lib/mock-data/client-risk-scores";

const CHART_COLORS = ["#8b5cf6", "#a78bfa", "#6366f1", "#818cf8", "#22d3ee"];

export default function ClientDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const client = useMemo(() => clients.find((c) => c.id === id), [id]);

  const clientPolicies = useMemo(
    () => policies.filter((p) => p.clientId === id),
    [id]
  );
  const clientClaims = useMemo(
    () => claims.filter((c) => c.clientName === client?.name),
    [client?.name]
  );
  const riskScores = useMemo(() => getClientRiskScores(id), [id]);

  const assetBreakdownData = useMemo(() => {
    if (!client) return [];
    const human = 100 - client.aiAssetPercentage;
    return [
      { name: "AI-generated / assisted", value: client.aiAssetPercentage },
      { name: "Human / traditional", value: human },
    ];
  }, [client]);

  const riskRadarData = useMemo(() => {
    if (!riskScores) return [];
    return [
      { subject: "Documentation", value: riskScores.documentation, fullMark: 100 },
      { subject: "Tool safety", value: riskScores.toolSafety, fullMark: 100 },
      { subject: "Copyright", value: riskScores.copyrightCheck, fullMark: 100 },
      { subject: "AI model trust", value: riskScores.aiModelTrust, fullMark: 100 },
      { subject: "Training data", value: riskScores.trainingDataQuality, fullMark: 100 },
    ];
  }, [riskScores]);

  const [documents] = useState(() => [
    { id: "doc-1", name: "Underwriting information 2024.pdf", date: "2024-11-15" },
    { id: "doc-2", name: "Content policy.pdf", date: "2024-10-01" },
    { id: "doc-3", name: "AI tool inventory.xlsx", date: "2024-09-20" },
  ]);

  if (!client) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Client not found.
      </div>
    );
  }

  const gradeStyle = riskGradeColors[client.riskGrade];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{client.name}</CardTitle>
              <CardDescription className="mt-1">
                {client.industry} · {client.territory}
              </CardDescription>
              <p className="text-sm text-muted-foreground mt-2">
                {client.contactName} · {client.contactEmail}
              </p>
            </div>
            {gradeStyle && (
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
                  gradeStyle.bg,
                  gradeStyle.text
                )}
              >
                Risk Grade {client.riskGrade}
              </span>
            )}
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="risk">Risk Profile</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-medium">Total GWP</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">£{(client.gwp / 1000).toFixed(0)}k</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-medium">Total Limit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">£{(client.totalLimit / 1_000_000).toFixed(2)}M</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">{client.activePolicies}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">£{(client.totalAssets / 1_000_000).toFixed(2)}M</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ThemedChartWrapper>
              {(theme) => (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Asset breakdown</CardTitle>
                    <CardDescription>AI vs human content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[220px] min-h-[220px] w-full">
                      <ResponsiveContainer width="100%" height="100%" minHeight={220}>
                        <PieChart>
                          <Pie
                            data={assetBreakdownData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                          >
                            {assetBreakdownData.map((_, i) => (
                              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: theme.tooltipBg,
                              border: `1px solid ${theme.tooltipBorder}`,
                              borderRadius: "8px",
                              color: theme.tooltipText,
                            }}
                            formatter={(value: number | undefined) => [value != null ? `${value}%` : "", "Share"]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </ThemedChartWrapper>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Portfolio mix</CardTitle>
                <CardDescription>Content type distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {client.portfolioMix.map((m) => (
                    <li key={m.type} className="flex items-center justify-between text-sm">
                      <span>{m.type}</span>
                      <span className="font-medium">{m.percentage}%</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Policies</CardTitle>
              <CardDescription>Active and expired</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy #</TableHead>
                    <TableHead>Syndicate</TableHead>
                    <TableHead>Coverage</TableHead>
                    <TableHead>Limit</TableHead>
                    <TableHead>Premium</TableHead>
                    <TableHead>Inception</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientPolicies.map((p) => (
                    <TableRow key={p.id} className="border-b border-border/10 h-8">
                      <TableCell className="px-3 py-1 font-mono text-[11px]">
                        {p.policyNumber}
                      </TableCell>
                      <TableCell className="px-3 py-1 text-[11px]">{p.syndicateName}</TableCell>
                      <TableCell className="px-3 py-1 text-[11px] text-muted-foreground">
                        {p.coverageType.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell className="px-3 py-1 font-mono text-[11px]">
                        £{(p.limit / 1000).toFixed(0)}k
                      </TableCell>
                      <TableCell className="px-3 py-1 font-mono text-[11px]">
                        £{(p.premium / 1000).toFixed(0)}k
                      </TableCell>
                      <TableCell className="px-3 py-1 text-[11px]">{p.inceptionDate}</TableCell>
                      <TableCell className="px-3 py-1 text-[11px]">{p.expiryDate}</TableCell>
                      <TableCell className="px-3 py-1">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                            p.status === "active" && "text-[#28a745] bg-[#28a745]/10",
                            p.status === "expired" && "text-zinc-500 bg-zinc-500/10",
                            p.status === "pending_renewal" && "text-[#ffc107] bg-[#ffc107]/15"
                          )}
                        >
                          {p.status.replace(/_/g, " ")}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {clientPolicies.length === 0 && (
                <p className="text-muted-foreground text-sm py-4">No policies.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="claims" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Claims history</CardTitle>
              <CardDescription>Reported claims</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Incurred</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Reserve</TableHead>
                    <TableHead>Reported</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientClaims.map((c) => (
                    <TableRow key={c.id} className="border-b border-border/10 h-8">
                      <TableCell className="px-3 py-1 font-mono text-[11px]">{c.id}</TableCell>
                      <TableCell className="px-3 py-1 text-[11px]">{c.claimType}</TableCell>
                      <TableCell className="px-3 py-1 font-mono text-[11px]">
                        £{(c.incurredAmount / 1000).toFixed(1)}k
                      </TableCell>
                      <TableCell className="px-3 py-1 font-mono text-[11px]">
                        £{(c.paidAmount / 1000).toFixed(1)}k
                      </TableCell>
                      <TableCell className="px-3 py-1 font-mono text-[11px]">
                        £{(c.reserveAmount / 1000).toFixed(1)}k
                      </TableCell>
                      <TableCell className="px-3 py-1 text-[11px]">{c.dateReported}</TableCell>
                      <TableCell className="px-3 py-1">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                            c.status === "open" && "text-[#ffc107] bg-[#ffc107]/15",
                            c.status === "closed" && "text-[#28a745] bg-[#28a745]/10",
                            c.status === "reserved" && "text-blue-600 bg-blue-500/10"
                          )}
                        >
                          {c.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {clientClaims.length === 0 && (
                <p className="text-muted-foreground text-sm py-4">No claims.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          {riskScores ? (
            <ThemedChartWrapper>
              {(theme) => (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Risk profile</CardTitle>
                    <CardDescription>
                      CR scoring model: documentation, tool safety, copyright, AI model trust,
                      training data quality (0–100)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[320px] min-h-[320px] w-full">
                      <ResponsiveContainer width="100%" height="100%" minHeight={320}>
                        <RadarChart data={riskRadarData}>
                          <PolarGrid stroke={theme.gridColor} />
                          <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: theme.textColor, fontSize: 11 }}
                          />
                          <PolarRadiusAxis
                            angle={90}
                            domain={[0, 100]}
                            tick={{ fill: theme.textColor, fontSize: 10 }}
                          />
                          <Radar
                            name="Score"
                            dataKey="value"
                            stroke={theme.chart1}
                            fill={theme.chart1}
                            fillOpacity={0.4}
                            strokeWidth={2}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: theme.tooltipBg,
                              border: `1px solid ${theme.tooltipBorder}`,
                              borderRadius: "8px",
                              color: theme.tooltipText,
                            }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </ThemedChartWrapper>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No risk score data for this client.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-lg">Documents</CardTitle>
                  <CardDescription>Attachments and uploads</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Upload className="h-4 w-4" />
                  Upload (mock)
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center gap-3 rounded-lg border border-border/50 px-3 py-2 text-sm"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 truncate">{doc.name}</span>
                    <span className="text-muted-foreground text-xs">{doc.date}</span>
                  </li>
                ))}
              </ul>
              {documents.length === 0 && (
                <p className="text-muted-foreground text-sm py-4">No documents.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
