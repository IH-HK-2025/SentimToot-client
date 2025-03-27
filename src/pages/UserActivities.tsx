import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import {
  Card,
  Container,
  Text,
  Group,
  Badge,
  Stack,
  Title,
  Space,
  Anchor,
} from "@mantine/core";
import { PieChart } from "@mantine/charts";

interface HistoryItem {
  keyword: string;
  instance: string;
  count: number;
  sentiment: string;
  data: {
    id: string;
    content: string;
    author: string;
    sentiment: string;
    created_at: string;
  }[];
}

const API_URL = import.meta.env.VITE_API_URL;

export function UserHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProviderWrapper");
  }

  const { user } = authContext;

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/auth/users/history/${user?.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHistory(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching history:", error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      setClearing(true);
      const token = localStorage.getItem("authToken");
      await axios.delete(`${API_URL}/api/auth/users/history/${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory([]);
    } catch (error) {
      console.error("Error clearing history:", error);
    } finally {
      setClearing(false);
    }
  };

  // Function to calculate sentiment data for pie chart
  const getSentimentData = (data: HistoryItem["data"]) => {
    const sentimentCounts = data.reduce((acc, item) => {
      const sentiment = item.sentiment?.toLowerCase() || "neutral";
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sentimentCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color:
        name === "positive" ? "green" : name === "negative" ? "red" : "yellow",
    }));
  };

  useEffect(() => {
    if (user?.id) {
      fetchHistory();
    }
  }, [user?.id]);

  if (loading) return <Container>Loading history...</Container>;

  const displayHistory = Array.isArray(history) ? history : [];

  return (
    <Container>
      <Group justify="space-between" mb="md">
        <Title order={2}>Mastodon tags searched by you</Title>
        {displayHistory.length > 0 && (
          <Anchor
            component="button"
            type="button"
            onClick={clearHistory}
            underline="always"
            c="red"
            disabled={clearing}
          >
            {clearing ? "Clearing..." : "Clear History"}
          </Anchor>
        )}
      </Group>

      {displayHistory.length === 0 ? (
        <Text>No history found</Text>
      ) : (
        <Stack>
          {/* Reverse the mapping to show newest first */}
          {[...displayHistory].reverse().map((item, index) => {
            const sentimentData = getSentimentData(item.data);

            return (
              <Card
                key={displayHistory.length - 1 - index}
                shadow="sm"
                p="lg"
                radius="md"
                withBorder
                mb="md"
              >
                <Group mb="sm">
                  <Text fw={500}>Searched Tag: {item.keyword}</Text>
                  <Text>Instance: {item.instance}</Text>
                  <Text>Posts Found: {item.count}</Text>
                  <Badge
                    color={
                      item.sentiment === "Positive"
                        ? "green"
                        : item.sentiment === "Negative"
                        ? "red"
                        : "yellow"
                    }
                  >
                    {`Overall Sentiment: ${item.sentiment}`}
                  </Badge>
                </Group>

                {/* Added Pie Chart for each history item */}
                {sentimentData.length > 0 ? (
                  <Card withBorder shadow="sm" radius="md" mb="xl" p="lg">
                    <Text fw={500} mb="md" size="lg">
                      Sentiment Distribution
                    </Text>
                    <div
                      style={{
                        width: "100%",
                        height: "400px",
                        minHeight: "300px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          minWidth: "300px",
                          minHeight: "300px",
                        }}
                      >
                        <PieChart
                          data={sentimentData}
                          withLabels
                          labelsType="percent"
                          size={300}
                          strokeWidth={1}
                          styles={{
                            root: {
                              width: "100%",
                              height: "100%",
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
                  {item.data.map((toot) => (
                    <Card key={toot.id} p="md" withBorder>
                      <Group justify="space-between" mb="xs">
                        <Text fw={500}>@{toot.author}</Text>
                        <Group>
                          <Badge
                            color={
                              toot.sentiment === "Positive"
                                ? "green"
                                : toot.sentiment === "Negative"
                                ? "red"
                                : "yellow"
                            }
                          >
                            {toot.sentiment}
                          </Badge>
                          <Text size="sm" c="dimmed">
                            {new Date(toot.created_at).toLocaleString()}
                          </Text>
                        </Group>
                      </Group>
                      <Text
                        style={{ whiteSpace: "pre-wrap" }}
                        dangerouslySetInnerHTML={{ __html: toot.content }}
                      />
                    </Card>
                  ))}
                </Stack>
              </Card>
            );
          })}
        </Stack>
      )}
      <Space h="xl" />
    </Container>
  );
}
