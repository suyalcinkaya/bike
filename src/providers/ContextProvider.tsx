import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react'
import { useRouter } from 'next/router'

interface IContext {
  searchText: string
  setSearchText: Dispatch<SetStateAction<string>>
  currentPage: number
  setCurrentPage: Dispatch<SetStateAction<number>>
  shouldFetchBikesData: boolean
  setShouldFetchBikesData: Dispatch<SetStateAction<boolean>>
  shouldFetchCountData: boolean
  setShouldFetchCountData: Dispatch<SetStateAction<boolean>>
}

interface IContextProvider {
  children: ReactNode
  initialPage: number
  initialLocation: string
}

const Context = createContext<IContext | null>(null)

export function ContextProvider({
  children,
  initialPage,
  initialLocation
}: IContextProvider) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<number>(initialPage)
  const [searchText, setSearchText] = useState<string>(initialLocation)
  const [shouldFetchBikesData, setShouldFetchBikesData] =
    useState<boolean>(false)
  const [shouldFetchCountData, setShouldFetchCountData] =
    useState<boolean>(false)

  useEffect(() => {
    if (searchText && currentPage) {
      router.push(
        {
          pathname: '/',
          query: {
            location: searchText,
            page: currentPage
          }
        },
        undefined,
        { shallow: true }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, currentPage])

  return (
    <Context.Provider
      value={{
        searchText,
        setSearchText,
        currentPage,
        setCurrentPage,
        shouldFetchBikesData,
        setShouldFetchBikesData,
        shouldFetchCountData,
        setShouldFetchCountData
      }}
    >
      {children}
    </Context.Provider>
  )
}

export function useContextProvider() {
  return useContext(Context) as IContext
}
