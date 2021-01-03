import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PatientProfile } from "./PatientProfile";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @PrimaryColumn()
  email: string;

  @Column({ nullable: true })
  verifyEmailHash?: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column()
  password: string;

  @Column({ default: false })
  isVerified?: boolean;

  @Column({ default: false })
  isAdmin?: boolean;

  @Column({ default: false })
  isSuperUser?: boolean;

  @Column({ default: false })
  vaccinated?: boolean;

  @Column()
  state: number;

  @Column({ nullable: true, type: "float8" })
  covidVulnerabilityScore?: number;

  @OneToOne(() => PatientProfile)
  @JoinColumn()
  patientProfile?: PatientProfile;
}
