import * as React from 'react'

type DescriptionProps = {
  children: React.ReactNode
}
const Description = ({ children }: DescriptionProps): JSX.Element => (
  <p className="mt-4 text-lg text-gray-500">{children}</p>
)

type ContentProps = {
  children: React.ReactNode
}
const Content = ({ children }: ContentProps): JSX.Element => (
  <dl className="space-y-12">{children}</dl>
)

type QuestionProps = {
  children: React.ReactNode
}
const Question = ({ children }: QuestionProps): JSX.Element => (
  <dt className="text-lg leading-6 font-medium text-gray-900">{children}</dt>
)

type AnswerProps = {
  children: React.ReactNode
}
const Answer = ({ children }: AnswerProps): JSX.Element => (
  <dd className="mt-2 text-base text-gray-500">{children}</dd>
)

type QnAProps = {
  id?: string
  title: string
  description: React.ReactNode
  children: React.ReactNode
}
export const QnA = ({
  id = 'faq',
  title,
  description,
  children,
}: QnAProps): JSX.Element => {
  return (
    <div className="bg-white" id={id}>
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
            {description}
          </div>
          <div className="mt-12 lg:mt-0 lg:col-span-2">{children}</div>
        </div>
      </div>
    </div>
  )
}

QnA.Description = Description
QnA.Content = Content
QnA.Question = Question
QnA.Answer = Answer
