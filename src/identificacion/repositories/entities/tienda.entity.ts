import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EstadoCaptacion {
  PROSPECTO_CREADO = 'prospectoCreado',
  VISITA_REALIZADA = 'visitaRealizada',
  DOCUMENTOS_RECIBIDOS = 'documentosRecibidos',
  RUT_VALIDADO = 'rutValidado',
  HABILITADO_BASICO = 'habilitadoBasico',
  HABILITADO_AVANZADO = 'habilitadoAvanzado',
}

@Entity('tiendas')
export class Tienda {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100, unique: true })
  codigoInterno: string;

  @Column('varchar', { length: 255 })
  nombreComercial: string;

  // Referencia al Usuario responsable; la relacion se integrara posteriormente.
  @Column('uuid')
  responsableId: string;

  @Column('varchar', { length: 50, unique: true })
  rut: string;

  @Column('varchar', { length: 255 })
  direccion: string;

  @Column('varchar', { length: 30 })
  telefono: string;

  @Column({
    type: 'enum',
    enum: EstadoCaptacion,
  })
  estadoCaptacion: EstadoCaptacion;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
