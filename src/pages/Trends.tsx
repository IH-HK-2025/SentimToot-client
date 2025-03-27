import {
  Card,
  Container,
  Text,
  Group,
  Badge,
  Stack,
  Title,
  Button,
  Loader,
  Alert,
  NumberInput,
  Box,
} from "@mantine/core";
import { PieChart } from "@mantine/charts";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useState } from "react";

interface TrendPost {
  id: string;
  content: string;
  author: string;
  sentiment: string;
  created_at: Date;
}

interface TrendAnalysis {
  name: string;
  overallSentiment: string;
  posts: TrendPost[];
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

interface MastodonResponse {
  data: {
    trends: TrendAnalysis[];
    meta: {
      totalTrends: number;
      totalPosts: number;
      requestedTrends: number;
      requestedPostsPerTrend: number;
    };
  };
}

export function Trends() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MastodonResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      numTrends: 1,
      numPosts: 1,
    },
    validate: {
      numTrends: (value) => (value < 1 ? "Minimum 1 trends required" : null),
      numPosts: (value) =>
        value < 1 ? "Minimum 1 posts per trend required" : null,
    },
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "green";
      case "negative":
        return "red";
      default:
        return "yellow";
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setError(null);
    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication required");

      const response = await axios.post<MastodonResponse>(
        `${API_URL}/api/trends`,
        {
          numTrends: values.numTrends,
          numPosts: values.numPosts,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setResults(response.data);
    } catch (err) {
      console.log(err);
      setError("Failed to analyze trends");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Group justify="space-between" mb="md">
        <Title order={2}>Analyze Mastodon trends</Title>
      </Group>
  
      <Card withBorder shadow="sm" mb="xl">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Group align="flex-end" grow>
            <NumberInput
              label="Number of Trends"
              min={1}
              {...form.getInputProps("numTrends")}
            />
            <NumberInput
              label="Posts per Trend"
              min={1}
              {...form.getInputProps("numPosts")}
            />
            <Button type="submit" loading={loading}>
              Analyze Trends
            </Button>
          </Group>
        </form>
      </Card>
  
      {error && (
        <Alert color="red" title="Error" mb="xl">
          {error}
        </Alert>
      )}
  
      {results?.data?.trends?.length === 0 ? (
        <Text>No trends analyzed yet</Text>
      ) : (
        <Stack mb="xl">
          {results?.data?.trends?.map((trend) => (
            <Card
              key={trend.name}
              shadow="sm"
              p="lg"
              radius="md"
              withBorder
              mb="md"
            >
              <Group mb="sm" gap="xl">
                <Text fw={500}>Trend: #{trend.name}</Text>
                <Text>Posts Analyzed: {trend.posts.length}</Text>
                <Badge
                  color={getSentimentColor(trend.overallSentiment)}
                  size="lg"
                >
                  Overall Sentiment: {trend.overallSentiment}
                </Badge>
              </Group>
  
              {/* Show pie chart if numPosts > 1, regardless of numTrends */}
              {form.values.numPosts > 1 && (
                <Card withBorder shadow="sm" radius="md" mb="xl" p="lg">
                  <Text fw={500} mb="md" size="lg">
                    Sentiment Distribution
                  </Text>
                  <Box h={400}>
                    <PieChart
                      data={[
                        {
                          name: "Positive",
                          value: trend.sentimentDistribution.positive,
                          color: "green",
                        },
                        {
                          name: "Neutral",
                          value: trend.sentimentDistribution.neutral,
                          color: "yellow",
                        },
                        {
                          name: "Negative",
                          value: trend.sentimentDistribution.negative,
                          color: "red",
                        },
                      ]}
                      withLabels
                      labelsType="percent"
                      size={300}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                      strokeWidth={1}
                      mx="auto"
                    />
                  </Box>
                </Card>
              )}
  
              <Stack>
                {trend.posts.map((post) => (
                  <Card key={post.id} p="md" withBorder>
                    <Group justify="space-between" mb="xs">
                      <Text fw={500}>@{post.author}</Text>
                      <Group>
                        <Badge color={getSentimentColor(post.sentiment)}>
                          {post.sentiment}
                        </Badge>
                        <Text size="sm" c="dimmed">
                          {new Date(post.created_at).toLocaleString()}
                        </Text>
                      </Group>
                    </Group>
                    <Text
                      style={{ whiteSpace: "pre-wrap" }}
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  </Card>
                ))}
              </Stack>
            </Card>
          ))}
        </Stack>
      )}
  
      {loading && (
        <Group justify="center" mt="xl">
          <Loader size="xl" variant="bars" />
          <Text size="lg">Analyzing trends...</Text>
        </Group>
      )}
    </Container>
  );
}
