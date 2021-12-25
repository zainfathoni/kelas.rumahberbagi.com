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
import { WhatsAppIcon } from '~/components/icons/whatsapp'
import { ChalkboardTeacherIcon } from '~/components/icons/chalkboard-teacher'
import { CommentsAltIcon } from '~/components/icons/comments-alt'
import { Content } from '~/components/sections/content'
import { Pricing } from '~/components/sections/pricing'
import { Faq } from '~/components/faq-section'
import {
  CtaButton,
  CtaSection,
  CtaDescription,
  CtaTitle,
} from '~/components/cta-section'

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
                Untuk membantu memahami materi yang saya sampaikan, saya
                sediakan catatan visual yang menyenangkan yang saya tulis dan
                gambar sendiri.
              </BenefitItem>
              <BenefitItem
                icon={<FileSignatureIcon />}
                title="Printable planner"
              >
                Setelah memahami materi, kita akan mengeksplorasi planner untuk
                membantumu menavigasi pendidikan dan kehidupan mereka
                sehari-hari. Planner yang bisa dikostumisasi sesuai dengan
                kebutuhan kalian dan anak.
              </BenefitItem>
              <BenefitItem icon={<FileVideoIcon />} title="Video rekaman">
                Kelas akan saya rekam dan saya bagikan kepada kalian agar bisa
                diakses seumur hidup
              </BenefitItem>
              <BenefitItem
                icon={<WhatsAppIcon />}
                title="Grup WhatsApp sementara"
              >
                Saya akan buatkan grup WhatsApp sementara selama 1 bulan, untuk
                sarana berdiskusi jika ada hal-hal yang masih ingin ditanyakan.
              </BenefitItem>
            </BenefitTopContainer>
          }
          bottom={
            <BenefitBottomContainer
              title="Interaksi dua arah"
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
              <BenefitItem
                icon={<ChalkboardTeacherIcon />}
                title="Langsung dan intensif"
              >
                Interaksi langsung di dalam kelas melalui Zoom. Ukuran kelas
                yang kecil memungkinkan proses diskusi yang mendalam.
              </BenefitItem>
              <BenefitItem
                icon={<CommentsAltIcon />}
                title="Demonstrasi dan diskusi"
              >
                Saya akan mendemonstrasikan pengisian lembar perencanaan yang
                telah disediakan disertai dengan diskusi dan tanya jawab.
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
            Di kelas ini, saya akan menggunakan saran-saran Charlotte Mason
            untuk pendidikan prasekolah yang praktis, mudah dilakukan, dan
            menyenangkan. Saya akan tunjukkan bahwa anak usia ini tidak perlu
            diajari aktivitas-aktivitas akademis yang membuat mereka dan para
            ibu stress. Kita akan melangkah ke dunia pendidikan yang simpel,
            klasik, dan menyenangkan tanpa mengorbankan kewarasan kita.
          </BenefitDescription>
        </BenefitSection>
        <Content title="Kisi-kisi materi">
          <Content.Item>Sekilas filosofi Charlotte Mason</Content.Item>
          <Content.Item>Tugas utama orang tua</Content.Item>
          <Content.Item>
            Prioritas pendidikan anak prasekolah (0-6 tahun)
          </Content.Item>
          <Content.Item>Kebutuhan fisik</Content.Item>
          <Content.Item>Kunci kebiasaan baik</Content.Item>
          <Content.Item>Bermain bebas dan mengasah 5 indera</Content.Item>
          <Content.Item>Outdoor life</Content.Item>
          <Content.Item>Membangun ikatan dengan alam</Content.Item>
          <Content.Item>Buku dan cerita</Content.Item>
          <Content.Item>Bahasa</Content.Item>
          <Content.Item>Kehidupan spiritual </Content.Item>
          <Content.Item>Seni</Content.Item>
          <Content.Item>Tahap pramembaca</Content.Item>
          <Content.Item>Berhitung</Content.Item>
          <Content.Item>Menulis</Content.Item>
          <Content.Item>Pengisian planner</Content.Item>
        </Content>
        <Pricing title="Biaya kelas">
          <Pricing.Description>
            Biaya baru dibayarkan setelah Anda terkonfirmasi sebagai peserta
            kelas
          </Pricing.Description>
          <Pricing.Included title="Biaya termasuk">
            <Pricing.Item>Handout berupa catatan bergambar</Pricing.Item>
            <Pricing.Item>Printable planner</Pricing.Item>
            <Pricing.Item>Akses kelas online melalui Zoom</Pricing.Item>
            <Pricing.Item>Video rekaman kelas</Pricing.Item>
          </Pricing.Included>
        </Pricing>
        <Faq title="FAQ (Tanya Jawab)">
          <Faq.Description>
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
          </Faq.Description>
          <Faq.Content>
            <div>
              <Faq.Question>Kelas ini untuk siapa?</Faq.Question>
              <Faq.Answer>
                Kelas ini untuk para orang tua, khususnya untuk anak di bawah
                usia sekolah, tetapi tidak menutup kemungkinan orang tua dengan
                anak di usia sekolah masih membutuhkannya karena bisa jadi ada
                aspek yang terlewat dari fondasi yang harus dipersiapkan di usia
                prasekolah.
              </Faq.Answer>
            </div>
            <div>
              <Faq.Question>
                Berapa lama kelas ini akan berlangsung?
              </Faq.Question>
              <Faq.Answer>
                Setidaknya akan ada dua pertemuan yang terdiri dari pembahasan
                materi dan praktik pembuatan rencana pendidikan untuk anak
                prasekolah. Tidak menutup kemungkinan jumlah pertemuan akan
                ditambah sesuai dengan kebutuhan.
              </Faq.Answer>
            </div>
            <div>
              <Faq.Question>
                Berapa biaya kelas ini? Kapan saya harus membayarnya?
              </Faq.Question>
              <Faq.Answer>
                Biaya kelas ini masih belum ditentukan, nantinya akan dapat
                dibayarkan setelah Anda mendapatkan konfirmasi dari kami bahwa
                Anda mendapatkan slot untuk bergabung di kelas ini.
              </Faq.Answer>
            </div>
            <div>
              <Faq.Question>
                Mengapa jumlah peserta hanya dibatasi sebanyak 30 orang?
              </Faq.Question>
              <Faq.Answer>
                Supaya proses belajar bisa lebih fokus dan aktivitas tanya jawab
                bisa dilakukan secara lebih intensif.
              </Faq.Answer>
            </div>
            <div>
              <Faq.Question>
                Saya gagal mendapatkan slot di kelas ini. Lantas bagaimana saya
                bisa mengikuti kelas ini?
              </Faq.Question>
              <Faq.Answer>
                Pertama-tama, pastikan dulu bahwa Anda telah terdaftar ke dalam
                daftar antrian calon peserta. Apabila kelas untuk angkatan
                berikutnya telah kami buka, kami akan kirimkan email kepada Anda
                berdasarkan urutan antrian Anda.
              </Faq.Answer>
            </div>
          </Faq.Content>
        </Faq>
        <CtaSection>
          <CtaTitle>Tahun Prasekolahku</CtaTitle>
          <CtaDescription>Anda berminat?</CtaDescription>
          <CtaButton>Daftar sekarang</CtaButton>
        </CtaSection>
        <Faq title="Kebijakan Privasi" id="privacy-policy">
          <Faq.Description>
            Kebijakan privasi dan keanggotaan kelas
          </Faq.Description>
          <Faq.Content>
            <div>
              <Faq.Question>
                Mengapa data diri saya diperlukan saat pendaftaran?
              </Faq.Question>
              <Faq.Answer>
                Kami membutuhkan data diri Anda untuk memastikan bahwa Anda bisa
                kami hubungi untuk proses selanjutnya. Termasuk di antaranya
                pembayaran biaya kelas dan pemberian akses terhadap kelas yang
                kami sediakan.
              </Faq.Answer>
            </div>
            <div>
              <Faq.Question>Data apa saja yang erlu saya berikan?</Faq.Question>
              <Faq.Answer>
                Untuk keperluan yang telah kami jelaskan di atas, kami
                membutuhkan data diri Anda seperti nama, alamat email, nomor
                WhatsApp, dan akun Instagram Anda.
              </Faq.Answer>
            </div>
            <div>
              <Faq.Question>
                Apakah saya bisa mengubah data diri saya?
              </Faq.Question>
              <Faq.Answer>
                Tidak, kami tidak menyediakan fitur untuk mengubah data diri
                Anda untuk saat ini. Akan tetapi, seiring dengan perkembangan
                teknologi situs kami, kami akan menambahkan fitur untuk mengubah
                data diri Anda. Untuk sementara waktu, apabila Anda menghendaki
                perubahan data, Anda bisa menghubungi kami melalui akun
                Instagram{' '}
                <a
                  href="https://www.instagram.com/vika.riandini/"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @vika.riandini
                </a>
                .
              </Faq.Answer>
            </div>
          </Faq.Content>
        </Faq>
      </main>
    </div>
  )
}
