import { ApiProperty } from '@nestjs/swagger';
import { Company } from 'src/domain/resources/companies/company.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../roles/role.model';

@Entity()
export class User {
  @ApiProperty({ description: 'The ID of a user.' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The name of a user.' })
  @Column()
  firstname: string;

  @ApiProperty({ description: 'The lastname of a user.' })
  @Column()
  lastname: string;

  @ApiProperty({ description: 'The email of a user.' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'The password of a user.' })
  @Column({ select: false })
  password: string;

  @ApiProperty({ description: 'The date of creation of a user.' })
  @CreateDateColumn({ type: 'timestamptz', precision: 3, select: false })
  createdAt: Date;

  @ApiProperty({ description: 'The date of update of a user.' })
  @UpdateDateColumn({ type: 'timestamptz', precision: 3, select: false })
  updatedAt: Date;

  @ManyToOne(() => Company, (company) => company.id)
  company: Company;

  @ManyToOne(() => Role, (role) => role.id)
  role: Role;
}
