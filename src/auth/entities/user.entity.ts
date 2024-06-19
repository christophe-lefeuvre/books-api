import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  Admin = 'admin',
  Viewer = 'viewer',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;
  @Column()
  password: string;

  @Column({ enum: Role, default: Role.Viewer })
  role: string;
}
