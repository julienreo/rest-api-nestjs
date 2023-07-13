import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/domain/resources/users/user.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../roles/role.model';

@Entity()
export class Company {
  @ApiProperty({ description: 'The ID of a company.' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The name of a company.' })
  @Column()
  name: string;

  @ApiProperty({ description: 'The address of a company.' })
  @Column()
  address: string;

  @ApiProperty({ description: 'The postcode of a company.' })
  @Column()
  postcode: string;

  @ApiProperty({ description: 'The city of a company.' })
  @Column()
  city: string;

  @ApiProperty({ description: 'The country of a company.' })
  @Column()
  country: string;

  @ApiProperty({ description: 'The date of creation of a company.' })
  @CreateDateColumn({ type: 'timestamptz', precision: 3, select: false })
  createdAt: Date;

  @ApiProperty({ description: 'The date of update of a company.' })
  @UpdateDateColumn({ type: 'timestamptz', precision: 3, select: false })
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Role, (role) => role.id)
  roles: Role[];
}
