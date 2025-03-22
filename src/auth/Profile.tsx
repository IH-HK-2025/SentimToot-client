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
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProviderWrapper");
  }
  
  const { isLoggedIn, isLoading, user, authError, logOutUser } = authContext;
  const navigate = useNavigate();

  if (!isLoggedIn) {
    navigate("/signin");
    return null;
  }

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

        <Group mb="sm">
          <Text fw={500}>Name:</Text>
          <Text>{user?.name}</Text>
        </Group>

        <Group mb="sm">
          <Text fw={500}>Email:</Text>
          <Text>{user?.email}</Text>
        </Group>

        <Group mt="xl">
          <Button variant="outline" color="red" onClick={() => logOutUser()}>
            Logout
          </Button>
        </Group>
      </Card>
    </Container>
  );
};

export default Profile;
