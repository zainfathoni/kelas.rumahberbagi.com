import * as React from 'react'

type commonProps = {
  children: string
}

export const CtaTitle: React.FC<commonProps> = ({ children }) => (
  <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
    <span className="block">{children}</span>
  </h2>
)

export const CtaDescription: React.FC<commonProps> = ({ children }) => (
  <p className="mt-4 text-lg leading-6 text-indigo-200">{children}</p>
)

export const CtaButton: React.FC<commonProps> = ({ children }) => (
  <a
    href="https://rbagi.id/daftar"
    className="mt-8 bg-white border border-transparent rounded-md shadow px-5 py-3 inline-flex items-center text-base font-medium text-indigo-600 hover:bg-indigo-50"
  >
    {children}
  </a>
)

export const CtaSection: React.FC<commonProps> = ({ children }) => (
  <div className="bg-white" id="daftar">
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="bg-indigo-700 rounded-lg shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
        <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
          <div className="lg:self-center">{children}</div>
        </div>
        <div className="-mt-6 aspect-w-5 aspect-h-4">
          <img
            className="transform lg:-translate-x-20 lg:translate-y-20 rounded-md object-cover object-left-top"
            src="/images/foto-vika.jpeg"
            alt="Foto Vika"
          />
        </div>
      </div>
    </div>
  </div>
)
