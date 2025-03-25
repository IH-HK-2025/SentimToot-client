import { ReactNode } from "react";
import {
  AppShell,
  Burger,
  Anchor,
  Stack,
  Group,
  Text,
  Image,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "react-router-dom";
import AuthDetails from "../auth/AuthDetails";
import logo from "../assets/Trenditor.png";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group
          h="100%"
          px="md"
          justify="space-between"
          style={{ width: "100%" }}
        >
          <Group>
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
            <Burger
              opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom="sm"
              size="sm"
            />
          </Group>
          <Anchor component={Link} to="/" underline="never">
            <Image src={logo} style={{ width: "150px" }} alt="Trenditor Logo" />
          </Anchor>

          <AuthDetails />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="sm" p="sm">
          {/* Home Link */}
          <Anchor component={Link} to="/" underline="never">
            <Group gap="xs">
              <Text>🏠 Home</Text>
            </Group>
          </Anchor>

          {/* Trends Link */}
          <Anchor component={Link} to="/trends" underline="never">
            <Group gap="xs">
              <Text>📈 Trends</Text>
            </Group>
          </Anchor>

          {/* Post Toot Link */}
          <Anchor component={Link} to="/post-toot" underline="never">
            <Group gap="xs">
              <Text>🆕 Post a Toot</Text>
            </Group>
          </Anchor>

          {/* About Us Link */}
          <Anchor component={Link} to="/about" underline="never">
            <Group gap="xs">
              <Text>ℹ️ About Us</Text>
            </Group>
          </Anchor>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>

      <AppShell.Footer p="md">
        <Text size="sm" c="dimmed" ta="center">
          © 2025 Trenditor. All rights reserved.
        </Text>
      </AppShell.Footer>
    </AppShell>
  );
}
