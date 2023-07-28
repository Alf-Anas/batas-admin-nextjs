/* eslint-disable @next/next/no-img-element */
import classes from "./About.module.css";

export default function AboutPage() {
  return (
    <div className={classes.div_padding}>
      <h1>About</h1>
      <p>
        <b>Batas Admin Web App</b> merupakan aplikasi web untuk mencari dan
        mendownload batas administrasi di seluruh Indonesia dari tingkat
        provinsi hingga tingkat desa / kelurahan. Untuk mendownload data batas
        administrasi secara keseluruhan dapat dilihat pada repository github{" "}
        <a
          href="https://github.com/Alf-Anas/batas-administrasi-indonesia"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download Batas Administrasi Indonesia
        </a>
        .
      </p>
      <p>
        Batas administrasi ini dapat didownload dalam format ShapeFile(SHP), KML
        dan GeoJSON. Batas adinistrasi Update (13 Juni 2023), sudah memiliki 38
        provinsi dan termasuk pemecahan provinsi papua namun untuk Kode Provinsi
        pemekaran papua masih menggunakan kode yang lama.
      </p>
      <h3>Batas Administrasi yang meliputi :</h3>
      <ul>
        <li>Batas Provinsi (38 Provinsi)</li>
        <li>Batas Kabupaten / Kota (514 Batas)</li>
        <li>Batas Kecamatan</li>
        <li>Batas Desa / Kelurahan</li>
      </ul>
      <h3 id="pulau-sumatra">Pulau Sumatra</h3>
      <ul>
        <li>Aceh: Banda Aceh</li>
        <li>Sumatra Utara: Medan</li>
        <li>Sumatra Selatan: Palembang</li>
        <li>Sumatra Barat: Padang</li>
        <li>Bengkulu: Bengkulu</li>
        <li>Riau: Pekanbaru</li>
        <li>Kepulauan Riau: Tanjung Pinang</li>
        <li>Jambi: Jambi</li>
        <li>Lampung: Bandar Lampung</li>
        <li>Bangka Belitung: Pangkal Pinang</li>
      </ul>
      <h3 id="pulau-kalimantan">Pulau Kalimantan</h3>
      <ul>
        <li>Kalimantan Timur: Samarinda</li>
        <li>Kalimantan Barat: Pontianak</li>
        <li>Kalimantan Tengah: Palangkaraya</li>
        <li>
          Kalimantan Selatan: Banjarbaru (sebelumnya ibukota Kalimantan Selatan
          adalah Banjarmasin, lalu menjadi Banjarbaru berdasarkan ketetapan UU
          RI Nomor 8/2022 tentang Provinsi Kalimantan Selatan)
        </li>
        <li>Kalimantan Utara: Tanjung Selor</li>
      </ul>
      <h3 id="pulau-jawa">Pulau Jawa</h3>
      <ul>
        <li>DKI Jakarta: Jakarta</li>
        <li>Banten: Serang</li>
        <li>Jawa Barat: Bandung</li>
        <li>Jawa Tengah: Semarang</li>
        <li>DI Yogyakarta: Yogyakarta</li>
        <li>Jawa Timur: Surabaya</li>
      </ul>
      <h3 id="pulau-nusa-tenggara-dan-bali">Pulau Nusa Tenggara dan Bali</h3>
      <ul>
        <li>Bali: Denpasar</li>
        <li>Nusa Tenggara Barat: Mataram</li>
        <li>Nusa Tenggara Timur: Kupang</li>
      </ul>
      <h3 id="pulau-sulawesi">Pulau Sulawesi</h3>
      <ul>
        <li>Sulawesi Utara: Manado</li>
        <li>Sulawesi Barat: Mamuju</li>
        <li>Sulawesi Tengah: Palu</li>
        <li>Gorontalo: Gorontalo</li>
        <li>Sulawesi Tenggara: Kendari</li>
        <li>Sulawesi Selatan: Makassar</li>
      </ul>
      <h3 id="pulau-maluku-dan-papua">Pulau Maluku dan Papua</h3>
      <ul>
        <li>
          Maluku Utara: Sofifi (Ketentuan ini berlaku sejak 4 Agustus 2010,
          menurut situs resmi pemerintahan terkait)
        </li>
        <li>Maluku: Ambon</li>
        <li>Papua Barat: Manokwari</li>
        <li>Papua: Jayapura</li>
        <li>Papua Selatan: Kabupaten Merauke</li>
        <li>Papua Tengah Kabupaten Nabire</li>
        <li>Papua Pegunungan: Kabupaten Jayawijaya</li>
        <li>Papua Barat Daya: Sorong</li>
      </ul>

      <p>
        Web app ini dibangun dengan menggunakan :
        <ul>
          <li>
            <a
              href="https://nextjs.org/learn/basics/create-nextjs-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next JS
            </a>{" "}
            sebagai web framework utamanya
          </li>
          <li>
            <a
              href="https://ant.design/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ant Design
            </a>{" "}
            seabagai UI framework
          </li>
          <li>
            <a
              href="https://maplibre.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Maplibre GL JS
            </a>{" "}
            sebagai map library yang digunakan
          </li>
          <li>
            <a
              href="https://www.openstreetmap.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenStreetMap
            </a>{" "}
            sebagai basemap utamanya
          </li>
          <li>
            <a
              href="https://vercel.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vercel
            </a>{" "}
            sebagai hostingnya
          </li>
        </ul>
      </p>
      <p>
        Source Code :{" "}
        <a
          href="https://github.com/Alf-Anas/batas-admin-nextjs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github Repository
        </a>
        <br />
        Website :{" "}
        <a href="https://geoit.dev" target="_blank" rel="noopener noreferrer">
          GeoIT Developer
        </a>
      </p>
      <p>
        <b>
          Disclaimer: Kami tidak bertanggungjawab dengan keakuratan data ini,
          untuk penggunaan penelitian dan pengambilan keputusan alangkah baiknya
          untuk meminta data langsung kepada instansi yang berwenang.
        </b>
      </p>

      <div>
        <a href="https://trakteer.id/alf-anas" target="_blank">
          <img
            id="wse-buttons-preview"
            src="https://cdn.trakteer.id/images/embed/trbtn-red-1.png"
            className={classes.div_trakteer}
            alt="Trakteer Saya"
          />
        </a>
        <a href="https://www.buymeacoffee.com/alf.anas" target="_blank">
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png"
            alt="Buy Me A Coffee"
            className={classes.div_buymeacoffe}
          />
        </a>
      </div>
    </div>
  );
}
