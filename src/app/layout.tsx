import { SpeedInsights } from '@vercel/speed-insights/next'

import { TRPCReactProvider } from '~/trpc/react'

import '~/styles/animation.css'
import '~/styles/aspects.css'
import '~/styles/border.css'
import '~/styles/brand.css'
import '~/styles/button.css'
import '~/styles/colors.css'
import '~/styles/durations.css'
import '~/styles/easing.css'
import '~/styles/global-styles.css'
import '~/styles/gradients.css'
import '~/styles/normalize.css'
import '~/styles/quick-upgrades.css'
import '../styles/reset.css'
import '~/styles/shadows.css'
import '~/styles/sizes.css'
import '~/styles/zindex.css'

import NextLink from 'next/link'

import styles from './layout.module.css'

import {
  Content,
  Item,
  List,
  Link as NavLink,
  Root,
  Sub,
  Trigger,
} from '@radix-ui/react-navigation-menu'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const thisYear = new Date().getFullYear()
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <TRPCReactProvider>
          <header>
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
                          <Link href={'/graphs/ascents/pyramid'}>
                            🧗 Pyramid
                          </Link>
                        </Item>
                        <Item value="qr-code">
                          <Link href={'/qr-code/ascents'}>🧗 QR</Link>
                        </Item>
                        <Item value="barcode">
                          <Link href={`/barcode/ascents/${thisYear}`}>
                            🧗 Barcode
                          </Link>
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
                          <Link href={`/barcode/training/${thisYear}`}>
                            💪 Barcode
                          </Link>
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
          </header>
          {children}
        </TRPCReactProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}

export const metadata = {
  title: 'Unified Climbing Projects',
  description: 'Collection of Climbing Visualization pages',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}
