import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @PrimaryColumn()
  email: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  password: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ nullable: true })
  covidVaccineScore: number;
}
