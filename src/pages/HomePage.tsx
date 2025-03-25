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
      console.log(data);
      setApiResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

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
        />
        <Button onClick={fetchData} loading={loading} mt="lg">
          Search
        </Button>
      </Group>

      {error && <Text color="red">{error}</Text>}

      {apiResponse && (
        <>
          <Group mb="xl">
            <Text fw={500}>Keyword: {apiResponse.keyword}</Text>
            <Text>Instance: {apiResponse.instance}</Text>
            <Text>Posts Found: {apiResponse.count}</Text>
            <Badge color={getSentimentColor(apiResponse.sentiment)}>
              Overall Sentiment: {apiResponse.sentiment}
            </Badge>
          </Group>

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
                      {item.sentiment || "Error"}
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
