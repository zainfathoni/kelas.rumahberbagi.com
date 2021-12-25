import * as React from 'react'
// import Image from "next/image";

type BenefitDescriptionProps = {
  children: React.ReactNode
}

type CommonProps = {
  title: string
  children: React.ReactNode
  description: string
  image: React.ReactNode
}

type BenefitContainerImageProps = {
  src: string
  alt: string
  height: number
  width: number
}

type BenefitItemProps = {
  title: string
  children: React.ReactNode
  icon: React.ReactNode
}

type BenefitSectionProps = {
  title: string
  children: React.ReactNode
  top: React.ReactNode
  bottom: React.ReactNode
}

export const BenefitDescription: React.FC<BenefitDescriptionProps> = ({
  children,
}) => <p className="mt-4 max-w-3xl text-xl text-gray-500">{children}</p>

export const BenefitTopContainer: React.FC<CommonProps> = ({
  children,
  title,
  description,
  image,
}) => (
  <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
    <div className="relative">
      <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
        {title}
      </h3>
      <p className="mt-3 text-lg text-gray-500">{description}</p>

      <dl className="mt-10 space-y-10">{children}</dl>
    </div>

    <div className="mt-10 -mx-4 relative lg:mt-0" aria-hidden="true">
      <svg
        className="absolute left-1/2 transform -translate-x-1/2 translate-y-16 lg:hidden"
        width="784"
        height="404"
        fill="none"
        viewBox="0 0 784 404"
      >
        <defs>
          <pattern
            id="ca9667ae-9f92-4be7-abcb-9e3d727f2941"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <rect
              x="0"
              y="0"
              width="4"
              height="4"
              className="text-gray-200"
              fill="currentColor"
            />
          </pattern>
        </defs>
        <rect
          width="784"
          height="404"
          fill="url(#ca9667ae-9f92-4be7-abcb-9e3d727f2941)"
        />
      </svg>
      {image}
    </div>
  </div>
)

export const BenefitBottomContainer: React.FC<CommonProps> = ({
  children,
  title,
  description,
  image,
}) => (
  <div className="relative mt-12 sm:mt-16 lg:mt-24">
    <div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-8 lg:items-center">
      <div className="lg:col-start-2">
        <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
          {title}
        </h3>
        <p className="mt-3 text-lg text-gray-500">{description}</p>

        <dl className="mt-10 space-y-10">{children}</dl>
      </div>

      <div className="mt-10 -mx-4 relative lg:mt-0 lg:col-start-1">
        <svg
          className="absolute left-1/2 transform -translate-x-1/2 translate-y-16 lg:hidden"
          width="784"
          height="404"
          fill="none"
          viewBox="0 0 784 404"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="e80155a9-dfde-425a-b5ea-1f6fadd20131"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect
                x="0"
                y="0"
                width="4"
                height="4"
                className="text-gray-200"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect
            width="784"
            height="404"
            fill="url(#e80155a9-dfde-425a-b5ea-1f6fadd20131)"
          />
        </svg>
        {image}
      </div>
    </div>
  </div>
)

export const BenefitContainerImage: React.FC<BenefitContainerImageProps> = ({
  src,
  alt,
  height,
  width,
}) => (
  <img
    className="relative mx-auto rounded-xl"
    src={src}
    alt={alt}
    height={height}
    width={width}
  ></img>
)

export const BenefitItem: React.FC<BenefitItemProps> = ({
  icon,
  title,
  children,
}) => (
  <div className="relative">
    <dt>
      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
        {icon}
      </div>
      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
        {title}
      </p>
    </dt>
    <dd className="mt-2 ml-16 text-base text-gray-500">{children}</dd>
  </div>
)

export const BenefitSection: React.FC<BenefitSectionProps> = ({
  children,
  title,
  top,
  bottom,
}) => {
  return (
    <div className="py-16 bg-gray-50 overflow-hidden lg:py-24" id="benefit">
      <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
        <svg
          className="hidden lg:block absolute left-full transform -translate-x-1/2 -translate-y-1/4"
          width="404"
          height="784"
          fill="none"
          viewBox="0 0 404 784"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="b1e6e422-73f8-40a6-b5d9-c8586e37e0e7"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect
                x="0"
                y="0"
                width="4"
                height="4"
                className="text-gray-200"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect
            width="404"
            height="784"
            fill="url(#b1e6e422-73f8-40a6-b5d9-c8586e37e0e7)"
          />
        </svg>

        <div className="relative">
          <h2 className="text-3xl max-w-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {title}
          </h2>
          {children}
        </div>

        {top}
        <svg
          className="hidden lg:block absolute right-full transform translate-x-1/2 translate-y-12"
          width="404"
          height="784"
          fill="none"
          viewBox="0 0 404 784"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="64e643ad-2176-4f86-b3d7-f2c5da3b6a6d"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect
                x="0"
                y="0"
                width="4"
                height="4"
                className="text-gray-200"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect
            width="404"
            height="784"
            fill="url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)"
          />
        </svg>

        {bottom}
      </div>
    </div>
  )
}
