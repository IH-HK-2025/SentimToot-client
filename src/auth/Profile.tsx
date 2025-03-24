import {
  Card,
  Text,
  Title,
  Container,
  Skeleton,
  Alert,
  Group,
  Button,
} from "@mantine/core";
import { useState, useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Profile: React.FC = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProviderWrapper");
  }

  const {  isLoading, user, authError, logOutUser } = authContext;
  const storeToken = localStorage.getItem("authToken");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOutUser()
    navigate("/signin")
  }

  const handleDelete = (id: number | undefined) => {
    if (!id) return;

    setLoading(true);

    axios
      .delete(`${API_URL}/api/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${storeToken}` },
      })
      .then(() => {
        setTimeout(() => {
          logOutUser();
          navigate("/signin");
        }, 500);
      })
      .catch(() => {
        setError("Failed to delete user.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

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

        {authError && (
          <Alert color="red" mb="md" title="Error">
            {authError}
          </Alert>
        )}

        {error && (
          <Alert color="red" mb="md" title="Error">
            {error}
          </Alert>
        )}

        <Group mb="sm">
          <Text fw={500}>Name:</Text>
          <Text>{user?.name}</Text>
        </Group>

        <Group mb="sm">
          <Text fw={500}>Email:</Text>
          <Text>{user?.email}</Text>
        </Group>

        <Group mt="xl">
          <Button variant="outline" color="blue" onClick={() =>handleLogout()}>
            Logout
          </Button>
          <Button variant="outline" color="red" onClick={() => handleDelete(user?.id)} disabled={loading}>
            {loading ? "Deleting..." : "Delete Account"}
          </Button>
        </Group>
      </Card>
    </Container>
  );
};

export default Profile;
