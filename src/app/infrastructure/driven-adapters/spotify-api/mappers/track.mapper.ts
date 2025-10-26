import { Song } from '../../../../core/domain/models/song.model';

// Esta es la implementación del Patrón Mapper
export class TrackMapper {
  static DtoToDomain(dto: any): Song {
    return {
      id: dto.track.id,
      title: dto.track.name,
      artist: dto.track.artists.map((a: any) => a.name).join(', '),
      album: dto.track.album.name,
      imageUrl: dto.track.album.images?.[0]?.url || 'default-image.png',
      previewUrl: dto.track.preview_url
    };
  }

  static DtoToDomainList(dtoList: any[]): Song[] {
    return dtoList.map(TrackMapper.DtoToDomain);
  }
}