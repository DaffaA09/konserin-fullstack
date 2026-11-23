import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateConcertDto } from './dto/create-concert.dto.js';
import { UpdateConcertDto } from './dto/update-concert.dto.js';
import { Concert } from './entities/concert.entity.js';

@Injectable()
export class ConcertsService {
  private concerts: Concert[] = [
    {
      id: 1,
      name: 'Semesta Berpesta',
      artist: 'Tulus',
      category: 'Lokal',
      date: '2026-11-21',
      time: '19:00',
      location: 'Stadion Madya, Jakarta',
      ticketPrice: 250000,
      preSale: '2026-10-28',
      generalSale: '2026-11-01',
      status: 'Tersedia',
      description:
        'Malam musik bersama Tulus dengan lagu-lagu pilihan dari berbagai album.',
    },
    {
      id: 2,
      name: 'The Eras Night',
      artist: 'Taylor Swift',
      category: 'Internasional',
      date: '2026-12-12',
      time: '20:00',
      location: 'Jakarta International Stadium, Jakarta',
      ticketPrice: 900000,
      preSale: '2026-11-05',
      generalSale: '2026-11-10',
      status: 'Segera hadir',
      description: 'Perayaan lagu-lagu hits dari berbagai era musik Taylor Swift.',
    },
    {
      id: 3,
      name: 'BABYMONSTER WORLD TOUR [CHOOM]',
      artist: 'BABYMONSTER',
      category: 'Internasional',
      date: '2026-12-17',
      time: '18:30',
      location: 'Indonesia Arena, Jakarta Pusat, Indonesia',
      ticketPrice: 1100000,
      preSale: '2026-11-17',
      generalSale: '2026-11-25',
      status: 'Segera hadir',
      description: 'Konser BABYMONSTER WORLD TOUR [CHOOM] IN JAKARTA.',
    },
  ];

  private nextId = 4;

  private ensureNoDuplicate(name: string, date: string, ignoreId?: number) {
    const normalizedName = name.trim().toLowerCase();
    const duplicate = this.concerts.find(
      (concert) =>
        concert.id !== ignoreId &&
        concert.name.trim().toLowerCase() === normalizedName &&
        concert.date === date,
    );

    if (duplicate) {
      throw new ConflictException(
        `Konser "${name}" pada tanggal ${date} sudah terdaftar`,
      );
    }
  }

  create(createConcertDto: CreateConcertDto): Concert {
    this.ensureNoDuplicate(createConcertDto.name, createConcertDto.date);

    const newConcert: Concert = {
      id: this.nextId++,
      ...createConcertDto,
    };

    this.concerts.push(newConcert);
    return newConcert;
  }

  findAll(): Concert[] {
    return this.concerts;
  }

  findOne(id: number): Concert {
    const concert = this.concerts.find((item) => item.id === id);
    if (!concert) {
      throw new NotFoundException(`Konser dengan ID ${id} tidak ditemukan`);
    }
    return concert;
  }

  update(id: number, updateConcertDto: UpdateConcertDto): Concert {
    const index = this.concerts.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Konser dengan ID ${id} tidak ditemukan`);
    }

    const current = this.concerts[index];
    const nextName = updateConcertDto.name ?? current.name;
    const nextDate = updateConcertDto.date ?? current.date;

    this.ensureNoDuplicate(nextName, nextDate, id);

    const updatedConcert: Concert = {
      ...current,
      ...updateConcertDto,
      id,
    };

    this.concerts[index] = updatedConcert;
    return updatedConcert;
  }

  remove(id: number): { message: string; data: Concert } {
    const index = this.concerts.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Konser dengan ID ${id} tidak ditemukan`);
    }

    const [deleted] = this.concerts.splice(index, 1);
    return {
      message: `Konser "${deleted.name}" berhasil dihapus`,
      data: deleted,
    };
  }
}
