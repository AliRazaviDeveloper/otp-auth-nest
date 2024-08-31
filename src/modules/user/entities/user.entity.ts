import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OtpEntity } from './otp.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  email: string;
  @Column({ nullable: true })
  password: string;

  @Column({ nullable: false, unique: true })
  phone: string;

  @Column({ default: false })
  verify_at: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  otp_id: number;

  @JoinColumn()
  @OneToOne(() => OtpEntity, (otp) => otp.user)
  otp: OtpEntity;
}
