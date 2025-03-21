import { Title, Text } from '@mantine/core';

export function HomePage() {
  return (
    <div>
      <Title order={1} mb="md">Welcome to Trenditor</Title>
      <Text size="lg">
        Analyze Reddit trends with AI-powered sentiment analysis.
      </Text>
    </div>
  );
}