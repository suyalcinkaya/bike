import { Suspense } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
const DynamicImage = dynamic(() => import('next/image'), {
  suspense: true
})

// --- Components
import Status from 'components/Status/Status'
import Spec from 'components/Spec/Spec'

// --- Types
import type { NextPage, GetServerSideProps } from 'next'
import type { TStatus } from 'components/Status/Status.types'

interface IBikeDetailsProps {
  bike: {
    description?: string
    frame_colors: string[]
    frame_model: string
    id: number
    large_img?: string
    location_found?: string
    manufacturer_name: string
    serial: string
    status: TStatus
    stolen_location: string
    title: string
    year?: number
    frame_material_slug?: string
  }
}

const BikeDetails: NextPage<IBikeDetailsProps> = ({ bike }) => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{`Bike Details - ${bike.id}`}</title>
      </Head>
      <div className="flex flex-col items-start gap-8">
        <button className="btn" onClick={() => router.back()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
            />
          </svg>
          <span>Back</span>
        </button>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <h1>{bike.title}</h1>
          <Status status={bike.status} />
        </div>
        {bike.large_img && (
          <div className="flex border rounded-lg w-full h-full aspect-[4/3]">
            <Suspense
              fallback={<div className="animate-pulse bg-gray-100 w-full" />}
            >
              <DynamicImage
                src={bike.large_img}
                alt={bike.title}
                width={1200}
                height={900}
                quality={50}
                priority
              />
            </Suspense>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 w-full">
          <Spec title="Manifacturer" value={bike.manufacturer_name} />
          <Spec title="Model" value={bike.frame_model} />
          <Spec title="Year" value={bike.year} />
          <Spec title="Serial" value={bike.serial} />
          <Spec title="Material" value={bike.frame_material_slug} />
          <Spec title="Colors" value={bike.frame_colors.join(', ')} />
          <Spec
            title="Description"
            value={bike.description}
            className="md:col-span-2"
          />
          <Spec title="Stolen at" value={bike.stolen_location} />
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context?.params?.id
  const res = await fetch(`${process.env.BIKES_API}/${id}`)
  const data = await res.json()

  if (!res.ok) {
    return {
      props: {
        error: {
          statusCode: res.status,
          message: data.error
        }
      }
    }
  }

  const { bike } = data
  return {
    props: {
      bike
    }
  }
}

export default BikeDetails
