import dynamic from 'next/dynamic'
const DynamicErrorPage = dynamic(() => import('next/error'))

// --- Layouts
import PageLayout from 'layouts/PageLayout'

// --- Types
import type { AppProps } from 'next/app'

// --- Styles
import 'styles/global.css'

interface CustomPageProps {
  error: { statusCode: number; message?: string } | null | undefined
  statusCode?: number
}

function MyApp({ Component, pageProps }: AppProps<CustomPageProps>) {
  const { error, statusCode } = pageProps
  if (error) {
    return (
      <DynamicErrorPage statusCode={error.statusCode} title={error.message} />
    )
  }

  if (statusCode) {
    return <DynamicErrorPage statusCode={statusCode} />
  }

  return (
    <PageLayout>
      <Component {...pageProps} />
    </PageLayout>
  )
}

export default MyApp
