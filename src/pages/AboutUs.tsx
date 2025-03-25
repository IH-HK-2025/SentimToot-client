import {
  Container,
  Title,
  Image,
  Text,
  Grid,
  Card,
  Anchor,
  Center,
  Group,
  useMantineTheme,
} from "@mantine/core";

import logo from "../assets/Trenditor.png";
import HamidImage from "../assets/profile/hamid.jpg";
import KamranImage from "../assets/profile/kamran.png";

function About() {
  const theme = useMantineTheme();
  const devMembers = [
    {
      name: "Hafiz Muhammad Hamid",
      image: HamidImage,
      github: "https://github.com/hamid89",
      linkedin: "https://www.linkedin.com/in/hafiz-muhammad-hamid-378b17172",
    },
    {
      name: "Kamran Ali",
      image: KamranImage,
      github: "https://github.com/Kamran-frontend",
      linkedin: "https://www.linkedin.com/in/kamranalifrmrbw/",
    },
  ];

  return (
    <Container size="md" py="xl" style={{ marginTop: "4rem" }}>
      <Center>
        <Image src={logo} style={{ width: "500px" }} alt="Trenditor Logo" />
      </Center>

      <Text ta="center" mt="xl" mb="xl" maw={600} mx="auto">
        This project was developed by{" "}
        <Text span fw={600} c={theme.primaryColor}>
          {devMembers[0].name}
        </Text>{" "}
        and{" "}
        <Text span fw={600} c={theme.primaryColor}>
          {devMembers[1].name}
        </Text>{" "}
        as part of their learning journey at Ironhack.
      </Text>

      <Title order={2} ta="center" mb="xl" mt={40}>
        Meet the Development Team
      </Title>

      <Grid gutter="xl" justify="center">
        {devMembers.map((member, index) => (
          <Grid.Col key={index} span={{ base: 12, md: 6 }} mb="xl">
            <Card
              shadow="md"
              padding="xl"
              radius="lg"
              withBorder
              style={{
                transition: "transform 0.2s",
                ":hover": { transform: "translateY(-5px)" },
              }}
            >
              <Center>
                <Image
                  src={member.image}
                  alt={`${member.name} profile`}
                  width={140}
                  height={140}
                  radius="50%"
                  style={{ border: `3px solid ${theme.colors.blue[6]}` }}
                />
              </Center>
              <Text ta="center" fz="xl" fw={600} mt="md">
                {member.name}
              </Text>

              <Group justify="center" mt="md" gap="xs">
                <Anchor
                  href={member.github}
                  target="_blank"
                  c="dimmed"
                  underline="never"
                  style={{ ":hover": { color: theme.colors.blue[6] } }}
                >
                  <Group gap={4}>GitHub</Group>
                </Anchor>
                <Text c="dimmed">|</Text>
                <Anchor
                  href={member.linkedin}
                  target="_blank"
                  c="dimmed"
                  underline="never"
                  style={{ ":hover": { color: theme.colors.blue[6] } }}
                >
                  <Group gap={4}>LinkedIn</Group>
                </Anchor>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}

export default About;
