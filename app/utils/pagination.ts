import { Lesson } from '@prisma/client'
import { Chapters } from '~/models/course'
import { Serialized } from '~/utils/types'

export const PAGE_SIZE = 10

export function getSkip(page?: number) {
  return page ? (page - 1) * PAGE_SIZE : 0
}

export function getPagesCount(total = 0) {
  return Math.ceil(total / PAGE_SIZE)
}

export function getAdjacentLessonIds(
  chapters: Chapters | Serialized<Chapters>,
  currentLesson: Lesson | Serialized<Lesson>
) {
  const currentChapterIndex = chapters.findIndex(
    (chapter) => chapter.id === currentLesson.chapterId
  )
  const currentChapter = chapters[currentChapterIndex]
  const currentLessonIndex = currentChapter.lessons.findIndex(
    (lesson) => lesson.id === currentLesson.id
  )

  let nextLessonId, prevLessonId

  const nextLessonIndex = currentLessonIndex + 1
  if (nextLessonIndex >= currentChapter.lessons.length) {
    const nextChapterIndex = currentChapterIndex + 1
    if (nextChapterIndex >= chapters.length) {
      nextLessonId = null
    } else {
      nextLessonId = chapters[nextChapterIndex].lessons[0].id
    }
  } else {
    nextLessonId = currentChapter.lessons[nextLessonIndex].id
  }

  const prevLessonIndex = currentLessonIndex - 1
  if (prevLessonIndex < 0) {
    const prevChapterIndex = currentChapterIndex - 1
    if (prevChapterIndex < 0) {
      prevLessonId = null
    } else {
      prevLessonId =
        chapters[prevChapterIndex].lessons[
          chapters[prevChapterIndex].lessons.length - 1
        ].id
    }
  } else {
    prevLessonId = currentChapter.lessons[prevLessonIndex].id
  }

  return {
    currentChapter,
    nextLessonId,
    prevLessonId,
  }
}
