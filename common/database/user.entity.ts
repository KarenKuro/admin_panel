import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PhotoEntity } from './photo.entity';
import { Transform } from 'class-transformer';
import { FileHelpers } from '@common/helpers';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  patronymic: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @OneToOne(() => PhotoEntity)
  @JoinColumn({ name: 'photo_id' })
  @Transform(({ value }) => {
    return FileHelpers.generatePath(value?.path);
  })
  photo: PhotoEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
