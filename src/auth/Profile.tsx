import {
  Card,
  Text,
  Title,
  Container,
  Skeleton,
  Group,
  Button,
  PasswordInput,
  Notification,
} from "@mantine/core";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Profile: React.FC = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProviderWrapper");
  }

  const { isLoading, user, logOutUser } = authContext;
  const storeToken = localStorage.getItem("authToken");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mastodonToken, setMastodonToken] = useState<string>("");
  const navigate = useNavigate();

  const handleLogout = () => {
    logOutUser();
    navigate("/signin");
  };

  const saveMastodonToken = async () => {
    if (!mastodonToken) {
      setError("Please provide your Mastodon access token.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/user/token`,
        { mastodonToken },
        { headers: { Authorization: `Bearer ${storeToken}` } }
      );
      console.log(response.data);
      setSuccess("Mastodon token saved successfully!");
      setError(null);
      {
        <Notification color="teal" title="Success!" mb="md">
          {success}
        </Notification>;
      }
    } catch (err) {
      console.error(err);
      {
        <Notification color="red" title="Fail!" mb="md">
          Failed to save Mastodon token. Please try again.
        </Notification>;
      }
      setError("");
    }
  };

  const fetchMastodonToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/token`, {
        headers: { Authorization: `Bearer ${storeToken}` },
      });
      setMastodonToken(response.data.mastodonToken || "");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch Mastodon token. Please try again.");
    }
  };

  useEffect(() => {
    fetchMastodonToken();
  }, []);

  if (isLoading) {
    return (
      <Container size="sm" my={40}>
        <Skeleton height={50} circle mb="xl" />
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
      </Container>
    );
  }

  return (
    <Container size="sm" my={40}>
      <Card withBorder shadow="sm" padding="lg" radius="md">
        <Title order={2} mb="md">
          Profile Details
        </Title>

        {success && (
          <Notification
            color="teal"
            title="Success!"
            mb="md"
            onClose={() => setSuccess(null)}
          >
            {success}
          </Notification>
        )}

        {error && (
          <Notification
            color="red"
            title="Error"
            mb="md"
            onClose={() => setError(null)}
          >
            {error}
          </Notification>
        )}

        <Group mb="sm">
          <Text fw={500}>Name:</Text>
          <Text>{user?.name}</Text>
        </Group>

        <Group mb="sm">
          <Text fw={500}>Email:</Text>
          <Text>{user?.email}</Text>
        </Group>

        <PasswordInput
          label="Mastodon Access Token"
          placeholder="Enter your Mastodon access token"
          value={mastodonToken}
          onChange={(e) => setMastodonToken(e.currentTarget.value)}
          mb="md"
          visibilityToggleButtonProps={{
            "aria-label": "Toggle access token visibility",
          }}
        />

        <Group mt="xl">
          <Button variant="outline" color="blue" onClick={handleLogout}>
            Logout
          </Button>

          <Button variant="outline" color="green" onClick={saveMastodonToken}>
            Save Mastodon Token
          </Button>
        </Group>
      </Card>
    </Container>
  );
};

export default Profile;
