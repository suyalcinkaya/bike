// --- Layouts
import PageLayout from 'layouts/PageLayout'

// --- Types
import type { AppProps } from 'next/app'

// --- Styles
import 'styles/global.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PageLayout>
      <Component {...pageProps} />
    </PageLayout>
  )
}

export default MyApp
