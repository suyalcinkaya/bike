import { SWRConfig } from 'swr'
import dynamic from 'next/dynamic'
const DynamicErrorPage = dynamic(() => import('next/error'))

// --- Layouts
import PageLayout from 'layouts/PageLayout'

// --- Types
import type { AppProps } from 'next/app'

// --- Others
import { fetcher } from 'utils/utils'
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
    <SWRConfig
      value={{
        fetcher,
        onError: (error) => <DynamicErrorPage statusCode={error.status} />,
        revalidateOnFocus: false
      }}
    >
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
    </SWRConfig>
  )
}

export default MyApp
