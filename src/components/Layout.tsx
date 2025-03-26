import { ReactNode, useRef, useEffect } from "react";
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
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop, close: closeDesktop }] = useDisclosure(true);
  const navbarRef = useRef<HTMLDivElement>(null);
  const mobileBurgerRef = useRef<HTMLButtonElement>(null);
  const desktopBurgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if clicking on either burger button
      if (
        (mobileBurgerRef.current && mobileBurgerRef.current.contains(event.target as Node)) ||
        (desktopBurgerRef.current && desktopBurgerRef.current.contains(event.target as Node))
      ) {
        return;
      }

      // Close mobile menu if open and clicked outside navbar
      if (mobileOpened && navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        closeMobile();
      }

      // Close desktop menu if open and clicked outside navbar (optional)
      if (desktopOpened && navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        closeDesktop();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileOpened, desktopOpened, closeMobile, closeDesktop]);

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
        <Group h="100%" px="md" justify="space-between" style={{ width: "100%" }}>
          <Group>
            <Burger
              ref={mobileBurgerRef}
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
            <Burger
              ref={desktopBurgerRef}
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

      <AppShell.Navbar p="md" ref={navbarRef}>
        <Stack gap="sm" p="sm">
          <Anchor component={Link} to="/" underline="never">
            <Group gap="xs">
              <Text>🏠 Home</Text>
            </Group>
          </Anchor>
          <Anchor component={Link} to="/trends" underline="never">
            <Group gap="xs">
              <Text>📈 Trends</Text>
            </Group>
          </Anchor>
          <Anchor component={Link} to="/post-toot" underline="never">
            <Group gap="xs">
              <Text>🆕 Post a Toot</Text>
            </Group>
          </Anchor>
          <Anchor component={Link} to="/history" underline="never">
            <Group gap="xs">
              <Text>⏳ Your searched tags</Text>
            </Group>
          </Anchor>
          <Anchor component={Link} to="/postedtoots" underline="never">
            <Group gap="xs">
              <Text>📝 Your posted toots</Text>
            </Group>
          </Anchor>
          <Anchor component={Link} to="/about" underline="never">
            <Group gap="xs">
              <Text>ℹ️ About Us</Text>
            </Group>
          </Anchor>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>

      <AppShell.Footer p="md">
        <Text size="sm" c="dimmed" ta="center">
          © 2025 Trenditor. All rights reserved.
        </Text>
      </AppShell.Footer>
    </AppShell>
  );
}