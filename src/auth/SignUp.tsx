import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

interface FormValues {
  name: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/api/auth/signup`, values);
      navigate("/profile");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || "An error occurred");
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
        Create Account
      </Title>

      <Paper withBorder shadow="md" p={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Name"
            placeholder="Your Full Name"
            mt="md"
            required
            {...form.getInputProps("name")}
          />
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

          {errorMessage && (
            <Alert color="red" mt="md" title="Error" variant="light">
              {errorMessage}
            </Alert>
          )}

          <Button type="submit" fullWidth mt="xl" loading={loading}>
            Create Account
          </Button>
        </form>

        <Text ta="center" mt="md">
          Already have an account?{" "}
          <Anchor component={Link} to="/signin">
            Sign In
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
};

export default SignUp;
