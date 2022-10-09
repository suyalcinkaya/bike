import { SWRConfig } from 'swr'
import dynamic from 'next/dynamic'
const DynamicErrorPage = dynamic(() => import('next/error'))

// --- Layouts
import PageLayout from 'layouts/PageLayout'

// --- Types
import type { AppProps } from 'next/app'

// --- Others
import { ContextProvider } from 'providers/ContextProvider'
import { fetcher } from 'utils/utils'
import 'styles/global.css'

interface CustomPageProps {
  error: { statusCode: number; message?: string } | null | undefined
  statusCode?: number
  initialLocation: string
  initialPage: number
}

function MyApp({ Component, pageProps }: AppProps<CustomPageProps>) {
  const { error, statusCode, initialLocation, initialPage, ...rest } = pageProps
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
        revalidateOnFocus: false,
        keepPreviousData: true
      }}
    >
      <PageLayout>
        <ContextProvider
          initialLocation={initialLocation}
          initialPage={initialPage}
        >
          <Component {...rest} />
        </ContextProvider>
      </PageLayout>
    </SWRConfig>
  )
}

export default MyApp
