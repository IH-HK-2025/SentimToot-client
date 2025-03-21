import { ReactNode } from "react";
import { AppShell, Burger, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "react-router-dom";

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
        <Group h="100%" px="md">
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
          <Text size="xl" fw={700}>
            Trenditor
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Text p="sm" size="lg" fw={500}>
          Menu
        </Text>
        <Link to="/signin">Log In</Link>
        <Link to="/signup">Register</Link>
        <Link to="/profile">Profile</Link>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>

      {/* Footer */}
      <AppShell.Footer p="md">
        <Text size="sm" c="dimmed" ta="center">
          © 2025 Trenditor. All rights reserved.
        </Text>
      </AppShell.Footer>
    </AppShell>
  );
}
