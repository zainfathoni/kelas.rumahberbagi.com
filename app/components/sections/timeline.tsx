import {
  BookOpenIcon,
  HandIcon,
  LoginIcon,
  VideoCameraIcon,
} from '@heroicons/react/outline'
import { classNames } from '~/utils/class-names'

const timeline = [
  {
    content:
      'Proses Pendaftaran dan Pembayaran Kelas mulai dibuka. Setelah Peserta sudah melunasi pembayaran, peserta akan mendapatkan akses link untuk masuk ke grup telegram Kelas Tahun Prasekolahku 2022.',
    date: '1 Maret',
    datetime: '2022-03-01',
    icon: LoginIcon,
    iconBackground: 'bg-purple-500',
  },
  {
    content:
      'Peserta akan mendapatkan akses materi lengkap di website ini (kelas.rumahberbagi.com). Materi dapat diakses dan dipelajari kapanpun.',
    date: '9 Maret',
    datetime: '2022-03-09',
    icon: BookOpenIcon,
    iconBackground: 'bg-green-500',
  },
  {
    content:
      'Perkenalan antar peserta dan tim Tahun Prasekolahku; Proses mempelajari materi; Pengumpulan pertanyaan via website;',
    date: '9—17 Maret',
    datetime: '2022-03-09/2022-03-18',
    icon: HandIcon,
    iconBackground: 'bg-orange-500',
  },
  {
    content:
      'Review materi singkat,  jawaban pertanyaan dan diskusi interaktif via zoom. 20 Maret 2022 (pukul 16:00—18:00 WIB)',
    date: '20 Maret',
    datetime: '2021-06-01/2021-06-08',
    icon: VideoCameraIcon,
    iconBackground: 'bg-blue-500',
  },
]

export const Timeline = (): JSX.Element => {
  return (
    <div className="bg-white" id="jadwal">
      <div className="max-w-xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Timeline Maret 2022
          </h2>
        </div>
        <div className="flow-root">
          <ul className="-mb-8">
            {timeline.map((event, eventIdx) => (
              <li key={eventIdx}>
                <div className="relative pb-8">
                  {eventIdx !== timeline.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span
                        className={classNames(
                          event.iconBackground,
                          'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white'
                        )}
                      >
                        <event.icon
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {event.content}{' '}
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time dateTime={event.datetime}>{event.date}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
