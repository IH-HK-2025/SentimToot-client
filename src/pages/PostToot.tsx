import { useState } from "react";
import {
  Textarea,
  Button,
  Container,
  Title,
  Text,
  Select,
  LoadingOverlay,
  Notification,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";

const PostToot = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      content: "",
      visibility: "public",
    },
    validate: {
      content: (value) => {
        if (!value) return "Content is required";
        if (value.length > 500) return "Maximum 500 characters allowed";
        return null;
      },
    },
  });

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication required");

      const response = await axios.post(`${API_URL}/api/toot`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);

      form.reset();
      setSuccess("Toot posted successfully!");
      setTimeout(() => setSuccess(null), 5000);
    } catch (e) {
      setError("Failed to post toot");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Title order={1} mb="md">
        Post a Toot
      </Title>
      <Text c="dimmed" mb="xl">
        Share your thoughts directly on mastodon.social!
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <LoadingOverlay visible={loading} />

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

        <Textarea
          label="What's happening?"
          placeholder="Compose your toot..."
          autosize
          minRows={4}
          maxRows={8}
          mb="md"
          {...form.getInputProps("content")}
        />

        <Group justify="space-between" align="flex-end">
          <Select
            label="Visibility"
            data={[
              { value: "public", label: "Public 🌍" },
              { value: "unlisted", label: "Unlisted 🔓" },
              { value: "private", label: "Followers Only 🔒" },
            ]}
            defaultValue="public"
            style={{ width: 200 }}
            {...form.getInputProps("visibility")}
          />

          <Button
            type="submit"
            disabled={!form.isValid()}
            style={{ alignSelf: "flex-end" }}
          >
            Post Toot
          </Button>
        </Group>

        <Text size="sm" c="dimmed" ta="right" mt="xs">
          {form.values.content.length}/500 characters
        </Text>
      </form>
    </Container>
  );
};

export default PostToot;
