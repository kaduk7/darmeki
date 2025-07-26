-- CreateTable
CREATE TABLE "KaryawanTb" (
    "id" SERIAL NOT NULL,
    "NIP" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tempatLahir" TEXT,
    "tanggalLahir" TIMESTAMP(3),
    "alamat" TEXT,
    "hp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "foto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KaryawanTb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitTb" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "usernama" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "foto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnitTb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KerjaTb" (
    "id" SERIAL NOT NULL,
    "unitId" INTEGER NOT NULL,
    "tanggal" INTEGER NOT NULL,
    "shift" TEXT NOT NULL,
    "totallaporangangguan" TIMESTAMP(3) NOT NULL,
    "totalwoplnmobile" TIMESTAMP(3) NOT NULL,
    "woselesai" TEXT NOT NULL,
    "wobelumselesai" TEXT NOT NULL,
    "jumlahp0" TEXT NOT NULL,
    "pemakaianmaterial" TEXT NOT NULL,
    "foto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KerjaTb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailKerjaTb" (
    "id" SERIAL NOT NULL,
    "karyawanId" INTEGER NOT NULL,
    "kerjaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DetailKerjaTb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTb" (
    "id" SERIAL NOT NULL,
    "unitId" INTEGER NOT NULL,
    "usernama" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlideTb" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "gambar" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SlideTb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfilTb" (
    "id" SERIAL NOT NULL,
    "nama" TEXT,
    "alamat" TEXT,
    "email" TEXT,
    "telp" TEXT,
    "wa" TEXT,
    "lokasi" TEXT,
    "radius" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfilTb_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KaryawanTb_hp_key" ON "KaryawanTb"("hp");

-- CreateIndex
CREATE UNIQUE INDEX "KaryawanTb_email_key" ON "KaryawanTb"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserTb_unitId_key" ON "UserTb"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTb_usernama_key" ON "UserTb"("usernama");

-- AddForeignKey
ALTER TABLE "KerjaTb" ADD CONSTRAINT "KerjaTb_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "UnitTb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailKerjaTb" ADD CONSTRAINT "DetailKerjaTb_karyawanId_fkey" FOREIGN KEY ("karyawanId") REFERENCES "KaryawanTb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailKerjaTb" ADD CONSTRAINT "DetailKerjaTb_kerjaId_fkey" FOREIGN KEY ("kerjaId") REFERENCES "KerjaTb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTb" ADD CONSTRAINT "UserTb_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "UnitTb"("id") ON DELETE CASCADE ON UPDATE CASCADE;
