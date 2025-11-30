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
        <title>Desktop app</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
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
