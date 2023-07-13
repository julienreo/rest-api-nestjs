import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../roles/role.model';
import { Permission as RolePermission } from './enums/permission.enum';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RolePermission,
  })
  name: RolePermission;

  @CreateDateColumn({ type: 'timestamptz', precision: 3, select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', precision: 3, select: false })
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.id, {
    cascade: true,
  })
  roles: Role[];
}
