import { useState } from "react";
import axios from "axios";
import {
  Title,
  Text,
  Card,
  Stack,
  Group,
  Badge,
  Container,
  TextInput,
  NumberInput,
  Button,
  Space,
} from "@mantine/core";
import { PieChart } from "@mantine/charts";

interface Data {
  id: string;
  content: string;
  author: string;
  sentiment: string;
  created_at: string;
}

interface ApiResponse {
  keyword: string;
  instance: string;
  count: number;
  sentiment: string;
  data: Data[];
}

function getSentimentColor(sentiment: string) {
  switch (sentiment.toLocaleLowerCase()) {
    case "positive":
      return "green";
    case "negative":
      return "red";
    default:
      return "gray";
  }
}

export function HomePage() {
  const [keyword, setKeyword] = useState("");
  const [limit, setLimit] = useState(10);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  async function fetchData() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      const { data } = await axios.get(`${API_URL}/api/mastodon`, {
        params: { keyword, limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApiResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  // Calculate sentiment distribution for the pie chart
  const getSentimentData = () => {
    if (!apiResponse) return [];
    
    const sentimentCounts = apiResponse.data.reduce((acc, item) => {
      const sentiment = item.sentiment?.toLowerCase() || 'neutral';
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sentimentCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: getSentimentColor(name),
    }));
  };

  const sentimentData = getSentimentData();
  console.log("Sentiment Data:", sentimentData);

  return (
    <Container my="xl" size="xl">
      <Title order={1} mb="md">
        Welcome to Trenditor
      </Title>
      <Text size="lg" mb="xl">
        Analyze Reddit trends with AI-powered sentiment analysis.
      </Text>

      <Group mb="xl" gap="sm" grow>
        <TextInput
          label="Keyword"
          placeholder="Enter a keyword"
          value={keyword}
          onChange={(event) => setKeyword(event.currentTarget.value)}
        />
        <NumberInput
          label="Limit"
          placeholder="Number of posts"
          value={limit}
          onChange={(value) => setLimit(typeof value === "number" ? value : 10)}
          min={1}
          max={100}
        />
        <Button onClick={fetchData} loading={loading} mt="lg" color="blue">
          Search
        </Button>
      </Group>

      {error && <Text color="red">{error}</Text>}

      {apiResponse && (
        <>
          <Group mb="xl">
            <Text fw={500}>Searched Tag: {apiResponse.keyword}</Text>
            <Text>Instance: {apiResponse.instance}</Text>
            <Text>Posts Found: {apiResponse.count}</Text>
            <Badge color={getSentimentColor(apiResponse.sentiment)}>
              Overall Sentiment: {apiResponse.sentiment}
            </Badge>
          </Group>

          {sentimentData.length > 0 ? (
            <Card withBorder shadow="sm" radius="md" mb="xl" p="lg">
              <Text fw={500} mb="md" size="lg">
                Sentiment Distribution
              </Text>
              <div style={{ 
                width: '100%',
                height: '400px',
                minHeight: '300px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  minWidth: '300px',
                  minHeight: '300px'
                }}>
                  <PieChart
                    data={sentimentData}
                    withLabels
                    labelsType="percent"
                    size={300}
                    strokeWidth={1}
                    styles={{
                      root: {
                        width: '100%',
                        height: '100%'
                      },
                    }}
                  />
                </div>
              </div>
            </Card>
          ) : (
            <Text color="orange" mb="xl">
              No sentiment data available for visualization
            </Text>
          )}

          <Stack>
            {apiResponse.data.map((item) => (
              <Card
                key={item.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
              >
                <Group justify="space-between" mb="xs">
                  <Text fw={500}>{item.author}</Text>
                  <Group>
                    <Badge color={getSentimentColor(item.sentiment)}>
                      {item.sentiment || "Neutral"}
                    </Badge>
                    <Text size="sm" c="dimmed">
                      {new Date(item.created_at).toLocaleDateString()}
                    </Text>
                  </Group>
                </Group>
                <Text
                  size="sm"
                  style={{ whiteSpace: "pre-wrap" }}
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </Card>
            ))}
          </Stack>
          <Space h="xl" />
        </>
      )}
    </Container>
  );
}