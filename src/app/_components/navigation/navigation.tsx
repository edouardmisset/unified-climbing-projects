import {
  Content,
  Item,
  List,
  Link as NavLink,
  Root,
  Sub,
  Trigger,
} from '@radix-ui/react-navigation-menu'

import NextLink from 'next/link'

import styles from './navigation.module.css'

const Link = ({
  href,
  children,
  ...props
}: { children: React.ReactNode; href: string }) => {
  return (
    <NavLink className={styles.ListItemLink} asChild>
      <NextLink href={href} {...props}>
        {children}
      </NextLink>
    </NavLink>
  )
}

export function Navigation() {
  const thisYear = new Date().getFullYear()

  return (
    <Root className={styles.Root}>
      <List className={styles.List}>
        <Item className={styles.ListItemLink}>
          <Link href="/">Home</Link>
        </Item>
        <Item className={styles.ListItemLink}>
          <Link href={'/log'}>Log</Link>
        </Item>

        {/* ASCENTS */}
        <Item className={styles.Item}>
          <Trigger className={styles.Trigger}>Ascents 🧗</Trigger>
          <Content className={styles.Content}>
            <Sub orientation="vertical" defaultValue="dashboard">
              <List className={styles.List}>
                <Item value="dashboard">
                  <Link href={'/ascents/dashboard'}>🧗 Dashboard</Link>
                </Item>
                <Item value="qr-code">
                  <Link href={'/ascents/qr-code'}>🧗 QR</Link>
                </Item>
                <Item value="barcode">
                  <Link href={'/ascents/barcode'}>🧗 Barcode</Link>
                </Item>
                <Item value="visualization">
                  <Link href={`/ascents/visualization/${thisYear}`}>
                    🧗 Visualization
                  </Link>
                </Item>
              </List>
            </Sub>
          </Content>
        </Item>

        {/* TRAINING */}
        <Item className={styles.Item}>
          <Trigger className={styles.Trigger}>Training 💪</Trigger>
          <Content className={styles.Content}>
            <Sub orientation="vertical" defaultValue="visualization">
              <List className={styles.List}>
                <Item className={styles.Item} value="qr-code">
                  <Link href={'/training/qr-code'}>💪 QR</Link>
                </Item>
                <Item className={styles.Item} value="barcode">
                  <Link href={'/training/barcode'}>💪 Barcode</Link>
                </Item>
                <Item className={styles.Item} value="visualization">
                  <Link href={`/training/visualization/${thisYear}`}>
                    💪 Visualization
                  </Link>
                </Item>
              </List>
            </Sub>
          </Content>
        </Item>
      </List>
    </Root>
  )
}