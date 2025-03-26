import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import { Card, Container, Text, Stack, Title, Space, Anchor, Group } from "@mantine/core";

interface Toot {
  id: string;
  content: string;
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export function PostedToots() {
  const [toots, setToots] = useState<Toot[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const authContext = useContext(AuthContext);
  
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProviderWrapper");
  }

  const { user } = authContext;

  const fetchToots = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/auth/users/toots/${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToots(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching toots:", error);
      setToots([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteToots = async () => {
    try {
      setDeleting(true);
      const token = localStorage.getItem("authToken");
      await axios.delete(`${API_URL}/api/auth/users/toots/${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToots([]);
    } catch (error) {
      console.error("Error deleting toots:", error);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchToots();
    }
  }, [user?.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  if (loading) return <Container>Loading your toots...</Container>;

  return (
    <Container>
      <Group justify="space-between" mb="md">
        <Title order={2}>Your Posted Toots</Title>
        {toots.length > 0 && (
          <Anchor 
            component="button" 
            type="button"
            onClick={deleteToots}
            underline="always"
            c="red"
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete All Toots"}
          </Anchor>
        )}
      </Group>
      
      {toots.length === 0 ? (
        <Text>No toots found</Text>
      ) : (
        <Stack gap="md">
          {toots.map((toot) => (
            <Card key={toot.id} shadow="sm" p="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed">
                  {formatDate(toot.createdAt)}
                </Text>
              </Group>
              <Text style={{ whiteSpace: "pre-wrap" }}>
                {toot.content.replace(/<[^>]*>/g, '')}
              </Text>
            </Card>
          ))}
        </Stack>
      )}
      <Space h="xl" />
    </Container>
  );
}