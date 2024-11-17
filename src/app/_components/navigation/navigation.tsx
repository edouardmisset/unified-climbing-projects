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
            <Sub orientation="vertical" defaultValue="pyramid">
              <List className={styles.List}>
                <Item value="pyramid">
                  <Link href={'/graphs/ascents/pyramid'}>🧗 Pyramid</Link>
                </Item>
                <Item value="qr-code">
                  <Link href={'/qr-code/ascents'}>🧗 QR</Link>
                </Item>
                <Item value="barcode">
                  <Link href={`/barcode/ascents/${thisYear}`}>🧗 Barcode</Link>
                </Item>
                <Item value="visualization">
                  <Link href={`/visualization/ascents/${thisYear}`}>
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
                  <Link href={'/qr-code/training'}>💪 QR</Link>
                </Item>
                <Item className={styles.Item} value="barcode">
                  <Link href={`/barcode/training/${thisYear}`}>💪 Barcode</Link>
                </Item>
                <Item className={styles.Item} value="visualization">
                  <Link href={`/visualization/training/${thisYear}`}>
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
