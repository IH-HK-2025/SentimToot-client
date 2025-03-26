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
} from "@mantine/core";

interface Toot {
  id: string;
  content: string;
  createdAt: string;
  sentiment: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export function PostedToots() {
  const [toots, setToots] = useState<Toot[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
      setToots(toots.filter((toot) => toot.id !== tootId));
    } catch (error) {
      console.error("Error deleting toot:", error);
    } finally {
      setDeletingId(null);
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
    switch (sentiment) {
      case "Positive":
        return "green";
      case "Negative":
        return "red";
      default:
        return "yellow";
    }
  };

  if (loading)
    return <Container>Loading Toots from your Mastodon Account...</Container>;

  return (
    <Container>
      <Group justify="space-between" mb="md">
        <Title order={2}>Your Posted Toots</Title>
      </Group>

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
                    color="red"
                    size="xs"
                    onClick={() => deleteToot(toot.id)}
                    loading={deletingId === toot.id}
                  >
                    Delete
                  </Button>
                </Group>
              </Group>

              <Text
                style={{ whiteSpace: "pre-wrap" }}
                dangerouslySetInnerHTML={{ __html: toot.content }}
              />
            </Card>
          ))}
        </Stack>
      )}
      <Space h="xl" />
    </Container>
  );
}
