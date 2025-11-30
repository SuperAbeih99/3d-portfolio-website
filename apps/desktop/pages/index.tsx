import Head from 'next/head'
import Script from 'next/script'
import styles from '@/styles/Home.module.css'
import { Analytics } from '@vercel/analytics/react';
import { OperatingSystem } from '@/components/OperatingSystem'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export async function getStaticProps({ locale = 'en' }: { locale?: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  }
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Abeih Hamani – Desktop Portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0" />
        <meta
          name="description"
          content="Desktop OS inspired version of Abeih Hamani’s portfolio — explore projects, experiences, and contact info inside a playful interface."
        />
        <meta property="og:title" content="Abeih Hamani – Desktop Portfolio" />
        <meta
          property="og:description"
          content="An interactive desktop environment showcasing Abeih Hamani’s projects, experiences, and contact details."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://abeihhamani.vercel.app/assets/thumbnail.png" />
        <meta property="og:url" content="https://abeihhamani.vercel.app/desktop" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Abeih Hamani – Desktop Portfolio" />
        <meta
          property="twitter:description"
          content="An interactive desktop environment showcasing Abeih Hamani’s projects, experiences, and contact details."
        />
        <meta property="twitter:image" content="https://abeihhamani.vercel.app/assets/thumbnail.png" />
        <link rel="icon" type="image/svg+xml" href="/icons/ah-portfolio-icon.svg" />
      </Head>
      <main className={styles.main}>
        <Script strategy="beforeInteractive" src="/emulators/emulators.js"/>
        <Script strategy="beforeInteractive" src="/emulators-ui/emulators-ui.js"/>
        
        <OperatingSystem/>

        <Analytics/>
      </main>
    </>
  )
}
