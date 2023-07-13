import { Company } from 'src/domain/resources/companies/company.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Permission } from '../permissions/permission.model';
import { User } from '../users/user.model';
import { Role as UserRole } from './enums/role.enum';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  name: UserRole;

  @CreateDateColumn({ type: 'timestamptz', precision: 3, select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3, select: false })
  updatedAt: Date;

  @ManyToOne(() => Company, (company) => company.id)
  company: Company;

  @OneToMany(() => User, (user) => user.id)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.id, {
    cascade: true,
  })
  @JoinTable()
  permissions: Permission[];
}
