import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Alert,
  Checkbox,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useContext, useState, useEffect } from "react"; // Added useEffect
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";

const API_URL = import.meta.env.VITE_API_URL;

interface FormValues {
  email: string;
  password: string;
}

const SignIn = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProviderWrapper");
  }

  const { storeToken, authenticateUser, isLoggedIn } = authContext;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const form = useForm<FormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const response = await axios.post(`${API_URL}/api/auth/login`, values);
      storeToken(response.data.authToken);
      await authenticateUser();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || "Invalid credentials");
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40} mt={120}>
      <Title ta="center" mb="md">
        Welcome Back
      </Title>

      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Don't have an account?{" "}
        <Anchor component={Link} to="/signup" size="sm">
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            {...form.getInputProps("email")}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            required
            {...form.getInputProps("password")}
          />

          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" color="#3d8d7a" />
            <Anchor component={Link} to="/forgot-password" size="sm">
              Forgot password?
            </Anchor>
          </Group>

          {errorMessage && (
            <Alert color="red" mt="md" title="Error" variant="light">
              {errorMessage}
            </Alert>
          )}

          <Button type="submit" fullWidth mt="xl" loading={loading}>
            Sign In
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default SignIn;
