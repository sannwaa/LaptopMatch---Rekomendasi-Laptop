const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.laptop.deleteMany();
  await prisma.admin.deleteMany();

  console.log('Seeding Admin account...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@laptopmatch.com',
      password: hashedPassword,
    },
  });
  console.log(`Admin account seeded successfully: ${admin.email}`);

  console.log('Seeding Laptop data...');
  const laptops = [
    { name: 'MacBook Air M2', brand: 'Apple', cpuScore: 8, ramGb: 8, storageGb: 256, price: 16500000, imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500', description: 'Laptop ultrathin premium dengan performa revolusioner chip Apple M2, layar Liquid Retina 13.6 inci yang memukau, dan daya tahan baterai hingga 18 jam tanpa bising kipas.' },
    { name: 'MacBook Pro M3', brand: 'Apple', cpuScore: 9, ramGb: 16, storageGb: 512, price: 28000000, imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', description: 'Komputer kerja profesional berkinerja tinggi ditenagai chip Apple M3, layar Liquid Retina XDR ProMotion 120Hz, serta sistem pendingin aktif untuk beban kerja berat.' },
    { name: 'Zenbook 14 OLED', brand: 'Asus', cpuScore: 8, ramGb: 16, storageGb: 512, price: 17200000, imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500', description: 'Ultrabook elegan dengan layar OLED 2.8K 90Hz yang sangat akurat, ditenagai prosesor Intel Core Ultra terbaru, dibalut bodi tangguh bersertifikasi militer.' },
    { name: 'ROG Zephyrus G14', brand: 'Asus', cpuScore: 9, ramGb: 16, storageGb: 1000, price: 26500000, imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500', description: 'Laptop gaming compact 14 inci terbaik dengan AMD Ryzen 9, kartu grafis NVIDIA RTX 40-Series, layar Nebula Display, dan pendingin liquid metal premium.' },
    { name: 'VivoBook Go 14', brand: 'Asus', cpuScore: 4, ramGb: 8, storageGb: 512, price: 6200000, imageUrl: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500', description: 'Laptop harian yang ringan dan terjangkau untuk pelajar. Menawarkan kinerja andal untuk produktivitas office dasar, layar FHD cerah, dan keyboard chiclet ergonomis.' },
    { name: 'TUF Gaming A15', brand: 'Asus', cpuScore: 8, ramGb: 16, storageGb: 512, price: 14500000, imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500', description: 'Mesin gaming tangguh tahan banting militer dengan AMD Ryzen 7, kartu grafis RTX, sistem pendingin anti-debu ganda, dan baterai berkapasitas besar 90Wh.' },
    { name: 'Yoga Slim 7i', brand: 'Lenovo', cpuScore: 8, ramGb: 16, storageGb: 512, price: 15800000, imageUrl: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500', description: 'Laptop produktivitas ultra-tipis bermaterial aluminium aerospace, layar PureSight resolusi tinggi, audio Dolby Atmos, serta efisiensi daya luar biasa.' },
    { name: 'Legion Slim 5', brand: 'Lenovo', cpuScore: 9, ramGb: 16, storageGb: 512, price: 21000000, imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500', description: 'Laptop gaming tipis dengan performa garang, menampilkan AMD Ryzen 7, GPU NVIDIA RTX, layar WQXGA 165Hz IPS, dan teknologi Lenovo AI Engine+.' },
    { name: 'IdeaPad Slim 3', brand: 'Lenovo', cpuScore: 5, ramGb: 8, storageGb: 512, price: 7500000, imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500', description: 'Partner andal untuk belajar dan bekerja dari rumah. Menawarkan kinerja cepat prosesor Intel Core i3/i5, privasi webcam shutter fisik, dan desain ringkas.' },
    { name: 'ThinkPad E14', brand: 'Lenovo', cpuScore: 7, ramGb: 16, storageGb: 512, price: 13200000, imageUrl: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=500', description: 'Laptop bisnis legendaris dengan daya tahan industri kelas satu, keyboard paling nyaman di kelasnya, fitur keamanan sidik jari, dan chip dTPM 2.0.' },
    { name: 'Pavilion 14', brand: 'HP', cpuScore: 7, ramGb: 16, storageGb: 512, price: 11500000, imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500', description: 'Laptop mainstream stylish berbingkai micro-edge tipis, ditenagai Intel Core i5, didukung audio berkualitas dari B&O Play untuk multimedia yang impresif.' },
    { name: 'Victus 15', brand: 'HP', cpuScore: 8, ramGb: 16, storageGb: 512, price: 13800000, imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500', description: 'Laptop gaming entry-level andalan HP dengan prosesor performa tinggi Intel Core H-series, kartu grafis mumpuni, serta ventilasi udara belakang ganda.' },
    { name: 'Spectre x360', brand: 'HP', cpuScore: 9, ramGb: 16, storageGb: 1000, price: 27000000, imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500', description: 'Laptop convertible 2-in-1 paling premium HP dengan potongan gem-cut yang indah, layar sentuh OLED 3K2K, stylus pen disertakan, dan daya tahan seharian.' },
    { name: 'Envy x360', brand: 'HP', cpuScore: 8, ramGb: 16, storageGb: 512, price: 16200000, imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500', description: 'Laptop lipat serbaguna untuk para konten kreator kreatif. Dilengkapi layar sentuh IPS dengan dukungan pena, prosesor AMD Ryzen tangguh, dan privasi penuh.' },
    { name: 'Swift Go 14', brand: 'Acer', cpuScore: 8, ramGb: 16, storageGb: 512, price: 12500000, imageUrl: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500', description: 'Laptop tipis modern dengan sertifikasi Intel Evo, layar OLED 2.8K 120Hz super tajam, webcam QHD jernih, dan pengisian daya baterai yang super cepat.' },
    { name: 'Predator Helios Neo 16', brand: 'Acer', cpuScore: 9, ramGb: 16, storageGb: 512, price: 19500000, imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500', description: 'Monster gaming performa ekstrem dibekali Intel Core i7 HX-series, GPU RTX 4060, teknologi pendingin 5th Gen AeroBlade 3D Fan, dan keyboard RGB 4-zona.' },
    { name: 'Aspire 3', brand: 'Acer', cpuScore: 4, ramGb: 8, storageGb: 512, price: 5800000, imageUrl: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500', description: 'Pilihan hemat bernilai tinggi untuk tugas kantor, sekolah, dan penjelajahan web. Memiliki desain termal yang ditingkatkan dan penyimpanan SSD cepat.' },
    { name: 'Aspire 5 Spin', brand: 'Acer', cpuScore: 6, ramGb: 8, storageGb: 512, price: 9200000, imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', description: 'Laptop layar sentuh convertible 360 derajat yang praktis. Dilengkapi Acer Active Stylus, Intel Core i3/i5, dan bodi yang kokoh untuk mobilitas tinggi.' },
    { name: 'Inspiron 14', brand: 'Dell', cpuScore: 6, ramGb: 8, storageGb: 512, price: 9800000, imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500', description: 'Laptop harian andalan dengan keandalan Dell. Menawarkan performa andal, layar aspek rasio 16:10 yang luas, dan bahan ramah lingkungan bersertifikasi.' },
    { name: 'XPS 13', brand: 'Dell', cpuScore: 9, ramGb: 16, storageGb: 512, price: 24500000, imageUrl: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=500', description: 'Mahakarya rancangan ultra-compact premium dengan layar InfinityEdge 4-sisi tanpa bingkai, performa kencang dalam bodi aluminium blok tunggal berbobot ringan.' },
    { name: 'Vostro 3430', brand: 'Dell', cpuScore: 5, ramGb: 8, storageGb: 512, price: 8300000, imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500', description: 'Laptop bisnis entry-level tangguh dengan proteksi keamanan hardware kelas korporat, layar anti-glare, dan beragam port konektivitas lengkap.' },
    { name: 'Cyborg 15', brand: 'MSI', cpuScore: 8, ramGb: 16, storageGb: 512, price: 14200000, imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500', description: 'Laptop gaming bergaya futuristik cyberpunk transparan, ditenagai Intel Core H-series, kartu grafis RTX, dan bodi yang luar biasa tipis untuk laptop game.' },
    { name: 'Modern 14', brand: 'MSI', cpuScore: 5, ramGb: 8, storageGb: 512, price: 8000000, imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500', description: 'Laptop ringan bernuansa urban chic yang dinamis, dibekali prosesor AMD Ryzen/Intel Core, keyboard backlit, bersertifikat ketahanan militer MIL-STD-810G.' },
    { name: 'Katana 15', brand: 'MSI', cpuScore: 9, ramGb: 16, storageGb: 1000, price: 18500000, imageUrl: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500', description: 'Senjata gaming tangguh dengan keyboard RGB 4-zona, ditenagai prosesor Intel Core i7 generasi terbaru dan kartu grafis RTX 40-series performa penuh.' },
    { name: 'Galaxy Book3', brand: 'Samsung', cpuScore: 7, ramGb: 8, storageGb: 512, price: 11000000, imageUrl: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=500', description: 'Laptop super tipis dalam ekosistem Samsung Galaxy yang seamless. Layar FHD memukau, baterai tahan lama, serta integrasi mudah dengan tablet dan HP Galaxy.' },
    { name: 'RedmiBook 15', brand: 'Xiaomi', cpuScore: 5, ramGb: 8, storageGb: 256, price: 5500000, imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500', description: 'Laptop layar besar 15.6 inci paling terjangkau dengan performa andal, bodi minimalis matte yang modern, dan baterai mumpuni untuk kebutuhan komputasi harian.' },
    { name: 'MateBook D14', brand: 'Huawei', cpuScore: 6, ramGb: 8, storageGb: 512, price: 8900000, imageUrl: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500', description: 'Laptop aluminium unibody premium nan elegan, dibekali Huawei Share untuk transfer data instan, tombol daya terintegrasi sidik jari, dan layar FullView IPS.' },
    { name: 'Axioo MyBook Hype 5', brand: 'Axioo', cpuScore: 5, ramGb: 8, storageGb: 512, price: 5200000, imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', description: 'Laptop lokal terjangkau dengan spesifikasi tangguh Intel Core i5 generasi ke-10, penyimpanan SSD cepat, serta bodi yang kokoh untuk produktivitas harian Anda.' },
    { name: 'Infinix InBook X2', brand: 'Infinix', cpuScore: 4, ramGb: 8, storageGb: 256, price: 4800000, imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500', description: 'Laptop full-metal super ringan berbobot hanya 1.24 kg, dibekali lampu flash ganda pada kamera webcam untuk video call jernih, serta layar warna sRGB 100%.' },
    { name: 'IdeaPad Flex 5', brand: 'Lenovo', cpuScore: 7, ramGb: 16, storageGb: 512, price: 12200000, imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500', description: 'Laptop 2-in-1 fleksibel yang dapat diputar 360 derajat menjadi tablet, dilengkapi Lenovo Digital Pen, speaker hadap depan Dolby Audio, dan pengisian daya Rapid Charge.' }
  ];

  for (const laptop of laptops) {
    const createdLaptop = await prisma.laptop.create({
      data: laptop,
    });
    console.log(`Laptop seeded: ${createdLaptop.brand} ${createdLaptop.name}`);
  }

  console.log(`Seeding complete. Seeded 1 Admin and ${laptops.length} Laptops.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
