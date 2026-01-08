import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;

  @Column({ type: 'int', nullable: true })
  userId?: number;

  @Column({ type: 'json', nullable: true })
  meta?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
