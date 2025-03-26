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
      const response = await axios.get(`${API_URL}/api/auth/users/history/${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Ensure we always set an array, even if response.data is null/undefined
      setHistory(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching history:", error);
      setHistory([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      setClearing(true);
      const token = localStorage.getItem("authToken");
      await axios.delete(`${API_URL}/api/auth/users/history/${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory([]);
    } catch (error) {
      console.error("Error clearing history:", error);
    } finally {
      setClearing(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchHistory();
    }
  }, [user?.id]);

  if (loading) return <Container>Loading history...</Container>;

  // Safe check - ensure history is always an array before mapping
  const displayHistory = Array.isArray(history) ? history : [];

  return (
    <Container>
      <Group justify="space-between" mb="md">
        <Title order={2}>Your Search History</Title>
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
          {displayHistory.map((item, index) => (
            <Card key={index} shadow="sm" p="lg" radius="md" withBorder mb="md">
              <Group mb="sm">
                <Text fw={500}>Keyword: {item.keyword}</Text>
                <Text>Instance: {item.instance}</Text>
                <Text>Results: {item.count}</Text>
                <Badge color={
                  item.sentiment === "Positive" ? "green" :
                  item.sentiment === "Negative" ? "red" : "gray"
                }>
                  {item.sentiment}
                </Badge>
              </Group>

              <Stack>
                {item.data.map((toot) => (
                  <Card key={toot.id} p="md" withBorder>
                    <Group justify="space-between" mb="xs">
                      <Text fw={500}>@{toot.author}</Text>
                      <Group>
                        <Badge color={
                          toot.sentiment === "Positive" ? "green" :
                          toot.sentiment === "Negative" ? "red" : "gray"
                        }>
                          {toot.sentiment}
                        </Badge>
                        <Text size="sm" c="dimmed">
                          {new Date(toot.created_at).toLocaleString()}
                        </Text>
                      </Group>
                    </Group>
                    <Text>{toot.content.replace(/<[^>]*>/g, '')}</Text>
                  </Card>
                ))}
              </Stack>
            </Card>
          ))}
        </Stack>
      )}
      <Space h="xl" />
    </Container>
  );
}