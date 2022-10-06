// --- Types
import { IPageLayoutProps } from 'layouts/PageLayout.types'

const PageLayout = (props: IPageLayoutProps) => {
  return (
    <main className="flex min-h-screen pb-16 pt-16 overflow-hidden px-safe">
      <div className="px-6 md:px-16 mx-auto w-full max-w-screen-lg">
        <div className="h-full" {...props} />
      </div>
    </main>
  )
}

export default PageLayout
