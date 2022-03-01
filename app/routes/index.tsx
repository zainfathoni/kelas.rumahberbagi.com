import type { MetaFunction } from 'remix'
import { HeroSection } from '~/components/hero-section'
import {
  BenefitSection,
  BenefitDescription,
  BenefitTopContainer,
  BenefitBottomContainer,
  BenefitContainerImage,
  BenefitItem,
} from '~/components/benefit-section'
import { FileInvoiceIcon } from '~/components/icons/file-invoice'
import { FileSignatureIcon } from '~/components/icons/file-signature'
import { FileVideoIcon } from '~/components/icons/file-video'
import { CommentsAltIcon } from '~/components/icons/comments-alt'
import { Content } from '~/components/sections/content'
import { Pricing } from '~/components/sections/pricing'
import { QnA } from '~/components/qna-section'
import {
  CtaButton,
  CtaSection,
  CtaDescription,
  CtaTitle,
} from '~/components/cta-section'
import { TelegramIcon } from '~/components/icons/telegram'
import { Timeline } from '~/components/sections/timeline'

export const meta: MetaFunction = () => {
  return {
    title: 'Kelas Rumah Berbagi',
    description: 'Tahun Prasekolahku',
  }
}

export default function HomePage() {
  return (
    <div>
      <main>
        <HeroSection />
        <BenefitSection
          title="Mendidik anak usia Prasekolah dengan lembut, bahagia, dan cinta"
          top={
            <BenefitTopContainer
              title="Kelas yang nyaman dan mudah"
              description="Agar kelas ini nyaman diikuti dan mudah untuk dirujuk kembali di kemudian hari, maka saya sediakan:"
              image={
                <BenefitContainerImage
                  src="/images/planner-preview.jpeg"
                  alt="Halaman perencanaan"
                  height={1280}
                  width={937}
                />
              }
            >
              <BenefitItem
                icon={<FileInvoiceIcon />}
                title="Handout dan catatan bergambar (sketch note)"
              >
                Ini adalah sketchnote yang saya tulis dan gambar sendiri untuk
                membantu memudahkan teman-teman memahami materi yang saya
                sampaikan.
              </BenefitItem>
              <BenefitItem
                icon={<FileSignatureIcon />}
                title="Printable planner"
              >
                Setelah memahami materi, kita akan mengeksplorasi planner untuk
                membantu menavigasi aplikasi materi dalam kehidupan mereka
                sehari-hari. Planner yang bisa dikostumisasi sesuai dengan
                kebutuhan kalian dan anak.
              </BenefitItem>
              <BenefitItem
                icon={<FileVideoIcon />}
                title="Materi Video rekaman (pre-recorded video)"
              >
                Materi yang akan saya sampaikan sudah saya rekam sebelumnya
                dengan kualitas suara dan gambar yang lebih baik dari
                kelas-kelas sebelumnya. Materi saya partisi berdasarkan topik
                sehingga teman-teman mudah merujuk kembali sesuai dengan topik
                yang kalian inginkan atau butuhkan saat itu.
              </BenefitItem>
            </BenefitTopContainer>
          }
          bottom={
            <BenefitBottomContainer
              title="Timeline"
              description="Saya akan ajak teman-teman untuk menyelami materi dengan:"
              image={
                <BenefitContainerImage
                  src="/images/interaction-preview.jpeg"
                  alt="Materi interaksi di kelas"
                  height={959}
                  width={1280}
                />
              }
            >
              <BenefitItem icon={<TelegramIcon />} title="Grup Telegram">
                Kami akan sediakan grup telegram untuk update informasi dan
                mengumpulkan pertanyaan-pertanyaan yang ingin diajukan. Oleh
                karena itu, setelah peserta mendapatkan akses materi, silakan
                materi tersebut dipelajari sesuai dengan kecepatan
                masing-masing. Teman-teman bisa melahap habis materi sekali
                waktu, atau dicicil untuk dipelajari dalam waktu beberapa hari.
                Jika ada pertanyaan, ajukanlah pertanyaan tersebut di grup
                telegram. Pertanyaan-pertanyaan tersebut akan dikumpulkan oleh
                Tim Tahun Prasekolahku.
              </BenefitItem>
              <BenefitItem icon={<CommentsAltIcon />} title="Diskusi via Zoom">
                Setelah pertanyaan terkumpul, kami akan mengadakan sesi Zoom
                untuk berdiskusi interaktif akan pertanyaan-pertanyaan tersebut.
                Sesi diskusi via Zoom akan diadakan secara berkala. Untuk
                periode pertama tahun 2022, diskusi Zoom diadakan pada hari
                Minggu, 20 Maret 2022. Untuk teman/teman yang ingin mengikuti
                Zoom bulan Maret ini, maka timeline-nya sbb:
              </BenefitItem>
            </BenefitBottomContainer>
          }
        >
          <BenefitDescription>
            Menjadi seorang ibu baru dengan anak usia prasekolah adalah satu
            pekerjaan yang menantang. Kita tidak sedang membesarkan tanaman atau
            hewan, tetapi manusia dengan segala fitrah, kemampuan, dan
            potensinya yang terus berkembang. Kita berharap, mereka lahir
            lengkap dengan buku manual. Tetapi tidak, kita belajar sambil
            sekaligus membesarkannya. Tidak heran jika ini membuat para ibu
            merasa kelelahan dan kebingungan.
          </BenefitDescription>
          <BenefitDescription>
            Masa-masa prasekolah ini adalah masa awal kehidupan yang seharusnya
            bebas dari tekanan. Ini bukan masa anak belajar dengan jadwal
            terstruktur, juga bukan saat yang tepat menjejali anak dengan
            sebanyak-banyaknya fakta. Anak tidak harus belajar dari peralatan
            yang mahal, karena sarana pendidikan terbaik sudah Allah sediakan di
            alam, baik itu di luar atau bahkan di dalam rumah sendiri.
          </BenefitDescription>
          <BenefitDescription>
            Di kelas ini, saya akan menggunakan prinsip-prinsip pendidikan ala
            Charlotte Mason dan positive discipline untuk pendidikan prasekolah
            yang praktis, mudah dilakukan, dan menyenangkan. Di sini kita akan
            bersama-sama melihat bahwa anak usia ini tidak perlu diajari
            aktivitas-aktivitas akademis yang membuat mereka dan para ibu
            stress. Kita akan melangkah ke dunia pendidikan yang simpel dan
            menyenangkan tanpa mengorbankan kewarasan kita. Insyaa Allah.
          </BenefitDescription>
        </BenefitSection>
        <Timeline />
        <Content title="Kisi-kisi materi">
          <Content.Item>Pendahuluan</Content.Item>
          <Content.Item>
            Sekilas Tentang Charlotte Mason dan kesesuaiannya untuk keluarga
            muslim
          </Content.Item>
          <Content.Item>
            Prinsip Dasar 1: Memahami Anak sebagai Individu
          </Content.Item>
          <Content.Item>
            Prinsip Dasar 2: Memahami 3 instrumen pendidikan
          </Content.Item>
          <Content.Item>
            Prinsip Dasar 3: Memahami 6 tahun pertama sebagai Masa Tumbuh yang
            Tenang
          </Content.Item>
          <Content.Item>
            Prioritas Pendidikan Prasekolah: Aspek Fisik dan Rohani
            (Mental-Spiritual)
          </Content.Item>
          <Content.Item>Mengasah Kebiasaan Baik pada Anak</Content.Item>
          <Content.Item>Pentingnya Bermain Bebas</Content.Item>
          <Content.Item>Kebutuhan Outdoor life</Content.Item>
          <Content.Item>Membangun ikatan anak dengan alam</Content.Item>
          <Content.Item>
            Memilih dan menyajikan buku dan kisah yang terbaik
          </Content.Item>
          <Content.Item>Mengasah Bahasa</Content.Item>
          <Content.Item>Membangun Kehidupan Spiritual</Content.Item>
          <Content.Item>Mengasah seni</Content.Item>
          <Content.Item>Tahap Pra Membaca, Berhitung, dan Menulis</Content.Item>
          <Content.Item>Mengisi Planner Tahun Prasekolahku</Content.Item>
        </Content>
        <Pricing
          title="Pembayaran kelas"
          description={
            <Pricing.Description>
              Pembayaran harus dilakukan sebelum Anda dapat mengakses fasilitas
              kelas
            </Pricing.Description>
          }
        >
          <Pricing.Included title="Biaya termasuk">
            <Pricing.Item>
              Handout catatan bergambar dan printable planner
            </Pricing.Item>
            <Pricing.Item>Akses materi pre-recorded video</Pricing.Item>
            <Pricing.Item>Akses grup Telegram</Pricing.Item>
            <Pricing.Item>Akses diskusi langsung via Zoom</Pricing.Item>
          </Pricing.Included>
        </Pricing>
        <QnA
          title="FAQ (Tanya Jawab)"
          description={
            <QnA.Description>
              Tidak menemukan jawaban yang Anda cari? Hubungi saya{' '}
              <a
                href="https://www.instagram.com/vika.riandini/"
                className="font-medium text-indigo-600 hover:text-indigo-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                melalui Instagram
              </a>
              .
            </QnA.Description>
          }
        >
          <QnA.Content>
            <div>
              <QnA.Question>Kelas ini untuk siapa?</QnA.Question>
              <QnA.Answer>
                Kelas ini untuk para orang tua, khususnya untuk anak di bawah
                usia sekolah (0-6 tahun), tetapi tidak menutup kemungkinan orang
                tua dengan anak di usia sekolah masih membutuhkannya karena bisa
                jadi ada aspek yang terlewat dari fondasi yang harus
                dipersiapkan di usia prasekolah.
              </QnA.Answer>
            </div>
            <div>
              <QnA.Question>
                Berapa biaya kelas ini? Kapan saya harus membayarnya?
              </QnA.Question>
              <QnA.Answer>
                Biaya kelas adalah Rp 200.000,- dan dapat dibayarkan sesuai
                dengan alur pendaftaran di website ini.
              </QnA.Answer>
            </div>
            <div>
              <QnA.Question>
                Berapa jumlah peserta yang akan mengikuti kelas ini?
              </QnA.Question>
              <QnA.Answer>
                Semua peserta waiting list yang sudah mendaftar akan kami
                proses. Hanya calon peserta yang melunasi pembayaran yang akan
                berhak menjadi peserta Kelas Tahun Prasekolahku.
              </QnA.Answer>
            </div>
            <div>
              <QnA.Question>
                Apakah materi bisa diakses setelah kelas selesai?
              </QnA.Question>
              <QnA.Answer>
                Ya. Materi akan tetap dapat Anda akses melalui website yang
                sudah kami sediakan.
              </QnA.Answer>
            </div>
            <div>
              <QnA.Question>
                Apakah peserta akan mendapatkan rekaman diskusi zoom?
              </QnA.Question>
              <QnA.Answer>
                Ya. Diskusi zoom akan kami rekam dan peserta bisa mengakses
                rekaman tersebut di website.
              </QnA.Answer>
            </div>
            <div>
              <QnA.Question>
                Mengapa proses pendaftaran dan materi kelas menggunakan website?
              </QnA.Question>
              <QnA.Answer>
                Belajar dari pengalaman kelas-kelas sebelumnya, kami ingin
                meningkatkan pengalaman dan kualitas materi yang kami sampaikan.
                Kami ingin peserta bisa mendapatkan manfaat sebanyak mungkin
                dari materi yang sudah kami persiapkan. Selain itu, ke depannya,
                website ini akan terus dikembangkan dan akan menjadi portal
                aneka kelas Rumah Berbagi selanjutnya.
              </QnA.Answer>
            </div>
          </QnA.Content>
        </QnA>
        <CtaSection>
          <CtaTitle>Tahun Prasekolahku</CtaTitle>
          <CtaDescription>Anda berminat?</CtaDescription>
          <CtaButton>Daftar sekarang</CtaButton>
        </CtaSection>
        <QnA
          title="Kebijakan Privasi"
          id="privacy-policy"
          description={
            <QnA.Description>
              Kebijakan privasi dan keanggotaan kelas
            </QnA.Description>
          }
        >
          <QnA.Content>
            <div>
              <QnA.Question>
                Mengapa data diri saya diperlukan saat pendaftaran?
              </QnA.Question>
              <QnA.Answer>
                Kami membutuhkan data diri Anda untuk memastikan bahwa Anda bisa
                kami hubungi untuk proses selanjutnya. Termasuk di antaranya
                pembayaran biaya kelas dan pemberian akses terhadap kelas yang
                kami sediakan.
              </QnA.Answer>
            </div>
            <div>
              <QnA.Question>
                Data apa saja yang perlu saya berikan?
              </QnA.Question>
              <QnA.Answer>
                Untuk keperluan yang telah kami jelaskan di atas, kami
                membutuhkan data diri Anda seperti nama, alamat email, nomor
                WhatsApp, dan akun Instagram Anda.
              </QnA.Answer>
            </div>
            <div>
              <QnA.Question>
                Apakah saya bisa mengubah data diri saya?
              </QnA.Question>
              <QnA.Answer>
                Ya, Anda bisa mengubah data diri Anda di website ini melalui
                menu <strong>Ubah Profil</strong> yang dapat Anda akses setelah
                Anda masuk ke halaman <em>Dashboard</em>.
              </QnA.Answer>
            </div>
          </QnA.Content>
        </QnA>
      </main>
    </div>
  )
}
