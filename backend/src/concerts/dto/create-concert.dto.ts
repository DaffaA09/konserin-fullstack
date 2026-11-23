import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateConcertDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama konser wajib diisi' })
  @MinLength(3, { message: 'Nama konser minimal 3 karakter' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Nama artis atau band wajib diisi' })
  @MinLength(2, { message: 'Nama artis minimal 2 karakter' })
  artist: string;

  @IsString()
  @IsIn(['Lokal', 'Internasional'], {
    message: 'Kategori harus Lokal atau Internasional',
  })
  category: string;

  @IsDateString({}, { message: 'Format tanggal harus valid (YYYY-MM-DD)' })
  date: string;

  @IsString()
  @IsNotEmpty({ message: 'Lokasi konser wajib diisi' })
  @MinLength(3, { message: 'Lokasi konser minimal 3 karakter' })
  location: string;

  @IsNumber({}, { message: 'Harga tiket harus berupa angka' })
  @Min(0, { message: 'Harga tiket tidak boleh negatif' })
  ticketPrice: number;

  @IsString()
  @IsIn(['Tersedia', 'Segera hadir', 'Habis'], {
    message: 'Status harus Tersedia, Segera hadir, atau Habis',
  })
  status: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Format tanggal pre-sale harus valid (YYYY-MM-DD)' })
  preSale?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Format tanggal general sale harus valid (YYYY-MM-DD)' })
  generalSale?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
