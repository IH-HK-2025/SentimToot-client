import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import {
  Card,
  Container,
  Text,
  Stack,
  Title,
  Space,
  Group,
  Badge,
  Button,
  Textarea,
} from "@mantine/core";
import { PieChart } from "@mantine/charts";

interface Toot {
  id: string;
  content: string;
  createdAt: string;
  sentiment: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const stripHtmlTags = (html: string) => {
  return html.replace(/<\/?[^>]+(>|$)/g, "");
};

export function PostedToots() {
  const [toots, setToots] = useState<Toot[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProviderWrapper");
  }

  const { user } = authContext;

  const fetchToots = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/api/auth/users/toots/${user?.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setToots(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching toots:", error);
      setToots([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteToot = async (tootId: string) => {
    try {
      setDeletingId(tootId);
      const token = localStorage.getItem("authToken");
      await axios.delete(`${API_URL}/api/auth/toots/${tootId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToots((prev) => prev.filter((toot) => toot.id !== tootId));
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const editToot = async (tootId: string) => {
    if (!editContent) return;

    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.patch(
        `${API_URL}/api/auth/edit-toots/${tootId}`,
        { status: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setToots((prev) =>
        prev.map((toot) =>
          toot.id === tootId
            ? {
                ...toot,
                content: data.content,
                sentiment: data.sentiment,
              }
            : toot
        )
      );

      setEditingId(null);
    } catch (error) {
      console.error("Edit error:", error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchToots();
    }
  }, [user?.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getSentimentColor = (sentiment: string) => {
    console.log(sentiment);
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "green";
      case "negative":
        return "red";
      default:
        return "yellow";
    }
  };

  // Calculate sentiment distribution for pie chart
  const getSentimentData = () => {
    const sentimentCounts = toots.reduce((acc, toot) => {
      if (!toot.sentiment) return acc;

      const sentiment = toot.sentiment.toLowerCase();
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

  if (loading)
    return <Container>Loading Toots from your Mastodon Account...</Container>;

  return (
    <Container>
      <Group justify="space-between" mb="md">
        <Title order={2}>Sentiment analysis of your Toots</Title>
      </Group>

      {/* Sentiment Distribution Pie Chart */}
      {toots.length > 1 && (
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
      )}

      {toots.length === 0 ? (
        <Text>No toots found</Text>
      ) : (
        <Stack gap="md" mb="xl">
          {toots.map((toot) => (
            <Card key={toot.id} shadow="sm" p="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed">
                  {formatDate(toot.createdAt)}
                </Text>
                <Group gap="sm">
                  <Badge
                    color={getSentimentColor(toot.sentiment)}
                    variant="light"
                  >
                    {toot.sentiment}
                  </Badge>
                  <Button
                    variant="outline"
                    color="blue"
                    size="xs"
                    onClick={() => {
                      setEditingId(toot.id);
                      setEditContent(stripHtmlTags(toot.content)); // Set plain text
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    color="red"
                    size="xs"
                    onClick={() => deleteToot(toot.id)}
                    loading={deletingId === toot.id}
                  >
                    Delete
                  </Button>
                </Group>
              </Group>

              {editingId === toot.id ? (
                <>
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    autosize
                    minRows={3}
                  />
                  <Group mt="sm">
                    <Button
                      color="green"
                      size="xs"
                      onClick={() => editToot(toot.id)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="subtle"
                      size="xs"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </Group>
                </>
              ) : (
                <Text
                  style={{ whiteSpace: "pre-wrap" }}
                  dangerouslySetInnerHTML={{ __html: toot.content }}
                />
              )}
            </Card>
          ))}
        </Stack>
      )}
      <Space h="xl" />
    </Container>
  );
}
